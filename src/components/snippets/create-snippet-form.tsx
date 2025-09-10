"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import hljs from "highlight.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs"; // 👈 Clerk hook
import { Copy, Share } from "lucide-react";

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
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Label } from "../ui/label";

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

interface ISnippet {
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

export default function NewSnippetClient({
    snippet,
}: {
    snippet: ISnippet | null;
}) {
    const { isSignedIn } = useAuth(); // 👈 check if user is logged in
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
        if (code && codeLang) {
            const result = hljs.highlightAuto(code || "");
            const detectlang = result.language || "javascript";
            if (detectlang.toLowerCase() !== codeLang.toLowerCase()) {
                form.setValue("language", detectlang.toLowerCase());
            }
        }
    }, [code, codeLang, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        if (mode === "edit" && snippet) {
            updateSnippet({
                snippetId: snippet._id,
                userId: snippet.userId,
                ...values,
            });
            toast.success("Snippet updated!");
            return;
        } else {
            createSnippet(values);
            toast.success("Snippet created!");
            form.reset();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);

        toast.success("Code copied to clipboard!");
    };
    return (
        <div className='w-full'>
            <div className='w-full flex justify-end gap-4'>
                <Button
                    onClick={copyToClipboard}
                    className='float-right mb-2'
                    disabled={!code}
                >
                    <Copy />
                </Button>
                {/* <Popover>
                    <PopoverTrigger disabled={!ispublic}>
                        <Button
                            className='float-right mb-2'
                            disabled={!ispublic}
                        >
                            <Share />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className='grid gap-4'>
                            <div className='space-y-2'>
                                <h4 className='leading-none font-medium'>
                                    Share Snippet
                                </h4>
                            </div>
                            <div className='grid gap-2'>
                                <div className='grid grid-cols-3 items-center gap-4'>
                                    <Input
                                        id='link'
                                        defaultValue={`${process.env.NEXT_PUBLIC_BASE_URL}/snippets/[snippetId]`}
                                        className='col-span-2 h-8'
                                        disabled
                                    />
                                    <Button className='h-8'>Copy</Button
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover> */}
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
                                        langExt={UniqueLangs}
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
                                        <Select {...field}>
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
                                                disabled={field.disabled}
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
                        <Button className='btn' type='submit'>
                            Save Snippet
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    );
}
