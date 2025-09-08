"use client";

import NewSnippetClient from "@/components/snippets/create-snippet-form";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function SnippetsPage() {
    // Call Convex query (server) to get snippets owned by the user
    const snippets = useQuery(api.queries.snippets.getSnippets);

    return (
        <div>
            <h1 className='text-2xl font-bold'>Your Snippets</h1>
            <div className='mt-4 '>
                <NewSnippetClient />
            </div>
            <ul className='mt-6 space-y-4'>
                {snippets && snippets.length > 0 ? (
                    <ul className='mt-6 space-y-4'>
                        {snippets.map((s) => (
                            <li key={s._id} className='p-4 border rounded'>
                                <div className='flex justify-between'>
                                    <div>
                                        <h3 className='font-semibold'>
                                            {s.title}
                                        </h3>
                                        <pre className='mt-2 text-sm'>
                                            {s.content}
                                        </pre>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No snippets found. Create one!</p>
                )}
            </ul>
        </div>
    );
}
