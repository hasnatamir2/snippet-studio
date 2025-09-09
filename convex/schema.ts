// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),         // Clerk user ID
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    subscriptionTier: v.string(), // "free" | "pro"
    currentPlan: v.optional(v.string()), // Stripe price ID
    subscriptionStatus: v.optional(v.string()), // "active" | "canceled" | "past_due" | null
    cancelAt: v.optional(v.number()), // timestamp
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  snippets: defineTable({
    userId: v.id("users"),       // owner
    title: v.string(),
    content: v.string(),
    language: v.string(),
    tags: v.optional(v.array(v.string())),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId_createdAt", ["userId", "createdAt"]),

  snippetShares: defineTable({
    snippetId: v.id("snippets"),
    sharedWith: v.string(), // email or Clerk ID (future multi-user)
    permission: v.string(), // "view" | "edit"
    createdAt: v.number(),
  }).index("by_snippetId", ["snippetId"]),

  plans: defineTable({
    name: v.string(),           // "Starter", "Pro"
    priceId: v.string(),        // Stripe price ID
    features: v.array(v.string()),
  }).index("by_name", ["name"]),

  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),         // "create_snippet", "update_snippet", "delete_snippet"
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
