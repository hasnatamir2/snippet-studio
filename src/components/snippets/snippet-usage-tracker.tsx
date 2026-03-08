"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { FileCode, Globe, Lock, Crown, Zap } from "lucide-react";

export function SnippetUsageTracker() {
    const { userId } = useAuth();

    const usage = useQuery(api.queries.snippets.getUsage, {
        clerkId: userId || "",
    });
    const user = useQuery(api.queries.user.getUserByClerkId, {
        clerkId: userId || "",
    });
    const publicCount = useQuery(api.queries.snippets.getPublicSnippetCount);
    const privateCount = useQuery(api.queries.snippets.getPrivateSnippetCount);

    if (!usage || !user) return null;

    const { count, limit } = usage;
    const isPro = user.subscriptionTier === "pro";
    const percentage = isPro ? 100 : Math.min((count / limit) * 100, 100);
    const isNearLimit = !isPro && count >= limit - 2;

    return (
        <div className='space-y-3'>
            {/* Stat cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                <div className='rounded-xl border bg-card p-4'>
                    <div className='flex items-center gap-1.5 text-muted-foreground mb-2'>
                        <FileCode className='w-3.5 h-3.5' />
                        <span className='text-xs font-medium uppercase tracking-wide'>
                            Total
                        </span>
                    </div>
                    <p className='text-3xl font-bold tabular-nums'>{count}</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                        snippets
                    </p>
                </div>

                <div className='rounded-xl border bg-card p-4'>
                    <div className='flex items-center gap-1.5 text-muted-foreground mb-2'>
                        <Globe className='w-3.5 h-3.5' />
                        <span className='text-xs font-medium uppercase tracking-wide'>
                            Public
                        </span>
                    </div>
                    <p className='text-3xl font-bold tabular-nums'>{publicCount ?? 0}</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                        shared
                    </p>
                </div>

                <div className='rounded-xl border bg-card p-4'>
                    <div className='flex items-center gap-1.5 text-muted-foreground mb-2'>
                        <Lock className='w-3.5 h-3.5' />
                        <span className='text-xs font-medium uppercase tracking-wide'>
                            Private
                        </span>
                    </div>
                    <p className='text-3xl font-bold tabular-nums'>{privateCount ?? 0}</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                        only you
                    </p>
                </div>

                <div
                    className={`rounded-xl border p-4 ${isPro ? "bg-primary/5 border-primary" : "bg-card"}`}
                >
                    <div className='flex items-center gap-1.5 text-muted-foreground mb-2'>
                        {isPro ? (
                            <Crown className='w-3.5 h-3.5 text-primary' />
                        ) : (
                            <Zap className='w-3.5 h-3.5' />
                        )}
                        <span className='text-xs font-medium uppercase tracking-wide'>
                            Plan
                        </span>
                    </div>
                    <p
                        className={`text-3xl font-bold ${isPro ? "text-primary" : ""}`}
                    >
                        {isPro ? "Pro" : "Free"}
                    </p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                        {isPro ? "unlimited snippets" : `${count}/${limit} used`}
                    </p>
                </div>
            </div>

            {/* Quota bar — free only */}
            {!isPro && (
                <div className='rounded-xl border bg-card p-4 flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium'>
                                Snippet quota
                            </p>
                            <p className='text-xs text-muted-foreground'>
                                {count} of {limit} used
                            </p>
                        </div>
                        <Button
                            asChild
                            size='sm'
                            className='bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] text-white border-0 hover:opacity-90 text-xs'
                        >
                            <Link href='/billing'>Upgrade to Pro</Link>
                        </Button>
                    </div>
                    <Progress
                        value={percentage}
                        className={`h-2 rounded-full ${isNearLimit ? "[&>div]:bg-amber-500" : ""}`}
                    />
                    {isNearLimit && (
                        <p className='text-xs text-amber-500'>
                            Almost at your limit — upgrade for unlimited
                            snippets.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
