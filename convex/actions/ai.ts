"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-haiku-4-5-20251001";

function extractText(response: Anthropic.Message): string {
    const block = response.content[0];
    return block.type === "text" ? block.text : "";
}

export const suggestTags = action({
    args: {
        content: v.string(),
        language: v.string(),
    },
    handler: async (_ctx, { content, language }) => {
        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 128,
            messages: [
                {
                    role: "user",
                    content: `Suggest 3-5 tags for this ${language} code snippet. Tags should be lowercase, single words or hyphenated. Return ONLY a JSON array of strings, nothing else.\n\nCode:\n\`\`\`${language}\n${content.slice(0, 2000)}\n\`\`\``,
                },
            ],
        });

        const text = extractText(response);
        const match = text.match(/\[[\s\S]*?\]/);
        if (match) {
            try {
                const raw = JSON.parse(match[0]) as unknown[];
                return raw
                    .filter((t): t is string => typeof t === "string")
                    .map((t) => t.toLowerCase().trim())
                    .slice(0, 5);
            } catch {
                return [];
            }
        }
        return [];
    },
});

export const generateTitle = action({
    args: {
        content: v.string(),
        language: v.string(),
    },
    handler: async (_ctx, { content, language }) => {
        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 64,
            messages: [
                {
                    role: "user",
                    content: `Generate a concise, descriptive title (max 50 characters) for this ${language} code snippet. Return ONLY the title text, no quotes, no explanation.\n\nCode:\n\`\`\`${language}\n${content.slice(0, 2000)}\n\`\`\``,
                },
            ],
        });

        return extractText(response)
            .trim()
            .replace(/^["'`]|["'`]$/g, "")
            .slice(0, 60);
    },
});

export const explainCode = action({
    args: {
        snippetId: v.id("snippets"),
        content: v.string(),
        language: v.string(),
    },
    handler: async (ctx, { snippetId, content, language }): Promise<string> => {
        // Return cached explanation if available
        const cached = await ctx.runQuery(
            internal.queries.snippets._getSnippetForAi,
            { snippetId }
        );
        if (cached?.aiExplanation) return cached.aiExplanation;

        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 512,
            messages: [
                {
                    role: "user",
                    content: `Explain this ${language} code snippet for a developer. Structure your response with:\n1. **What it does** (1-2 sentences)\n2. **Key concepts** (bullet points)\n3. **One potential improvement**\n\nKeep it concise.\n\nCode:\n\`\`\`${language}\n${content.slice(0, 3000)}\n\`\`\``,
                },
            ],
        });

        const explanation = extractText(response);
        if (explanation) {
            await ctx.runMutation(
                internal.mutations.snippet.cacheAiExplanation,
                { snippetId, explanation }
            );
        }
        return explanation;
    },
});
