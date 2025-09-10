"use client";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import SnippetCard from "./snippet-card";
import { Lock, LockOpen } from "lucide-react";
import { ISnippet } from "./snippet-form";
import { Button } from "../ui/button";
import Link from "next/link";

export default function SnippetsListClient() {
    const { userId } = useAuth();

    const snippets = useQuery(api.queries.snippets.getSnippets, {
        clerkId: userId || "",
    });
    const publicSnippetCount = useQuery(
        api.queries.snippets.getPublicSnippetCount
    );
    const privateSnippetCount = useQuery(
        api.queries.snippets.getPrivateSnippetCount
    );

    if (!userId) return <div>Please sign in to see snippets.</div>;

    if (snippets === undefined) {
        return <p className='text-gray-500'>Loading....</p>;
    }

    return (
        <div className='w-full'>
            <div className='flex gap-4'>
                <p className='text-sm'>
                    <LockOpen className='w-4 h-3 inline-block' /> Public:{" "}
                    <span className='text-xl'>{publicSnippetCount || 0}</span>
                </p>
                <p className='text-sm'>
                    <Lock className='w-4 h-3 inline-block' /> Private:{" "}
                    <span className='text-xl'>{privateSnippetCount || 0}</span>
                </p>
            </div>
            {snippets && snippets.length > 0 ? (
                <ul className='mt-6 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap w-full'>
                    {snippets.map((s: ISnippet) => (
                        <li key={s._id} className='col-span-1'>
                            <SnippetCard {...s} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className='w-full justify-center gap-4 flex flex-col items-center'>
                    <p className='text-gray-600'>No Snippets yet! </p>
                    <Button>
                        <Link href='/'>Create new snippet</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
