"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import SnippetModule, { ISnippet } from "@/components/snippets/snippet-form";
import { Lock } from "lucide-react";

const SnippetPage = () => {
    const params = useParams();
    const { userId } = useAuth();
    const snippetId = params.snippetId as string; // 👈 grab it here

    const snippet = useQuery(api.queries.snippets.getSnippetById, {
        snippetId: snippetId as Id<"snippets">,
    });
    const dbUser = useQuery(api.queries.user.getUserByClerkId, {
        clerkId: userId || "",
    });
    // While query is loading
    if (snippet === undefined) {
        return <div>Loading snippet...</div>;
    }

    // Convex will throw if unauthorized or not found → snippet will be `null`
    if (snippet === null) {
        return (
            <div className='w-full text-center py-10 text-gray-600 flex justify-center items-center gap-2'>
                <Lock /> Snippet not found or you don’t have access.
            </div>
        );
    }

    const isSnippet =
        typeof snippet === "object" &&
        snippet !== null &&
        "_id" in snippet &&
        "userId" in snippet &&
        "title" in snippet &&
        "content" in snippet;

    const isOwner = isSnippet && dbUser?._id === (snippet as ISnippet).userId;

    return (
        <div className='w-1/2 mx-auto py-10'>
            {isSnippet ? (
                <SnippetModule snippet={snippet} isOwner={isOwner} />
            ) : (
                <div className='text-red-500'>Invalid snippet data.</div>
            )}
        </div>
    );
};

export default SnippetPage;
