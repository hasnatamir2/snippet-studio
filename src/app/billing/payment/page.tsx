"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

import { useAction, useQuery } from "convex/react";

import { StripeWrapper } from "@/components/stripe/stripe-wrapper";
import StripePaymentForm from "@/components/stripe/payment-form";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

const PaymentPage = () => {
    const { userId } = useAuth();
    const createPaymentIntent = useAction(
        api.actions.stripe.createPaymentIntent
    );
    const customer = useQuery(api.queries.user.getUserByClerkId, {
        clerkId: userId || "",
    });
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const init = async (customerId: string) => {
            const res = await createPaymentIntent({
                priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
                customerId,
            });
            setClientSecret(res.clientSecret);
        };
        if (customer && customer.stripeCustomerId)
            init(customer.stripeCustomerId);
    }, [createPaymentIntent, customer]);

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
            <StripePaymentForm />
        </StripeWrapper>
    );
};

export default PaymentPage;
