import { Command } from "../structures/Command.js";
import { Logger } from "../utilities/logger.js";
import { BlockBuilder } from "../helpers/ui/BlockBuilder.js";

const pingCommand: Command = {
  name: "/ping",
  description: "Responds with pong and the bot's latency",
  cooldown: 5,
  autoAck: true,
  execute: async ({ command, respond }) => {
    Logger.debug(`Received /ping command from ${command.user_id}`);
    
    // We can respond because autoAck handles the ack()
    await respond({
      response_type: "ephemeral",
      blocks: [
        BlockBuilder.header("🏓 Pong!"),
        BlockBuilder.section("The bot is alive and well."),
        BlockBuilder.context(["Running on the new Slack App Template"]),
      ]
    });
  },
};

export default pingCommand;
