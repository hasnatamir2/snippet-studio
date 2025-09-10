"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function SnippetUsageTracker() {
    const { userId } = useAuth();

    const usage = useQuery(api.queries.snippets.getUsage, {
        clerkId: userId || "",
    }); // will implement backend
    const user = useQuery(api.queries.user.getUserByClerkId, {
        clerkId: userId || "",
    }); // get user info + plan

    if (!usage || !user) return null;

    const { count, limit } = usage;
    const isPro = user.subscriptionTier === "pro";
    const percentage = isPro ? 100 : Math.min((count / limit) * 100, 100);

    return (
        <div className='p-4 rounded-2xl border shadow-sm space-y-3 w-full'>
            <div className='flex justify-between items-center'>
                <h3 className='font-semibold text-lg'>Your Snippets</h3>
                {isPro ? (
                    <span className='text-green-600 font-medium'>
                        Pro (Unlimited)
                    </span>
                ) : (
                    <span className='text-gray-600'>
                        {count}/{limit} used
                    </span>
                )}
            </div>

            <Progress value={percentage} className='h-2 rounded-full' />

            {!isPro && (
                <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-500'>
                        Upgrade for unlimited snippets
                    </span>
                    <Button
                        asChild
                        size='sm'
                        className='bg-indigo-600 hover:bg-indigo-700'
                    >
                        <Link href='/billing'>Upgrade to Pro</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
