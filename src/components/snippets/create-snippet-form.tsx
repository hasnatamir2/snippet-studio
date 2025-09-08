"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function NewSnippetClient() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const createSnippet = useMutation(api.mutations.snippet.createSnippet);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        await createSnippet({
            title,
            content: body,
            language: "javascript",
            isPublic: false,
        });
        setTitle("");
        setBody("");
    }

    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-4 max-w-1/2 mx-auto'>
            <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title'
            />
            <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='Snippet body'
                className='h-40'
            />
            <Button className='btn' type='submit'>
                Create Snippet
            </Button>
        </form>
    );
}
