import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createSnippet = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        language: v.string(),
        isPublic: v.boolean(),
    },
    handler: async (ctx, { title, content, language, isPublic }) => {
        const now = Date.now();
        const clerkUserId = await ctx.auth.getUserIdentity();
        if (!clerkUserId) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) =>
                q.eq("clerkId", clerkUserId.subject)
            )
            .first();

        if (!user) throw new Error("User not found in Convex");

        const snippetId = await ctx.db.insert("snippets", {
            userId: user._id,
            title,
            content,
            language,
            isPublic,
            createdAt: now,
            updatedAt: now,
        });
        await ctx.db.insert("auditLogs", {
            userId: user._id,
            action: "create_snippet",
            metadata: { snippetId },
            createdAt: now,
        });
        return snippetId;
    },
});

export const deleteSnippet = mutation({
    args: { snippetId: v.id("snippets"), userId: v.id("users") },
    handler: async (ctx, { snippetId, userId }) => {
        const snippet = await ctx.db.get(snippetId);
        if (!snippet) {
            throw new Error("Snippet not found");
        }
        if (snippet.userId !== userId) {
            throw new Error("Not authorized to delete this snippet");
        }
        await ctx.db.delete(snippetId);
        await ctx.db.insert("auditLogs", {
            userId,
            action: "delete_snippet",
            metadata: { snippetId },
            createdAt: Date.now(),
        });
    },
});

export const updateSnippet = mutation({
    args: {
        snippetId: v.id("snippets"),
        userId: v.id("users"),
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, { snippetId, userId, title, content }) => {
        const snippet = await ctx.db.get(snippetId);
        if (!snippet) {
            throw new Error("Snippet not found");
        }
        if (snippet.userId !== userId) {
            throw new Error("Not authorized to update this snippet");
        }
        await ctx.db.patch(snippetId, {
            title,
            content,
            updatedAt: Date.now(),
        });
        await ctx.db.insert("auditLogs", {
            userId,
            action: "update_snippet",
            metadata: { snippetId },
            createdAt: Date.now(),
        });
    },
});

export const toggleSnippetVisibility = mutation({
    args: { snippetId: v.id("snippets"), userId: v.id("users") },
    handler: async (ctx, { snippetId, userId }) => {
        const snippet = await ctx.db.get(snippetId);
        if (!snippet) {
            throw new Error("Snippet not found");
        }
        if (snippet.userId !== userId) {
            throw new Error("Not authorized to change visibility of this snippet");
        }
        await ctx.db.patch(snippetId, {
            isPublic: !snippet.isPublic,
            updatedAt: Date.now(),
        });
        await ctx.db.insert("auditLogs", {
            userId,
            action: "toggle_snippet_visibility",
            metadata: { snippetId, newVisibility: !snippet.isPublic },
            createdAt: Date.now(),
        }); 
    }
});