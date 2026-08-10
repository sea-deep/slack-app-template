import { SlackShortcutMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";

export interface Shortcut {
  callbackId: string | RegExp;
  adminOnly?: boolean;
  cooldown?: number;
  disabled?: boolean;
  autoAck?: boolean;
  workspaceRestriction?: string[];
  execute: (args: SlackShortcutMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
}
