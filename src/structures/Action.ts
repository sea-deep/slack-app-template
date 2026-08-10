import { SlackActionMiddlewareArgs, SlackAction, AllMiddlewareArgs } from "@slack/bolt";

export interface Action<ActionType extends SlackAction = SlackAction> {
  actionId: string | RegExp;
  adminOnly?: boolean;
  cooldown?: number;
  disabled?: boolean;
  autoAck?: boolean; // Defaults to true
  execute: (args: SlackActionMiddlewareArgs<ActionType> & AllMiddlewareArgs) => Promise<void>;
}
