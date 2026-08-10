import { Event } from "../structures/Event.js";
import { Logger } from "../utilities/logger.js";

const appMentionEvent: Event<"app_mention"> = {
  name: "app_mention",
  execute: async ({ event, say }) => {
    Logger.debug(`Received app_mention from ${event.user}`);
    
    await say({
      text: `Hello there, <@${event.user}>! How can I help you today?`,
    });
  },
};

export default appMentionEvent;
