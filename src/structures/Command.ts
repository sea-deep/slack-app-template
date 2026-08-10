import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";

export interface Command {
  name: string;
  description?: string;
  adminOnly?: boolean;
  cooldown?: number;
  disabled?: boolean;
  autoAck?: boolean; // Defaults to true
  execute: (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
}
