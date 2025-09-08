import { query } from "../_generated/server";

export const getSnippets = query({
    handler: async (ctx) => {
        const clerkUserId = await ctx.auth.getUserIdentity();
        if (!clerkUserId?.subject) throw new Error("Not authenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) =>
                q.eq("clerkId", clerkUserId.subject)
            )
            .first();

        if (!user) throw new Error("User not found in Convex");
        const snippets = await ctx.db
            .query("snippets")
            .filter((q) => q.eq(q.field("userId"), user._id))
            .collect();
        return snippets;
    },
});
