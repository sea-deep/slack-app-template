import { App } from "@slack/bolt";
import { env } from "./utilities/env.js";
import { Logger } from "./utilities/logger.js";
import { loadCommands } from "./loaders/commandLoader.js";
import { loadEvents } from "./loaders/eventLoader.js";
import { loadActions } from "./loaders/actionLoader.js";
import { loadViews } from "./loaders/viewLoader.js";
import { loadShortcuts } from "./loaders/shortcutLoader.js";

Logger.info("Initializing Slack Bot...");

const app = new App({
  token: env.SLACK_BOT_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
  appToken: env.SLACK_APP_TOKEN,
  socketMode: true, // Local development frictionless socket mode
  port: parseInt(env.PORT || "3000"),
});

// Global Error Catching
app.error(async (error) => {
  Logger.error("Unhandled Bolt Error:", error);
});

async function main() {
  try {
    // Dynamically load handlers
    await loadCommands(app);
    await loadEvents(app);
    await loadActions(app);
    await loadViews(app);
    await loadShortcuts(app);

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
