// "use node";
// import { v } from "convex/values";
// import { action, internalMutation, internalQuery } from "../_generated/server";
// import { internal } from "../_generated/api";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {});

// export const getUserByStripeCustomerId = internalQuery({
//     args: { customerId: v.string() },
//     handler: async (ctx, { customerId }) => {
//         return ctx.db
//             .query("users")
//             .filter((q) => q.eq(q.field("stripeCustomerId"), customerId))
//             .unique();
//     },
// });

// export const updateCustomerSubscription = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         status: v.string(),
//         priceId: v.string(),
//         cancelAt: v.optional(v.number()),
//     },
//     handler: async (ctx, { clerkId, subscriptionId, status, priceId, cancelAt }) => {
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

// export const webhook = action({
//     handler: async (
//         ctx,
//         {
//             body,
//             sig,
//         }: {
//             body: string | Buffer<ArrayBufferLike>;
//             sig: string | string[] | Buffer<ArrayBufferLike>;
//         }
//     ) => {
//         const event = stripe.webhooks.constructEvent(
//             body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         );

//         switch (event.type) {
//             case "checkout.session.completed":
//             case "customer.subscription.updated":
//             case "customer.subscription.deleted": {
//                 const subscription = event.data.object as Stripe.Subscription;
//                 const customerId = subscription.customer as string;

//                 // Find user by Stripe customerId
//                 const user = await ctx.runQuery(internal.actions.stripeWebhook.getUserByStripeCustomerId, { customerId });
//                 if (user) {
//                     ctx.runMutation(internal.actions.stripeWebhook.updateCustomerSubscription, {
//                         clerkId: user.clerkId,
//                         subscriptionId: subscription.id,
//                         status: subscription.status,
//                         priceId: subscription.items.data[0].price.id,
//                         cancelAt: subscription.cancel_at ?? undefined,
//                     });
//                 }
//                 break;
//             }
//             default:
//                 console.log(`Unhandled event: ${event.type}`);
//         }
//     },
// });
