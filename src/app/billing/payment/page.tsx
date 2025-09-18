"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

import { useAction } from "convex/react";

import { StripeWrapper } from "@/components/stripe/stripe-wrapper";
import StripePaymentForm from "@/components/stripe/payment-form";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

const PaymentPage = () => {
    const { userId } = useAuth();
    const createPaymentIntent = useAction(
        api.actions.stripe.createPaymentIntent
    );
    const createSubscription = useAction(api.actions.stripe.createSubscription);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const res = await createSubscription({
                priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
                clerkId: userId ?? "",
            });
            setSubscriptionId(res.subscriptionId);
            setClientSecret(res.clientSecret);
        };
        if (userId) init();
    }, [createPaymentIntent, createSubscription, userId]);

    if (!userId)
        return (
            <div>
                <h4>Please sign-in before completing Check-out</h4>
                <SignInButton>
                    <Button className='w-full'>Sign in</Button>
                </SignInButton>
            </div>
        );
    if (!clientSecret) return <div>Loading...</div>;

    return (
        <StripeWrapper clientSecret={clientSecret}>
            <StripePaymentForm subscriptionId={subscriptionId} />
        </StripeWrapper>
    );
};

export default PaymentPage;
