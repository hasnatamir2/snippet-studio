import React, { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SnippetsList from "@/components/snippets/snippets-list";
import { SnippetUsageTracker } from "@/components/snippets/snippet-usage-tracker";

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        return (
            <div className='py-12 text-center'>
                <h2 className='text-2xl font-semibold'>Please sign in</h2>
                <p className='mt-4'>
                    Sign in to manage your snippets and workspace.
                </p>
            </div>
        );
    }

    return (
        <div className='mx-4 my-6'>
            <div>
                <h2 className='text-2xl font-semibold'>
                    Welcome,{" "}
                    {user.firstName ?? user.emailAddresses[0].emailAddress}
                </h2>
            </div>
            <Tabs defaultValue='account' className='w-full'>
                <TabsList>
                    <TabsTrigger value='account'>Account</TabsTrigger>
                    <TabsTrigger value='snippets'>My Snippets</TabsTrigger>
                </TabsList>
                <TabsContent value='account'>
                    <div className='mt-4 flex w-full'>
                        <Suspense fallback={<p>Loading usage...</p>}>
                            <SnippetUsageTracker />
                        </Suspense>
                    </div>
                </TabsContent>
                <TabsContent value='snippets'>
                    <div className='mt-4 flex w-full'>
                        <Suspense fallback={<p>Loading snippets...</p>}>
                            <SnippetsList />
                        </Suspense>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
