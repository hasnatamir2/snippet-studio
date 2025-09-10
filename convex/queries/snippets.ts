import { v } from "convex/values";
import { query } from "../_generated/server";

export const getSnippets = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) throw null;
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
        const identity = await ctx.auth.getUserIdentity();
        const snippet = await ctx.db.get(snippetId);
        if (!snippet) return null;

        // Public snippets are visible to everyone
        if (snippet.isPublic) return snippet;
        if (!identity || identity.subject !== snippet.userId) {
            return null;
        }
        return snippet;
    },
});

export const getPublicSnippetCount = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("isPublic"), true))
            .filter((q) => q.eq(q.field("userId"), identity?.subject))
            .order("desc")
            .collect();
        return snippets.length;
    },
});

export const getPrivateSnippetCount = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("isPublic"), false))
            .filter((q) => q.eq(q.field("userId"), identity?.subject))
            .order("desc")
            .collect();
        return snippets.length;
    },
});

export const getUsage = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) throw null;

        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("userId"), user._id))
            .collect();

        return {
            count: snippets.length,
            limit: user.subscriptionTier === "pro" ? Infinity : 9,
        };
    },
});
