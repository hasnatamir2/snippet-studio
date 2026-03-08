"use client";
import { useState } from "react";
import { useAction } from "convex/react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

export function SnippetExplanation({
    snippetId,
    content,
    language,
}: {
    snippetId: Id<"snippets">;
    content: string;
    language: string;
}) {
    const [open, setOpen] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const explainCode = useAction(api.actions.ai.explainCode);

    const handleExplain = async () => {
        setOpen(true);
        if (explanation) return; // already loaded
        setLoading(true);
        try {
            const result = await explainCode({ snippetId, content, language });
            setExplanation(result);
        } catch {
            toast.error("Failed to get explanation");
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant='ghost' size='sm' onClick={handleExplain}>
                <Sparkles className='w-4 h-4 mr-1' /> Explain
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className='overflow-y-auto'>
                    <SheetHeader>
                        <SheetTitle className='flex items-center gap-2'>
                            <Sparkles className='w-4 h-4' /> Code Explanation
                        </SheetTitle>
                    </SheetHeader>
                    <div className='mt-6 px-1'>
                        {loading ? (
                            <div className='flex items-center gap-2 text-muted-foreground'>
                                <Loader2 className='w-4 h-4 animate-spin' />
                                Analyzing your code…
                            </div>
                        ) : explanation ? (
                            <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {explanation}
                            </p>
                        ) : null}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
