import { App } from "@slack/bolt";
import { resolveFiles } from "../utilities/pathResolver.js";
import { Logger } from "../utilities/logger.js";
import { Action } from "../structures/Action.js";
import { checkGuards } from "../utilities/guards.js";

export async function loadActions(app: App): Promise<void> {
  let count = 0;
  try {
    const fileUrls = await resolveFiles("actions");

    for (const fileUrl of fileUrls) {
      const module = await import(fileUrl);
      const action: Action = module.default;

      if (!action || !action.actionId) continue;

      if (action.disabled) {
        Logger.debug(`Skipping disabled action: ${action.actionId}`);
        continue;
      }

      const autoAck = action.autoAck !== false; // default true

      app.action(action.actionId, async (args) => {
        const { ack, respond, body } = args;
        const userId = body.user.id;
        const actionName = action.actionId instanceof RegExp ? action.actionId.source : action.actionId;

        const allowed = await checkGuards(
          {
            name: actionName,
            adminOnly: action.adminOnly,
            cooldown: action.cooldown,
            channelType: action.channelType,
            workspaceRestriction: action.workspaceRestriction,
          },
          userId,
          { 
            ack, 
            respond,
            channelName: body.channel?.name,
            workspaceId: body.team?.id
          },
          autoAck
        );

        if (!allowed) return;

        try {
          await action.execute(args);
        } catch (error) {
          Logger.error(`Error executing action ${actionName}:`, error);
          if (respond) {
            await respond("An error occurred while executing this action.").catch(() => {});
          }
        }
      });

      count++;
    }

    Logger.info(`Loaded ${count} action(s)`);
  } catch (error) {
    Logger.error("Error loading actions:", error);
  }
}
