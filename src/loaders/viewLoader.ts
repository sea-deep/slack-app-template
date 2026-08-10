import { App } from "@slack/bolt";
import { resolveFiles } from "../utilities/pathResolver.js";
import { Logger } from "../utilities/logger.js";
import { View } from "../structures/View.js";
import { checkGuards } from "../utilities/guards.js";

export async function loadViews(app: App): Promise<void> {
  let count = 0;
  try {
    const fileUrls = await resolveFiles("views");

    for (const fileUrl of fileUrls) {
      const module = await import(fileUrl);
      const view: View = module.default;

      if (!view || !view.callbackId) continue;

      if (view.disabled) {
        Logger.debug(`Skipping disabled view: ${view.callbackId}`);
        continue;
      }

      const autoAck = view.autoAck !== false; // default true

      app.view(view.callbackId, async (args) => {
        const { ack, body } = args;
        const userId = body.user.id;
        const viewName = view.callbackId instanceof RegExp ? view.callbackId.source : view.callbackId;

        const allowed = await checkGuards(
          {
            name: viewName,
            adminOnly: view.adminOnly,
            cooldown: view.cooldown,
          },
          userId,
          { ack }, // Views don't typically use respond
          autoAck
        );

        if (!allowed) return;

        try {
          await view.execute(args);
        } catch (error) {
          Logger.error(`Error executing view ${viewName}:`, error);
        }
      });

      count++;
    }

    Logger.info(`Loaded ${count} view(s)`);
  } catch (error) {
    Logger.error("Error loading views:", error);
  }
}
