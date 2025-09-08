import { v } from "convex/values";
import { mutation } from "../_generated/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {});

export const createCheckout = mutation({
  args: { priceId: v.string() },
  handler: async (ctx, { priceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // You can store mapping of Clerk user → Stripe customer in Convex
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .unique();

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: identity.email ?? undefined,
        metadata: { clerkId: identity.subject },
      });
      // Save customer ID
      if (user) {
        await ctx.db.patch(user._id, { stripeCustomerId: customer.id });
      }
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      success_url: `${process.env.APP_URL}/billing/success`,
      cancel_url: `${process.env.APP_URL}/billing/cancel`,
    });

    return { url: session.url };
  },
});

export const cancelSubscription = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .unique();

    if (!user?.stripeSubscriptionId)
      throw new Error("No subscription found");

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await ctx.db.patch(user._id, { subscriptionStatus: "canceled" });
  },
});