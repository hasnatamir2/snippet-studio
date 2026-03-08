"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

import { useAction } from "convex/react";

import { StripeWrapper } from "@/components/stripe/stripe-wrapper";
import StripePaymentForm from "@/components/stripe/payment-form";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Check, Crown } from "lucide-react";

const PRO_FEATURES = [
    "Unlimited snippets",
    "Private snippets",
    "Screenshot export",
    "AI features",
    "Priority support",
];

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
            <div className='max-w-md mx-auto px-4 py-20 text-center'>
                <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4'>
                    <Lock className='w-5 h-5 text-primary' />
                </div>
                <h2 className='text-xl font-bold'>Sign in to continue</h2>
                <p className='mt-2 text-sm text-muted-foreground mb-6'>
                    You need an account to complete your purchase.
                </p>
                <SignInButton>
                    <Button className='w-full bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] text-white border-0 hover:opacity-90'>
                        Sign in
                    </Button>
                </SignInButton>
            </div>
        );

    if (!clientSecret)
        return (
            <div className='flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground'>
                <Loader2 className='w-6 h-6 animate-spin' />
                <p className='text-sm'>Setting up your subscription…</p>
            </div>
        );

    return (
        <div className='max-w-5xl mx-auto px-4 py-10 md:py-16'>
            <div className='grid md:grid-cols-2 gap-8 items-start'>
                {/* Left — plan summary */}
                <div className='space-y-6'>
                    <div>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-4'>
                            <Crown className='w-3.5 h-3.5' />
                            Pro plan
                        </div>
                        <h1 className='text-2xl font-bold'>
                            Upgrade to Pro
                        </h1>
                        <p className='text-muted-foreground mt-1 text-sm'>
                            Everything you need for serious development.
                        </p>
                    </div>

                    <div className='rounded-xl border bg-card p-5'>
                        <div className='flex items-baseline gap-1 mb-4'>
                            <span className='text-4xl font-bold'>$9</span>
                            <span className='text-muted-foreground text-sm'>
                                /month
                            </span>
                        </div>
                        <ul className='space-y-2.5'>
                            {PRO_FEATURES.map((f) => (
                                <li
                                    key={f}
                                    className='flex items-center gap-2.5 text-sm'
                                >
                                    <div className='w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center shrink-0'>
                                        <Check className='w-2.5 h-2.5 text-green-500' />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className='text-xs text-muted-foreground'>
                        Cancel anytime from your billing settings. You&apos;ll
                        keep Pro access until the end of your billing period.
                    </p>
                </div>

                {/* Right — payment form */}
                <div>
                    <StripeWrapper clientSecret={clientSecret}>
                        <StripePaymentForm subscriptionId={subscriptionId} />
                    </StripeWrapper>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
