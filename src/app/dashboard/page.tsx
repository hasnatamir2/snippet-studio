import React, { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import SnippetsList from "@/components/snippets/snippets-list";
import { SnippetUsageTracker } from "@/components/snippets/snippet-usage-tracker";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        return (
            <div className='py-20 text-center'>
                <h2 className='text-2xl font-semibold'>Please sign in</h2>
                <p className='mt-3 text-muted-foreground'>
                    Sign in to manage your snippets and workspace.
                </p>
            </div>
        );
    }

    const name =
        user.firstName ??
        user.emailAddresses[0].emailAddress.split("@")[0];

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Welcome back, {name}
                    </h1>
                    <p className='text-sm text-muted-foreground mt-0.5'>
                        Manage your code snippets
                    </p>
                </div>
                <Button asChild className='gap-2'>
                    <Link href='/new'>
                        <Plus className='w-4 h-4' />
                        New snippet
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <Suspense fallback={null}>
                <SnippetUsageTracker />
            </Suspense>

            {/* Snippets */}
            <div className='mt-8'>
                <Suspense
                    fallback={
                        <p className='text-muted-foreground text-sm'>
                            Loading snippets…
                        </p>
                    }
                >
                    <SnippetsList />
                </Suspense>
            </div>
        </div>
    );
}
