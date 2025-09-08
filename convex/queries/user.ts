import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .unique();
  },
});

export const getUserByStripeCustomerId = query({
    args: { customerId: v.string() },
    handler: async (ctx, { customerId }) => {
        return ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("stripeCustomerId"), customerId))
            .unique();
    },
});