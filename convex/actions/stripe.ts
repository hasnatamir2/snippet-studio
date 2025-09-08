"use node";
import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// export const updateCustomerSubscription = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         status: v.string(),
//         priceId: v.string(),
//         cancelAt: v.optional(v.number()),
//     },
//     handler: async (
//         ctx,
//         { clerkId, subscriptionId, status, priceId, cancelAt }
//     ) => {
//         const user = await ctx.db
//             .query("users")
//             .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
//             .first();
//         if (user) {
//             await ctx.db.patch(user._id, {
//                 stripeSubscriptionId: subscriptionId,
//                 subscriptionStatus: status,
//                 currentPlan: priceId,
//                 cancelAt,
//             });
//         }
//     },
// });

// export const updateCustomerStripeId = internalMutation({
//     args: { userId: v.id("users"), stripeCustomerId: v.string() },
//     handler: async (ctx, { userId, stripeCustomerId }) => {
//         await ctx.db.patch(userId, { stripeCustomerId });
//     },
// });

// export const updateSubscriptionStatus = internalMutation({
//     args: { userId: v.id("users"), subscriptionStatus: v.string() },
//     handler: async (ctx, { userId, subscriptionStatus }) => {
//         await ctx.db.patch(userId, { subscriptionStatus });
//     },
// });

export const webhook = action({
    handler: async (
        ctx,
        {
            body,
            sig,
        }: {
            body: string | Buffer<ArrayBufferLike>;
            sig: string | string[] | Buffer<ArrayBufferLike>;
        }
    ) => {
        const event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (event.type) {
            case "checkout.session.completed":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Find user by Stripe customerId
            //     const user = await ctx.runQuery(
            //         internal.queries.user.getUserByStripeCustomerId,
            //         { customerId }
            //     );
            //     if (user) {
            //         ctx.runMutation(
            //             internal.actions.stripe.updateCustomerSubscription,
            //             {
            //                 clerkId: user.clerkId,
            //                 subscriptionId: subscription.id,
            //                 status: subscription.status,
            //                 priceId: subscription.items.data[0].price.id,
            //                 cancelAt: subscription.cancel_at ?? undefined,
            //             }
            //         );
            //     }
            //     break;
            }
            default:
                console.log(`Unhandled event: ${event.type}`);
        }
    },
});

export const createCheckout = action({
    args: { priceId: v.string() },
    handler: async (ctx, { priceId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        // Look up or create customer in your "users" table
        // const user = await ctx.runMutation(
        //     internal.query.stripe.getCustomerByClerkId,
        //     { customerId: identity.subject }
        // );

        // let customerId = user?.stripeCustomerId as string;
        // if (!customerId) {
        //     const customer = await stripe.customers.create({
        //         email: identity.email ?? undefined,
        //         metadata: { clerkId: identity.subject },
        //     });
        //     if (user) {
        //         await ctx.runMutation(
        //             internal.actions.stripe.updateCustomerStripeId,
        //             {
        //                 userId: user._id,
        //                 stripeCustomerId: customer.id,
        //             }
        //         );
        //     }
        //     customerId = customer.id;
        // }

        // const session = await stripe.checkout.sessions.create({
        //     mode: "subscription",
        //     payment_method_types: ["card"],
        //     line_items: [{ price: priceId, quantity: 1 }],
        //     customer: customerId,
        //     success_url: `${process.env.APP_URL}/billing/success`,
        //     cancel_url: `${process.env.APP_URL}/billing/cancel`,
        // });

        // return { url: session.url };
    },
});

export const cancelSubscription = action({
    handler: async (ctx) => {
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) throw new Error("Not authenticated");

        // const user = await ctx.runMutation(
        //     internal.actions.stripe.getCustomerByClerkId,
        //     { customerId: identity.subject }
        // );

        // if (!user?.stripeSubscriptionId)
        //     throw new Error("No subscription found");

        // await stripe.subscriptions.update(user.stripeSubscriptionId, {
        //     cancel_at_period_end: true,
        // });

        // await ctx.runMutation(internal.actions.stripe.updateSubscriptionStatus, { userId: user._id, subscriptionStatus: "canceled" });
    },
});
