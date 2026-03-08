"use client";
import { useEffect, useState } from "react";
import { useMutation, useAction } from "convex/react";
import { toast } from "sonner";
import hljs from "highlight.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { Copy, Lock, Sparkles, Loader2, Plus } from "lucide-react";
import { TagInput } from "./tag-input";

import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CodeInput from "../code-block/code-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { UniqueLangs } from "@/lib/constant";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Id } from "../../../convex/_generated/dataModel";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    content: z.string().min(2, {
        message: "Snippet must be at least 2 characters.",
    }),
    language: z.string().min(2, {
        message: "Language must be at least 2 characters.",
    }),
    isPublic: z.boolean(),
    tags: z.array(z.string()),
});

export interface ISnippet {
    _id: Id<"snippets">;
    _creationTime: number;
    tags?: string[] | undefined;
    createdAt: number;
    userId: Id<"users">;
    title: string;
    content: string;
    language: string;
    isPublic: boolean;
    updatedAt: number;
}

export default function SnippetModule({
    snippet,
    isOwner = false
}: {
    snippet?: ISnippet | null;
    isOwner?: boolean
}) {
    const { isSignedIn } = useAuth();
    const mode = snippet ? "edit" : "create";
    const createSnippet = useMutation(api.mutations.snippet.createSnippet);
    const updateSnippet = useMutation(api.mutations.snippet.updateSnippet);
    const suggestTagsAction = useAction(api.actions.ai.suggestTags);
    const generateTitleAction = useAction(api.actions.ai.generateTitle);

    const [aiTagSuggestions, setAiTagSuggestions] = useState<string[]>([]);
    const [suggestingTags, setSuggestingTags] = useState(false);
    const [generatingTitle, setGeneratingTitle] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: snippet?.title || "",
            content: snippet?.content || "",
            isPublic: snippet?.isPublic || false,
            language: snippet?.language || "javascript",
            tags: snippet?.tags || [],
        },
    });

    const [code, codeLang] = form.watch(["content", "language"]);

    useEffect(() => {
        if (code && !codeLang) {
            const result = hljs.highlightAuto(code || "");
            const detectlang = result.language || "javascript";
            if (detectlang.toLowerCase() !== codeLang.toLowerCase()) {
                form.setValue("language", detectlang.toLowerCase());
            }
        }
    }, [code, codeLang, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (mode === "edit" && snippet) {
            updateSnippet({
                snippetId: snippet._id,
                userId: snippet.userId,
                ...values,
            });
            toast.success("Snippet updated!");
        } else {
            try {
                await createSnippet(values);
                toast.success("Snippet saved!");
                form.reset();
                setAiTagSuggestions([]);
            } catch (err: unknown) {
                if (err instanceof Error && err.message.includes("limit")) {
                    toast.error(
                        "Free plan limit reached. Upgrade to Pro for unlimited snippets."
                    );
                } else {
                    toast.error("Something went wrong");
                }
                return;
            }
        }

        // After a successful save, get AI tag suggestions
        setSuggestingTags(true);
        try {
            const suggestions = await suggestTagsAction({
                content: values.content,
                language: values.language,
            });
            const currentTags = form.getValues("tags");
            const newSuggestions = suggestions.filter(
                (t: string) => !currentTags.includes(t)
            );
            setAiTagSuggestions(newSuggestions);
        } catch {
            // silently ignore AI errors
        } finally {
            setSuggestingTags(false);
        }
    };

    const handleGenerateTitle = async () => {
        const content = form.getValues("content");
        const language = form.getValues("language");
        if (!content || content.length < 10) return;
        setGeneratingTitle(true);
        try {
            const title = await generateTitleAction({ content, language });
            if (title) form.setValue("title", title);
        } catch {
            toast.error("Failed to generate title");
        } finally {
            setGeneratingTitle(false);
        }
    };

    const acceptAiTag = (tag: string) => {
        const current = form.getValues("tags");
        if (!current.includes(tag)) {
            form.setValue("tags", [...current, tag]);
        }
        setAiTagSuggestions((prev) => prev.filter((t) => t !== tag));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);

        toast.success("Code copied to clipboard!");
    };
    return (
        <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full flex flex-col gap-3 min-w-0'
        >
            {/* Top metadata bar */}
            {isSignedIn && (
                <div className='flex items-center gap-2 flex-wrap min-w-0'>
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem className='flex-1 min-w-40'>
                                <FormControl>
                                    <div className='flex gap-1.5'>
                                        <Input
                                            {...field}
                                            placeholder='Snippet title…'
                                            disabled={!isOwner}
                                            className='h-9'
                                        />
                                        {isOwner && (
                                            <Button
                                                type='button'
                                                variant='outline'
                                                size='icon'
                                                onClick={handleGenerateTitle}
                                                disabled={generatingTitle}
                                                title='Generate title with AI'
                                                className='h-9 w-9 shrink-0'
                                            >
                                                {generatingTitle ? (
                                                    <Loader2 className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <Sparkles className='w-4 h-4' />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='language'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                        disabled={!isOwner}
                                    >
                                        <SelectTrigger className='h-9 w-36'>
                                            <SelectValue placeholder='Language' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UniqueLangs.map((name) => (
                                                <SelectItem
                                                    key={name}
                                                    value={name.toLowerCase()}
                                                >
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='isPublic'
                        render={({ field }) => (
                            <FormItem className='flex items-center gap-2 space-y-0'>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        name={field.name}
                                        disabled={field.disabled || !isOwner}
                                        ref={field.ref}
                                    />
                                </FormControl>
                                <FormLabel className='text-sm font-normal cursor-pointer'>
                                    {field.value ? "Public" : "Private"}
                                </FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='flex items-center gap-2 ml-auto'>
                        {!isOwner && <Lock className='w-4 h-4 text-muted-foreground' />}
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={copyToClipboard}
                            disabled={!code}
                            className='h-9'
                        >
                            <Copy className='w-4 h-4 mr-1.5' /> Copy
                        </Button>
                    </div>
                </div>
            )}

            {/* Non-signed-in: language selector + copy */}
            {!isSignedIn && (
                <div className='flex items-center gap-2 justify-between'>
                    <FormField
                        control={form.control}
                        name='language'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                        disabled={!isOwner}
                                    >
                                        <SelectTrigger className='h-9 w-36'>
                                            <SelectValue placeholder='Language' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UniqueLangs.map((name) => (
                                                <SelectItem
                                                    key={name}
                                                    value={name.toLowerCase()}
                                                >
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={copyToClipboard}
                        disabled={!code}
                        className='h-9'
                    >
                        <Copy className='w-4 h-4 mr-1.5' /> Copy
                    </Button>
                </div>
            )}

            {/* Code editor */}
            <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <CodeInput
                                code={field.value}
                                language={form.getValues("language")}
                                onChange={field.onChange}
                                onSave={isOwner ? () => form.handleSubmit(onSubmit)() : undefined}
                                readOnly={!isOwner}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Tags + AI suggestions */}
            {isSignedIn && (
                <div className='flex flex-col gap-1.5'>
                    <FormField
                        control={form.control}
                        name='tags'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TagInput
                                        tags={field.value}
                                        onChange={field.onChange}
                                        disabled={!isOwner}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {(suggestingTags || aiTagSuggestions.length > 0) && (
                        <div className='flex items-center gap-2 flex-wrap text-xs'>
                            <span className='flex items-center gap-1 text-muted-foreground'>
                                {suggestingTags ? (
                                    <>
                                        <Loader2 className='w-3 h-3 animate-spin' />
                                        AI suggesting tags…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='w-3 h-3 text-purple-500' />
                                        AI suggests:
                                    </>
                                )}
                            </span>
                            {aiTagSuggestions.map((tag) => (
                                <button
                                    key={tag}
                                    type='button'
                                    onClick={() => acceptAiTag(tag)}
                                    className='flex items-center gap-0.5 px-2 py-0.5 rounded-full border border-purple-300 text-purple-700 dark:text-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors'
                                >
                                    <Plus className='w-2.5 h-2.5' />
                                    {tag}
                                </button>
                            ))}
                            {aiTagSuggestions.length > 0 && (
                                <button
                                    type='button'
                                    onClick={() => setAiTagSuggestions([])}
                                    className='text-muted-foreground hover:text-foreground'
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {isSignedIn && isOwner && (
                <Button type='submit'>
                    {mode === "edit" ? "Update Snippet" : "Save Snippet"}
                </Button>
            )}
        </form>
        </Form>
    );
}
