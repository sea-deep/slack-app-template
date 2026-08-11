import { App } from "@slack/bolt";
import { env } from "./utilities/env.js";
import { Logger } from "./utilities/logger.js";
import { loadComponents } from "./handlers/loadComponents.js";
import { commands, actions, views, shortcuts, events } from "./utilities/collections.js";
import { checkGuards } from "./utilities/guards.js";

Logger.info("Initializing Slack Bot...");

const app = new App({
  token: env.SLACK_BOT_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
  appToken: env.SLACK_APP_TOKEN,
  socketMode: true,
  port: parseInt(env.PORT || "3000"),
});

// Global Error Catching
app.error(async (error) => {
  Logger.error("Unhandled Bolt Error:", error);
});

async function main() {
  try {
    // 1. Load all components into memory Maps
    await loadComponents();

    // 2. Bind Commands
    for (const [name, command] of commands.entries()) {
      if (command.disabled) continue;
      app.command(name, async (args) => {
        const { ack, respond, payload } = args;
        const autoAck = command.autoAck !== false;
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
        if (allowed) await command.execute(args);
      });
    }

    // 3. Bind Actions
    for (const [id, action] of actions.entries()) {
      if (action.disabled) continue;
      app.action(id, async (args) => {
        const { ack, respond, body, payload } = args;
        const autoAck = action.autoAck !== false;
        const userId = body.user.id;
        const channelName = (body as any).channel?.name;
        const workspaceId = body.team?.id;

        const allowed = await checkGuards(
          {
            name: String(action.actionId),
            adminOnly: action.adminOnly,
            cooldown: action.cooldown,
            channelType: action.channelType,
            workspaceRestriction: action.workspaceRestriction,
          },
          userId,
          { 
            ack, 
            respond,
            channelName,
            workspaceId
          },
          autoAck
        );
        if (allowed) await action.execute(args);
      });
    }

    // 4. Bind Views
    for (const [id, view] of views.entries()) {
      if (view.disabled) continue;
      app.view(id, async (args) => {
        const { ack, body } = args;
        const autoAck = view.autoAck !== false;
        const userId = body.user.id;
        
        const allowed = await checkGuards(
          {
            name: String(view.callbackId),
            adminOnly: view.adminOnly,
            cooldown: view.cooldown,
            workspaceRestriction: view.workspaceRestriction,
          },
          userId,
          { 
            ack,
            workspaceId: body.team?.id
          },
          autoAck
        );
        if (allowed) await view.execute(args);
      });
    }

    // 5. Bind Shortcuts
    for (const [id, shortcut] of shortcuts.entries()) {
      if (shortcut.disabled) continue;
      app.shortcut(id, async (args) => {
        const { ack, body } = args;
        const autoAck = shortcut.autoAck !== false;
        const userId = body.user.id;
        
        const allowed = await checkGuards(
          {
            name: String(shortcut.callbackId),
            adminOnly: shortcut.adminOnly,
            cooldown: shortcut.cooldown,
            workspaceRestriction: shortcut.workspaceRestriction,
          },
          userId,
          { 
            ack,
            workspaceId: body.team?.id
          },
          autoAck
        );
        if (allowed) await shortcut.execute(args);
      });
    }

    // 6. Bind Events
    for (const [name, event] of events.entries()) {
      if (event.disabled) continue;
      app.event(name, async (args) => {
        // Events don't have ack, and usually no direct user feedback channel in the same way,
        // so guards are usually minimal. We just execute them.
        await event.execute(args);
      });
    }

    // Start the app
    await app.start();
    Logger.success(`⚡️ Slack App is running in Socket Mode on port ${env.PORT}!`);
  } catch (error) {
    Logger.error("Failed to start Slack App:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.once("SIGINT", async () => {
  Logger.info("SIGINT signal received. Stopping app...");
  await app.stop();
  process.exit(0);
});

process.once("SIGTERM", async () => {
  Logger.info("SIGTERM signal received. Stopping app...");
  await app.stop();
  process.exit(0);
});
