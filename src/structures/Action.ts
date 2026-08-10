import { SlackActionMiddlewareArgs, SlackAction, AllMiddlewareArgs } from "@slack/bolt";

export interface Action<ActionType extends SlackAction = SlackAction> {
  actionId: string | RegExp;
  adminOnly?: boolean;
  cooldown?: number;
  disabled?: boolean;
  autoAck?: boolean;
  channelType?: "direct_message" | "public_channel" | "private_channel" | "any";
  workspaceRestriction?: string[];
  execute: (args: SlackActionMiddlewareArgs<ActionType> & AllMiddlewareArgs) => Promise<void>;
}
