import { CancelButton } from "@/components/stripe/cancel-sub-button";
import { SubscribeButton } from "@/components/stripe/subscribe-button";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import React from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

const BillingPage = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }
    const dbUser = await fetchQuery(api.queries.user.getUserByClerkId, {
        clerkId: user.id,
    });

    return (
        <div className='text-center mt-20'>
            <h2>Manage your Subscription</h2>
            <p>
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
                    {dbUser?.subscriptionStatus !== "active" ? (
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
