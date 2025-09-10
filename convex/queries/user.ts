import { query, internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const _getUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .unique();
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .unique();
  },
});

export const getUserByStripeCustomerId = internalQuery({
    args: { customerId: v.string() },
    handler: async (ctx, { customerId }) => {
        return ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("stripeCustomerId"), customerId))
            .unique();
    },
});