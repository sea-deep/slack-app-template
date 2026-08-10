import { SlackEventMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";

export interface Event<EventType extends string = string> {
  name: EventType;
  disabled?: boolean;
  execute: (args: SlackEventMiddlewareArgs<EventType> & AllMiddlewareArgs) => Promise<void>;
}
