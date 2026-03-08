"use client";

import { CancelButton } from "@/components/stripe/cancel-sub-button";
import { SubscribeButton } from "@/components/stripe/subscribe-button";
import { api } from "../../../convex/_generated/api";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Check, Shield, Zap, Crown } from "lucide-react";

const FREE_FEATURES = [
    "Up to 9 snippets",
    "Public sharing",
    "Syntax highlighting",
    "28+ languages",
    "Tags & search",
];

const PRO_FEATURES = [
    "Unlimited snippets",
    "Private snippets",
    "Screenshot export",
    "AI features",
    "Priority support",
];

const BillingPage = () => {
    const { userId } = useAuth();
    const dbUser = useQuery(api.queries.user.getUserByClerkId, {
        clerkId: userId || "",
    });

    const isActive = dbUser?.subscriptionStatus === "active";

    return (
        <div className='max-w-5xl mx-auto px-4 py-12 md:py-20'>
            {/* Header */}
            <div className='text-center mb-12'>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF]'>
                        Simple, transparent
                    </span>{" "}
                    pricing
                </h1>
                <p className='mt-3 text-muted-foreground max-w-md mx-auto'>
                    Start free, upgrade when you need more power.
                </p>
                {isActive && (
                    <div className='mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-500 text-sm font-medium'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                        Pro plan active
                    </div>
                )}
            </div>

            {/* Plan cards */}
            <div className='grid md:grid-cols-2 gap-6 max-w-3xl mx-auto'>
                {/* Free */}
                <div className='rounded-xl border bg-card p-6 flex flex-col gap-5'>
                    <div>
                        <h3 className='font-bold text-xl'>Free</h3>
                        <p className='text-sm text-muted-foreground mt-0.5'>
                            For hobbyists
                        </p>
                        <div className='mt-3 flex items-baseline gap-1'>
                            <span className='text-4xl font-bold'>$0</span>
                            <span className='text-sm text-muted-foreground'>
                                /month
                            </span>
                        </div>
                    </div>
                    <ul className='space-y-2 flex-1'>
                        {FREE_FEATURES.map((f) => (
                            <li
                                key={f}
                                className='flex items-center gap-2 text-sm'
                            >
                                <Check className='w-4 h-4 text-green-500 shrink-0' />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Button variant='outline' className='w-full' disabled>
                        {isActive ? "Free plan" : "Current plan"}
                    </Button>
                </div>

                {/* Pro */}
                <div className='rounded-xl border border-primary bg-primary/5 p-6 flex flex-col gap-5 shadow-lg relative overflow-hidden'>
                    <div className='absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF]' />
                    <div>
                        <div className='flex items-center gap-2'>
                            <h3 className='font-bold text-xl'>Pro</h3>
                            <span className='px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium'>
                                Most popular
                            </span>
                        </div>
                        <p className='text-sm text-muted-foreground mt-0.5'>
                            For serious developers
                        </p>
                        <div className='mt-3 flex items-baseline gap-1'>
                            <span className='text-4xl font-bold'>$9</span>
                            <span className='text-sm text-muted-foreground'>
                                /month
                            </span>
                        </div>
                    </div>
                    <ul className='space-y-2 flex-1'>
                        {PRO_FEATURES.map((f) => (
                            <li
                                key={f}
                                className='flex items-center gap-2 text-sm'
                            >
                                <Check className='w-4 h-4 text-green-500 shrink-0' />
                                {f}
                            </li>
                        ))}
                    </ul>
                    {!userId ? (
                        <SignInButton>
                            <Button className='w-full bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] text-white border-0 hover:opacity-90'>
                                Sign in to upgrade
                            </Button>
                        </SignInButton>
                    ) : isActive ? (
                        <CancelButton />
                    ) : (
                        <SubscribeButton />
                    )}
                </div>
            </div>

            {/* Active subscription info */}
            {isActive && (
                <div className='mt-8 max-w-3xl mx-auto rounded-xl border bg-card p-5 flex gap-4'>
                    <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                        <Crown className='w-4 h-4 text-primary' />
                    </div>
                    <div>
                        <h4 className='font-semibold text-sm'>
                            Pro subscription
                        </h4>
                        <p className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>
                            Renews monthly · Cancel anytime. Canceling will keep
                            your Pro access until the end of the current billing
                            period.
                        </p>
                    </div>
                </div>
            )}

            {/* Trust row */}
            <div className='mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                    <Shield className='w-4 h-4' />
                    Secure payments via Stripe
                </span>
                <span className='flex items-center gap-1.5'>
                    <Zap className='w-4 h-4' />
                    Cancel anytime
                </span>
                <span className='flex items-center gap-1.5'>
                    <Check className='w-4 h-4' />
                    No hidden fees
                </span>
            </div>
        </div>
    );
};

export default BillingPage;
