"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import SnippetModule from "@/components/snippets/snippet-form";

const SnippetPage = () => {
    const params = useParams();
    const snippetId = params.snippetId as string; // 👈 grab it here
    const snippet = useQuery(api.queries.snippets.getSnippetById, {
        snippetId: snippetId as Id<"snippets">,
    });

    if (!snippet) {
        return <div>Loading...</div>;
    }
    console.log(snippet);
    return (
        <div className='w-1/2 mx-auto py-10'>
            <SnippetModule snippet={{ ...snippet }} />
        </div>
    );
};

export default SnippetPage;
