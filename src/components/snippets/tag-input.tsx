"use client";
import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TagInput({
    tags,
    onChange,
    disabled = false,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
    disabled?: boolean;
}) {
    const [input, setInput] = useState("");

    const addTag = () => {
        const tag = input.trim().toLowerCase().replace(/,/g, "");
        if (tag && !tags.includes(tag)) {
            onChange([...tags, tag]);
        }
        setInput("");
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className='flex flex-wrap gap-1.5 items-center border rounded-md px-3 py-1.5 min-h-[38px] bg-background focus-within:ring-1 focus-within:ring-ring'>
            {tags.map((tag) => (
                <span
                    key={tag}
                    className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs font-medium'
                >
                    #{tag}
                    {!disabled && (
                        <button
                            type='button'
                            onClick={() => removeTag(tag)}
                            className='text-muted-foreground hover:text-foreground ml-0.5'
                        >
                            <X className='w-3 h-3' />
                        </button>
                    )}
                </span>
            ))}
            {!disabled && (
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? "Add tags… (Enter or comma)" : ""}
                    className='border-0 shadow-none focus-visible:ring-0 h-6 p-0 min-w-[160px] flex-1 text-sm'
                />
            )}
        </div>
    );
}
