import React, { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SnippetsList from "@/components/snippets/snippets-list";

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
        <div className="mx-4 my-6">
            <h2 className='text-2xl font-semibold'>
                Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
            </h2>
            <Tabs defaultValue='account' className='w-full'>
                <TabsList>
                    <TabsTrigger value='account'>Account</TabsTrigger>
                    <TabsTrigger value='snippets'>My Snippets</TabsTrigger>
                </TabsList>
                <TabsContent value='account'>
                    Make changes to your account here.
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
