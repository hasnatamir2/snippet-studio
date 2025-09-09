"use client";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import SnippetCard from "./snippet-card";

export default function SnippetsListClient() {
    const { userId } = useAuth();

    const snippets = useQuery(api.queries.snippets.getSnippets, {
        clerkId: userId || "",
    });
    if (!userId) return <div>Please sign in to see snippets.</div>;

    if (snippets === undefined) {
        return <p className='text-gray-500'>Loading....</p>;
    }

    return (
        <div className='mt-6 space-y-4 space-x-4 flex flex-wrap w-fit'>
            {snippets.map((s) => (
                <li key={s._id} className='list-none'>
                    <SnippetCard {...s} />
                    
                </li>
            ))}
        </div>
    );
}
