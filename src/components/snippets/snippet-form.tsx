"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import hljs from "highlight.js";
import { useForm } from "react-hook-form";
import { iso, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs"; // 👈 Clerk hook
import { Copy, Lock } from "lucide-react";

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: snippet?.title || "",
            content: snippet?.content || "",
            isPublic: snippet?.isPublic || false,
            language: snippet?.language || "javascript",
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
            return;
        } else {
            try {
                await createSnippet(values);
                toast.success("Snippet saved!");
                form.reset();
            } catch (err: unknown) {
                if (err instanceof Error && err.message.includes("limit")) {
                    toast.error(
                        "Free plan limit reached. Upgrade to Pro for unlimited snippets."
                    );
                } else {
                    toast.error("Something went wrong");
                }
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);

        toast.success("Code copied to clipboard!");
    };
    return (
        <div className='w-full'>
            <div className='w-full flex justify-end gap-4 sticky top-2 z-50 p-1 bg-white/50 rounded-lg border items-center mb-2'>
                {!isOwner && <Lock />}
                <Button onClick={copyToClipboard} disabled={!code}>
                    <Copy /> Copy to clipboard!
                </Button>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-4 w-full'
                >
                    <FormField
                        control={form.control}
                        name='content'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <CodeInput
                                        code={field.value}
                                        language={form.getValues("language")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-between items-center gap-4'>
                        {isSignedIn && (
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Title'
                                                disabled={!isOwner}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
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
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select language' />
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
                        {isSignedIn && (
                            <FormField
                                control={form.control}
                                name='isPublic'
                                render={({ field }) => (
                                    <FormItem className='flex'>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                name={field.name}
                                                disabled={field.disabled || !isOwner}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormLabel className='w-11'>
                                            {field.value ? "Public" : "Private"}
                                        </FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    {isSignedIn && (
                        <Button className='btn' type='submit' disabled={!isOwner}>
                            {mode === "edit"
                                ? "Update Snippet"
                                : "Save Snippet"}
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    );
}
