import { config } from "../configs/config.js";
import { Logger } from "./logger.js";

// Simple in-memory cooldown store
// Map<UserId_CommandName, timestamp>
const cooldowns = new Map<string, number>();

export interface GuardOptions {
  name: string;
  adminOnly?: boolean;
  cooldown?: number; // In seconds
}

export async function checkGuards(
  options: GuardOptions,
  userId: string,
  slackContext: { ack?: () => Promise<void>; respond?: (msg: string) => Promise<any> },
  autoAck: boolean = true
): Promise<boolean> {
  const { name, adminOnly, cooldown } = options;
  const { ack, respond } = slackContext;

  // 1. Auto Acknowledge if enabled
  if (autoAck && ack) {
    try {
      await ack();
    } catch (err) {
      Logger.error(`Failed to auto-ack for ${name}`, err);
    }
  }

  // 2. Admin Check
  if (adminOnly && !config.admins.includes(userId)) {
    if (respond) {
      await respond(config.messages.adminOnly);
    }
    return false;
  }

  // 3. Cooldown Check
  if (cooldown && cooldown > 0) {
    const key = `${userId}_${name}`;
    const now = Date.now();
    const expirationTime = (cooldowns.get(key) || 0) + cooldown * 1000;

    if (now < expirationTime) {
      if (respond) {
        await respond(config.messages.cooldown);
      }
      return false;
    }

    cooldowns.set(key, now);
    
    // Cleanup cooldown map periodically or just let it be for this simple implementation
    setTimeout(() => cooldowns.delete(key), cooldown * 1000);
  }

  return true;
}
