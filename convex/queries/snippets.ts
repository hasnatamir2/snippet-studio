import { v } from "convex/values";
import { query } from "../_generated/server";

export const getSnippets = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) throw new Error("User not found in Convex");
        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("userId"), user._id))
            .order("desc")
            .collect();
        return snippets;
    },
});

export const getSnippetById = query({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, { snippetId }) => {
        const snippet = await ctx.db.get(snippetId);
        if (!snippet) throw new Error("Snippet not found");
        return snippet;
    },
});

export const getPublicSnippetCount = query({
    args: {},
    handler: async (ctx) => {
        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("isPublic"), true))
            .order("desc")
            .collect();
        return snippets.length;
    },
});

export const getPrivateSnippetCount = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) throw new Error("User not found in Convex");
        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("isPublic"), false))
            .order("desc")
            .collect();
        return snippets.length;
    },
});