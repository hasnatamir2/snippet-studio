"use client";
import { CodeBlock } from "../code-block/code-block";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { Trash, Pencil, Lock, LockOpen, Share, Copy, Check } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { SharePanel } from "./share-panel";
import { formatDate } from "@/lib/utils";
import { ISnippet } from "./snippet-form";
import { useState } from "react";

const LANG_COLORS: Record<string, string> = {
    javascript: "#f7df1e",
    typescript: "#3178c6",
    python: "#3776ab",
    java: "#ed8b00",
    cpp: "#00599c",
    ruby: "#cc342d",
    go: "#00add8",
    rust: "#ce422b",
    csharp: "#239120",
    php: "#777bb4",
    swift: "#f05138",
    kotlin: "#7f52ff",
    scala: "#dc322f",
    haskell: "#5e5086",
    lua: "#000080",
    perl: "#39457e",
    r: "#276dc3",
    dart: "#00b4ab",
    elixir: "#6e4a7e",
    clojure: "#5881d8",
    erlang: "#b83998",
    fsharp: "#378bba",
    groovy: "#4298b8",
    julia: "#9558b2",
    shell: "#4eaa25",
    sql: "#e38c00",
};

const SnippetCard = (snip: ISnippet) => {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const deleteSnippet = useMutation(api.mutations.snippet.deleteSnippet);
    const toggleSnippetVisibility = useMutation(
        api.mutations.snippet.toggleSnippetVisibility
    );

    const editSnippet = () => {
        router.push(`/snippets/${snip._id}`);
    };

    const handleDelete = async () => {
        await deleteSnippet({ snippetId: snip._id, userId: snip.userId });
    };

    const snippetShareLink = `${process.env.NEXT_PUBLIC_APP_URL}/snippets/${snip._id}`;

    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(snip.content);
        setCopied(true);
        toast.success("Code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const updateVisibilty = async () => {
        await toggleSnippetVisibility({
            snippetId: snip._id,
            userId: snip.userId,
        });
        toast.success("Snippet visibility updated!");
    };

    const langColor = LANG_COLORS[snip.language.toLowerCase()] ?? "#888";
    const lineCount = snip.content.split("\n").length;
    const charCount = snip.content.length;

    return (
        <Card className='snippet-card relative py-0 gap-1'>
            <CardContent className='h-40 overflow-hidden px-0 rounded-tr-lg rounded-tl-lg relative'>
                {/* Language badge */}
                <div className='absolute top-0 right-0 z-10 flex items-center gap-1 px-2 py-0.5 rounded-tr-lg rounded-bl-lg text-xs font-medium text-white'
                    style={{ background: langColor }}>
                    <span
                        className='w-2 h-2 rounded-full bg-white/30'
                    />
                    {snip.language}
                </div>
                <CodeBlock code={snip.content} language={snip.language} />
            </CardContent>

            <CardFooter className='text-xs gap-2 flex-col items-start px-3 pb-2 pt-1'>
                {/* Tags row */}
                {snip.tags && snip.tags.length > 0 && (
                    <div className='flex gap-1 flex-wrap'>
                        {snip.tags.map((tag) => (
                            <span
                                key={tag}
                                className='px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]'
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions row */}
                <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                        <code className='font-medium truncate max-w-[120px]'>{snip.title}</code>

                        <Button variant='link' size='sm' onClick={editSnippet} className='px-1' aria-label="Edit snippet">
                            <Pencil className='w-3.5 h-3.5' aria-hidden="true" />
                        </Button>

                        {/* Copy code button */}
                        <Button
                            variant='link'
                            size='sm'
                            onClick={copyCodeToClipboard}
                            className='px-1'
                            aria-label={copied ? "Copied" : "Copy code"}
                        >
                            {copied ? (
                                <Check className='w-3.5 h-3.5 text-green-500' aria-hidden="true" />
                            ) : (
                                <Copy className='w-3.5 h-3.5' aria-hidden="true" />
                            )}
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant='link' size='sm' className='px-1' aria-label="Delete snippet">
                                    <Trash className='w-3.5 h-3.5' aria-hidden="true" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your snippet.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button variant='link' size='sm' onClick={updateVisibilty} className='px-1' aria-label={snip.isPublic ? "Make private" : "Make public"}>
                            {snip.isPublic ? (
                                <LockOpen className='w-3.5 h-3.5' aria-hidden="true" />
                            ) : (
                                <Lock className='w-3.5 h-3.5' aria-hidden="true" />
                            )}
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className={`px-1 ${!snip.isPublic ? "opacity-40 pointer-events-none" : ""}`}
                                    disabled={!snip.isPublic}
                                    aria-label="Share snippet"
                                >
                                    <Share className='w-3.5 h-3.5' aria-hidden="true" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-80' align="end">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Share snippet</p>
                                <SharePanel url={snippetShareLink} title={snip.title} />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Stats + date */}
                    <div className='flex flex-col items-end gap-0.5 text-[10px] text-muted-foreground'>
                        <span>{lineCount}L · {charCount}ch</span>
                        <span>{formatDate(snip.updatedAt)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default SnippetCard;
