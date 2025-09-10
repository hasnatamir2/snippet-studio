import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";

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
        if (!clerkUserId) throw new ConvexError("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) =>
                q.eq("clerkId", clerkUserId.subject)
            )
            .first();

        if (!user) throw new ConvexError("User not found in Convex");

        // Count snippets
        const snippetCount = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("userId"), user._id))
            .collect()
            .then((snips) => snips.length);

        if (user.subscriptionTier !== "pro" && snippetCount >= 9) {
            throw new ConvexError(
                "Free plan limit reached. Upgrade to Pro for unlimited snippets."
            );
        }

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
            throw new ConvexError("Snippet not found");
        }
        if (snippet.userId !== userId) {
            throw new ConvexError("Not authorized to delete this snippet");
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
        language: v.string(),
        isPublic: v.boolean(),
    },
    handler: async (
        ctx,
        { snippetId, userId, title, content, isPublic, language }
    ) => {
        const snippet = await ctx.db.get(snippetId);
        if (!snippet) {
            throw new ConvexError("Snippet not found");
        }
        if (snippet.userId !== userId) {
            throw new ConvexError("Not authorized to update this snippet");
        }
        await ctx.db.patch(snippetId, {
            title,
            content,
            language,
            isPublic,
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
            throw new ConvexError("Snippet not found");
        }
        if (snippet.userId !== userId) {
            throw new ConvexError(
                "Not authorized to change visibility of this snippet"
            );
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
    },
});