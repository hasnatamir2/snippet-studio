"use client";

import { CancelButton } from "@/components/stripe/cancel-sub-button";
import { SubscribeButton } from "@/components/stripe/subscribe-button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";

const BillingPage = () => {
    const { userId } = useAuth();
    const dbUser = useQuery(api.queries.user.getUserByClerkId, {
        clerkId: userId || "",
    });

    return (
        <div className='md:my-16 my-4 px-4 text-center'>
            <h2 className='md:text-4xl text-2xl font-bold'>
                Manage your Subscription
            </h2>
            <p className='mt-4 text-sm'>
                Billing details and subscription management will be handled
                here.
            </p>

            <Card className='max-w-md mx-auto mt-10 p-6'>
                <CardTitle className='text-5xl'>Pro Plan</CardTitle>
                <CardContent>
                    <p className='mb-4 text-gray-500'>
                        <span className='text-3xl font-bold text-black'>
                            $9{" "}
                        </span>
                        / month
                    </p>
                    <p>Unlimited snippets</p>
                </CardContent>
                <CardFooter>
                    {!userId ? (
                        <SignInButton>
                            <Button className='w-full'>Sign in</Button>
                        </SignInButton>
                    ) : dbUser?.subscriptionStatus !== "active" ? (
                        <SubscribeButton />
                    ) : (
                        <CancelButton />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default BillingPage;
