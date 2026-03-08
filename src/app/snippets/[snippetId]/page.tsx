"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import SnippetModule, { ISnippet } from "@/components/snippets/snippet-form";
import { SnippetScreenshot } from "@/components/snippets/snippet-screenshot";
import { SnippetExplanation } from "@/components/snippets/snippet-explanation";
import { SharePanel } from "@/components/snippets/share-panel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Share2, Lock } from "lucide-react";

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
        <div className='max-w-4xl min-w-3xl mx-auto py-8 px-4'>
            {isSnippet ? (
                <>
                    {/* Page header */}
                    <div className='flex items-center justify-between gap-4 mb-4'>
                        <div className='flex items-center gap-2 min-w-0'>
                            <h1 className='text-lg font-semibold truncate'>
                                {(snippet as ISnippet).title || "Untitled"}
                            </h1>
                            <span className='shrink-0 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono'>
                                {(snippet as ISnippet).language}
                            </span>
                        </div>

                        {/* Action toolbar */}
                        <div className='flex items-center shrink-0 bg-muted/50 border rounded-xl p-1 gap-0.5'>
                            <SnippetExplanation
                                snippetId={(snippet as ISnippet)._id}
                                content={(snippet as ISnippet).content}
                                language={(snippet as ISnippet).language}
                            />
                            <div className='w-px h-5 bg-border' />
                            <SnippetScreenshot
                                code={(snippet as ISnippet).content}
                                language={(snippet as ISnippet).language}
                                title={(snippet as ISnippet).title}
                                tags={(snippet as ISnippet).tags}
                            />
                            {(snippet as ISnippet).isPublic && (
                                <>
                                    <div className='w-px h-5 bg-border' />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant='ghost' size='sm'>
                                                <Share2 className='w-4 h-4 mr-1' /> Share
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-80' align='end'>
                                            <p className='text-xs font-medium text-muted-foreground mb-2'>Share snippet</p>
                                            <SharePanel
                                                url={`${process.env.NEXT_PUBLIC_APP_URL}/snippets/${(snippet as ISnippet)._id}`}
                                                title={(snippet as ISnippet).title}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </>
                            )}
                        </div>
                    </div>
                    <SnippetModule snippet={snippet} isOwner={isOwner} />
                </>
            ) : (
                <div className='text-red-500'>Invalid snippet data.</div>
            )}
        </div>
    );
};

export default SnippetPage;
