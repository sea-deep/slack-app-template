import { SlackViewMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";

export interface View {
  callbackId: string | RegExp;
  adminOnly?: boolean;
  cooldown?: number;
  disabled?: boolean;
  autoAck?: boolean; // Defaults to true
  execute: (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
}
