import { resolveFiles } from "../utilities/pathResolver.js";
import { Logger } from "../utilities/logger.js";
import { commands, actions, views, shortcuts, events } from "../utilities/collections.js";

/**
 * Dynamically loads all components into their respective Maps.
 */
export async function loadComponents(): Promise<void> {
  try {
    // 1. Load Commands
    const commandFiles = await resolveFiles("commands");
    for (const fileUrl of commandFiles) {
      const module = await import(fileUrl);
      const command = module.default;
      if (command && command.name) {
        commands.set(command.name, command);
      }
    }
    Logger.success(`Loaded ${commands.size} Commands.`);

    // 2. Load Actions
    const actionFiles = await resolveFiles("actions");
    for (const fileUrl of actionFiles) {
      const module = await import(fileUrl);
      const action = module.default;
      if (action && action.actionId) {
        actions.set(action.actionId, action);
      }
    }
    Logger.success(`Loaded ${actions.size} Actions.`);

    // 3. Load Views
    const viewFiles = await resolveFiles("views");
    for (const fileUrl of viewFiles) {
      const module = await import(fileUrl);
      const view = module.default;
      if (view && view.callbackId) {
        views.set(view.callbackId, view);
      }
    }
    Logger.success(`Loaded ${views.size} Views.`);

    // 4. Load Shortcuts
    const shortcutFiles = await resolveFiles("shortcuts");
    for (const fileUrl of shortcutFiles) {
      const module = await import(fileUrl);
      const shortcut = module.default;
      if (shortcut && shortcut.callbackId) {
        shortcuts.set(shortcut.callbackId, shortcut);
      }
    }
    Logger.success(`Loaded ${shortcuts.size} Shortcuts.`);

    // 5. Load Events
    const eventFiles = await resolveFiles("events");
    for (const fileUrl of eventFiles) {
      const module = await import(fileUrl);
      const event = module.default;
      if (event && event.name) {
        events.set(event.name, event);
      }
    }
    Logger.success(`Loaded ${events.size} Events.`);
  } catch (error) {
    Logger.error("Failed to load components:", error);
    process.exit(1);
  }
}
