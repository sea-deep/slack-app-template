import { App } from "@slack/bolt";
import { resolveFiles } from "../utilities/pathResolver.js";
import { Logger } from "../utilities/logger.js";
import { Event } from "../structures/Event.js";

export async function loadEvents(app: App): Promise<void> {
  let count = 0;
  try {
    const fileUrls = await resolveFiles("events");

    for (const fileUrl of fileUrls) {
      const module = await import(fileUrl);
      const event: Event = module.default;

      if (!event || !event.name) continue;

      if (event.disabled) {
        Logger.debug(`Skipping disabled event: ${event.name}`);
        continue;
      }

      app.event(event.name, async (args) => {
        try {
          await event.execute(args);
        } catch (error) {
          Logger.error(`Error executing event ${event.name}:`, error);
        }
      });

      count++;
    }

    Logger.info(`Loaded ${count} event(s)`);
  } catch (error) {
    Logger.error("Error loading events:", error);
  }
}
