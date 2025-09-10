import { ConvexError, v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";

export const ensureUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Not authenticated");

        // Check if user already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (existing) return existing._id;

        // Create new user
        return await ctx.db.insert("users", {
            clerkId: identity.subject,
            email: identity.email ?? "",
            name: identity.name ?? identity.nickname ?? "Anonymous",
            subscriptionTier: "free",
            createdAt: Date.now(),
        });
    },
});

export const updateCustomerStripeId = internalMutation({
    args: { userId: v.id("users"), stripeCustomerId: v.string() },
    handler: async (ctx, { userId, stripeCustomerId }) => {
        await ctx.db.patch(userId, { stripeCustomerId });
    },
});

export const updateSubscriptionStatus = internalMutation({
    args: {
        userId: v.id("users"),
        subscriptionStatus: v.string(),
        cancelAt: v.optional(v.number()),
    },
    handler: async (ctx, { userId, subscriptionStatus, cancelAt }) => {
        await ctx.db.patch(userId, { subscriptionStatus, cancelAt });
    },
});

export const updateCustomerSubscription = internalMutation({
    args: {
        clerkId: v.string(),
        subscriptionId: v.string(),
        status: v.string(),
        priceId: v.string(),
        cancelAt: v.optional(v.number()),
    },
    handler: async (
        ctx,
        { clerkId, subscriptionId, status, priceId, cancelAt }
    ) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .first();
        console.log(
            "Updating subscription for user:",
            { ...user },
            { clerkId, subscriptionId, status, priceId, cancelAt }
        );
        if (user) {
            await ctx.db.patch(user._id, {
                stripeSubscriptionId: subscriptionId || undefined,
                subscriptionStatus: status || undefined,
                currentPlan: priceId || undefined,
                cancelAt,
                subscriptionTier: status === "active" ? "pro" : "free",
            });
        }
    },
});

export const updateSubscriptionTier = internalMutation({
    args: {
        userId: v.id("users"),
        subscriptionTier: v.union(v.literal("free"), v.literal("pro")),
    },
    handler: async (ctx, { userId, subscriptionTier }) => {
        await ctx.db.patch(userId, { subscriptionTier });
    },
});
