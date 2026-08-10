import { App } from "@slack/bolt";
import { resolveFiles } from "../utilities/pathResolver.js";
import { Logger } from "../utilities/logger.js";
import { Command } from "../structures/Command.js";
import { checkGuards } from "../utilities/guards.js";

export async function loadCommands(app: App): Promise<void> {
  let count = 0;
  try {
    const fileUrls = await resolveFiles("commands");

    for (const fileUrl of fileUrls) {
      const module = await import(fileUrl);
      const command: Command = module.default;

      if (!command || !command.name) continue;

      if (command.disabled) {
        Logger.debug(`Skipping disabled command: ${command.name}`);
        continue;
      }

      const autoAck = command.autoAck !== false; // default true

      app.command(command.name, async (args) => {
        const { ack, respond, payload } = args;

        const allowed = await checkGuards(
          {
            name: command.name,
            adminOnly: command.adminOnly,
            cooldown: command.cooldown,
            channelType: command.channelType,
            workspaceRestriction: command.workspaceRestriction,
            requiredArgs: command.requiredArgs,
          },
          payload.user_id,
          { 
            ack, 
            respond,
            channelName: payload.channel_name,
            workspaceId: payload.team_id,
            commandText: payload.text
          },
          autoAck
        );

        if (!allowed) return;

        try {
          await command.execute(args);
        } catch (error) {
          Logger.error(`Error executing command ${command.name}:`, error);
          if (respond) {
            await respond("An error occurred while executing this command.").catch(() => {});
          }
        }
      });

      count++;
    }

    Logger.info(`Loaded ${count} slash command(s)`);
  } catch (error) {
    Logger.error("Error loading commands:", error);
  }
}
