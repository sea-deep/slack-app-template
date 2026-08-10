import { config } from "../configs/config.js";
import { Logger } from "./logger.js";

// Simple in-memory cooldown store
// Map<UserId_CommandName, timestamp>
const cooldowns = new Map<string, number>();

export interface GuardOptions {
  name: string;
  adminOnly?: boolean;
  cooldown?: number; // In seconds
  channelType?: "direct_message" | "public_channel" | "private_channel" | "any";
  workspaceRestriction?: string[];
  requiredArgs?: number;
}

export interface GuardContext {
  ack?: () => Promise<void>;
  respond?: (msg: string | any) => Promise<any>;
  channelName?: string;
  workspaceId?: string;
  commandText?: string;
}

export async function checkGuards(
  options: GuardOptions,
  userId: string,
  slackContext: GuardContext,
  autoAck: boolean = true
): Promise<boolean> {
  const { name, adminOnly, cooldown, channelType, workspaceRestriction, requiredArgs } = options;
  const { ack, respond, channelName, workspaceId, commandText } = slackContext;

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
    if (respond) await respond(config.messages.adminOnly);
    return false;
  }

  // 3. Workspace Restriction
  if (workspaceRestriction && workspaceId && !workspaceRestriction.includes(workspaceId)) {
    if (respond) await respond("This command is not allowed in this workspace.");
    return false;
  }

  // 4. Channel Type Restriction
  if (channelType && channelType !== "any" && channelName) {
    const isDirectMessage = channelName === "directmessage";
    const isPrivate = channelName === "privategroup";
    const isPublic = !isDirectMessage && !isPrivate;

    if (
      (channelType === "direct_message" && !isDirectMessage) ||
      (channelType === "private_channel" && !isPrivate) ||
      (channelType === "public_channel" && !isPublic)
    ) {
      if (respond) await respond(`This command is restricted to ${channelType}s.`);
      return false;
    }
  }

  // 5. Required Arguments Check
  if (requiredArgs !== undefined && requiredArgs > 0 && commandText !== undefined) {
    const args = commandText.trim().split(/\s+/).filter(Boolean);
    if (args.length < requiredArgs) {
      if (respond) await respond(`This command requires at least ${requiredArgs} argument(s).`);
      return false;
    }
  }

  // 6. Cooldown Check
  if (cooldown && cooldown > 0) {
    const key = `${userId}_${name}`;
    const now = Date.now();
    const expirationTime = (cooldowns.get(key) || 0) + cooldown * 1000;

    if (now < expirationTime) {
      if (respond) await respond(config.messages.cooldown);
      return false;
    }

    cooldowns.set(key, now);
    setTimeout(() => cooldowns.delete(key), cooldown * 1000);
  }

  return true;
}
