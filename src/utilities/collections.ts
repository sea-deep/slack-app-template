import { Command } from "../structures/Command.js";
import { Action } from "../structures/Action.js";
import { View } from "../structures/View.js";
import { Shortcut } from "../structures/Shortcut.js";
import { Event } from "../structures/Event.js";

// Global Maps to store loaded components
export const commands = new Map<string, Command>();
export const actions = new Map<string | RegExp, Action>();
export const views = new Map<string | RegExp, View>();
export const shortcuts = new Map<string | RegExp, Shortcut>();
export const events = new Map<string, Event>();
