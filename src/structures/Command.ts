import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";

export interface Command {
  name: string;
  description?: string;
  adminOnly?: boolean;
  cooldown?: number;
  disabled?: boolean;
  autoAck?: boolean;
  channelType?: "direct_message" | "public_channel" | "private_channel" | "any";
  workspaceRestriction?: string[];
  requiredArgs?: number;
  execute: (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
}
