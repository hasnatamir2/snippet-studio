"use node";

import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

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
        const rawBody = Buffer.isBuffer(body) ? body : Buffer.from(body);
        const event = stripe.webhooks.constructEvent(
            rawBody,
            sig as string,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (event.type) {
            case "checkout.session.completed":
            case "customer.subscription.updated": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.subscription) {
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription as string
                    );
                    const customerId = subscription.customer as string;
                    // Find user by Stripe customerId
                    const user = await ctx.runQuery(
                        internal.queries.user.getUserByStripeCustomerId,
                        { customerId }
                    );
                    if (user) {
                        await ctx.runMutation(
                            internal.mutations.users.updateCustomerSubscription,
                            {
                                clerkId: user.clerkId,
                                subscriptionId: subscription.id,
                                status: subscription.status,
                                priceId: subscription.items.data[0].price.id,
                                cancelAt: subscription.cancel_at ?? undefined,
                            }
                        );
                    }
                    break;
                }
                // const subscription = event.data.object as Stripe.Subscription;

                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const user = await ctx.runQuery(
                    internal.queries.user.getUserByStripeCustomerId,
                    { customerId }
                );
                if (user) {
                    await ctx.runMutation(
                        internal.mutations.users.updateSubscriptionTier,
                        {
                            userId: user._id,
                            subscriptionTier: "free",
                        }
                    );
                }
            }
            default:
                console.log(`Unhandled event: ${event.type}`);
        }
    },
});

export const createCheckout = action({
    args: { priceId: v.string(), clerkId: v.string() },
    handler: async (ctx, { priceId, clerkId }) => {
        const user = await ctx.runQuery(
            internal.queries.user._getUserByClerkId,
            { clerkId }
        );
        if (!user) throw new ConvexError("Not authenticated");

        let customerId = user?.stripeCustomerId as string;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
            });
            if (user) {
                await ctx.runMutation(
                    internal.mutations.users.updateCustomerStripeId,
                    {
                        userId: user._id,
                        stripeCustomerId: customer.id,
                    }
                );
            }
            customerId = customer.id;
        }
        const idempotencyKey = `sub_${customerId}_${priceId}`;

        const session = await stripe.checkout.sessions.create(
            {
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [{ price: priceId, quantity: 1 }],
                customer: customerId,
                success_url: `${process.env.APP_URL}/`,
                cancel_url: `${process.env.APP_URL}/billing`,
            },
            { idempotencyKey }
        );

        return { url: session.url };
    },
});

export const createSubscription = action({
    args: { priceId: v.string(), clerkId: v.string() },
    handler: async (ctx, { priceId, clerkId }) => {
        const user = await ctx.runQuery(
            internal.queries.user._getUserByClerkId,
            { clerkId }
        );
        if (!user) throw new ConvexError("Not authenticated");

        let customerId = user?.stripeCustomerId as string;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
            });
            if (user) {
                await ctx.runMutation(
                    internal.mutations.users.updateCustomerStripeId,
                    {
                        userId: user._id,
                        stripeCustomerId: customer.id,
                    }
                );
            }
            customerId = customer.id;
        }
        const idempotencyKey = `sub_${customerId}_${priceId}`;
        const subscription = await stripe.subscriptions.create(
            {
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: "default_incomplete",
                expand: ["latest_invoice", "latest_invoice.payment_intent"],
            },
            {
                idempotencyKey,
            }
        );

        const invoice = subscription.latest_invoice as Stripe.Invoice & {
            payment_intent?: Stripe.PaymentIntent;
        };

        let clientSecret =
            invoice?.payment_intent?.client_secret ??
            (subscription.pending_setup_intent as Stripe.SetupIntent)
                ?.client_secret ??
            null;
        if (!clientSecret) {
            const setupIntent = await stripe.setupIntents.create({
                customer: customerId,
                payment_method_types: ["card"],
                usage: "off_session", // Important for future subscription payments
            });
            clientSecret = setupIntent.client_secret;
        }
        return {
            clientSecret,
            subscriptionId: subscription.id,
        };
    },
});

export const cancelSubscription = action({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        const user = await ctx.runQuery(
            internal.queries.user._getUserByClerkId,
            { clerkId }
        );
        if (!user?.stripeSubscriptionId)
            throw new ConvexError("No subscription found");
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
            cancel_at_period_end: true,
        });
        await ctx.runMutation(
            internal.mutations.users.updateSubscriptionStatus,
            {
                userId: user._id,
                subscriptionStatus: "canceled",
                cancelAt: Date.now(),
            }
        );
    },
});

export const createPaymentIntent = action({
    args: { priceId: v.string(), clerkId: v.string() },
    handler: async (ctx, { priceId, clerkId }) => {
        // Look up price to get amount
        const user = await ctx.runQuery(
            internal.queries.user._getUserByClerkId,
            { clerkId }
        );
        if (!user) throw new ConvexError("Not authenticated");

        const customerId = user?.stripeCustomerId as string;

        const price = await stripe.prices.retrieve(priceId);

        if (!price.unit_amount) {
            throw new Error("Price has no amount");
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency,
            customer: customerId,
            setup_future_usage: "off_session",
            automatic_payment_methods: { enabled: true },
        });

        return { clientSecret: paymentIntent.client_secret };
    },
});
