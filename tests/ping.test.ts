import { describe, it, expect, vi } from "vitest";
import pingCommand from "../src/commands/ping.js";
import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";

describe("Ping Command", () => {
  it("should respond with pong and blocks", async () => {
    const mockRespond = vi.fn();
    const mockAck = vi.fn();

    const args = {
      command: { user_id: "U123456" },
      respond: mockRespond,
      ack: mockAck,
    } as unknown as SlackCommandMiddlewareArgs & AllMiddlewareArgs;

    await pingCommand.execute(args);

    expect(mockRespond).toHaveBeenCalledTimes(1);
    expect(mockRespond.mock.calls[0][0].blocks).toBeDefined();
    expect(mockRespond.mock.calls[0][0].blocks[0].text.text).toContain("Pong");
  });
});
