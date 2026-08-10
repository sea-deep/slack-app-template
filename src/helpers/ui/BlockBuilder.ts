import { SectionBlock, ActionsBlock, DividerBlock, HeaderBlock, ContextBlock } from "@slack/types";

export class BlockBuilder {
  static header(text: string): HeaderBlock {
    return {
      type: "header",
      text: {
        type: "plain_text",
        text,
        emoji: true,
      },
    };
  }

  static section(text: string, markdown: boolean = true): SectionBlock {
    return {
      type: "section",
      text: {
        type: markdown ? "mrkdwn" : "plain_text",
        text,
      },
    };
  }

  static divider(): DividerBlock {
    return {
      type: "divider",
    };
  }

  static context(elements: string[]): ContextBlock {
    return {
      type: "context",
      elements: elements.map((text) => ({
        type: "mrkdwn",
        text,
      })),
    };
  }

  static actions(elements: any[]): ActionsBlock {
    return {
      type: "actions",
      elements,
    };
  }

  static button(text: string, actionId: string, style?: "primary" | "danger"): any {
    const btn: any = {
      type: "button",
      text: {
        type: "plain_text",
        text,
        emoji: true,
      },
      action_id: actionId,
    };
    if (style) btn.style = style;
    return btn;
  }
}
