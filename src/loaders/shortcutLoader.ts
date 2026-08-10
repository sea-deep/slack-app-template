import { App } from "@slack/bolt";
import { resolveFiles } from "../utilities/pathResolver.js";
import { Logger } from "../utilities/logger.js";
import { Shortcut } from "../structures/Shortcut.js";
import { checkGuards } from "../utilities/guards.js";

export async function loadShortcuts(app: App): Promise<void> {
  let count = 0;
  try {
    const fileUrls = await resolveFiles("shortcuts");

    for (const fileUrl of fileUrls) {
      const module = await import(fileUrl);
      const shortcut: Shortcut = module.default;

      if (!shortcut || !shortcut.callbackId) continue;

      if (shortcut.disabled) {
        Logger.debug(`Skipping disabled shortcut: ${shortcut.callbackId}`);
        continue;
      }

      const autoAck = shortcut.autoAck !== false; // default true

      app.shortcut(shortcut.callbackId, async (args) => {
        const { ack, body } = args;
        const userId = body.user.id;
        const shortcutName = shortcut.callbackId instanceof RegExp ? shortcut.callbackId.source : shortcut.callbackId;

        // Shortcuts don't typically have respond, they trigger modals usually
        const allowed = await checkGuards(
          {
            name: shortcutName,
            adminOnly: shortcut.adminOnly,
            cooldown: shortcut.cooldown,
          },
          userId,
          { ack },
          autoAck
        );

        if (!allowed) return;

        try {
          await shortcut.execute(args);
        } catch (error) {
          Logger.error(`Error executing shortcut ${shortcutName}:`, error);
        }
      });

      count++;
    }

    Logger.info(`Loaded ${count} shortcut(s)`);
  } catch (error) {
    Logger.error("Error loading shortcuts:", error);
  }
}
