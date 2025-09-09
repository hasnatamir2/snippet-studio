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
