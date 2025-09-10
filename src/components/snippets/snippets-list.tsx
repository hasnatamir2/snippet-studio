"use client";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import SnippetCard from "./snippet-card";
import { Lock, LockOpen } from "lucide-react";

export default function SnippetsListClient() {
    const { userId } = useAuth();

    const snippets = useQuery(api.queries.snippets.getSnippets, {
        clerkId: userId || "",
    });
    const publicSnippetCount = useQuery(
        api.queries.snippets.getPublicSnippetCount
    );
    const privateSnippetCount = useQuery(api.queries.snippets.getPrivateSnippetCount, {
        clerkId: userId || "",
    });

    if (!userId) return <div>Please sign in to see snippets.</div>;

    if (snippets === undefined) {
        return <p className='text-gray-500'>Loading....</p>;
    }

    return (
        <div>
            <div className='flex gap-4'>
                <p className='text-sm'>
                    <LockOpen className='w-4 h-3 inline-block' /> Public: <span className='text-xl'>{publicSnippetCount || 0}</span>
                </p>
                <p className='text-sm'>
                    <Lock className='w-4 h-3 inline-block' /> Private: <span className='text-xl'>{privateSnippetCount || 0}</span>
                </p>
            </div>
            <div className='mt-6 space-y-4 space-x-4 flex flex-wrap w-fit'>
                {snippets.map((s) => (
                    <li key={s._id} className='list-none'>
                        <SnippetCard {...s} />
                    </li>
                ))}
            </div>
        </div>
    );
}
