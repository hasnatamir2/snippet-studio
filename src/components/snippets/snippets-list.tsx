"use client";

import { useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import SnippetCard from "./snippet-card";
import { Search, X, Plus } from "lucide-react";
import { ISnippet } from "./snippet-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";

export default function SnippetsListClient() {
    const { userId } = useAuth();
    const [search, setSearch] = useState("");
    const [langFilter, setLangFilter] = useState<string | null>(null);

    const snippets = useQuery(api.queries.snippets.getSnippets, {
        clerkId: userId || "",
    });

    const availableLangs = useMemo((): string[] => {
        if (!snippets) return [];
        return [...new Set(snippets.map((s: ISnippet) => s.language))].sort();
    }, [snippets]);

    const filteredSnippets = useMemo(() => {
        if (!snippets) return [];
        const q = search.toLowerCase().trim();
        return snippets.filter((s: ISnippet) => {
            const matchesSearch =
                !q ||
                s.title.toLowerCase().includes(q) ||
                s.language.toLowerCase().includes(q) ||
                s.tags?.some((t) => t.toLowerCase().includes(q));
            const matchesLang = !langFilter || s.language === langFilter;
            return matchesSearch && matchesLang;
        });
    }, [snippets, search, langFilter]);

    if (!userId) return null;

    if (snippets === undefined || snippets === null) {
        return (
            <div className='space-y-2'>
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className='h-24 rounded-xl border bg-card motion-safe:animate-pulse'
                    />
                ))}
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold'>My Snippets</h2>
                <span className='text-xs text-muted-foreground'>
                    {snippets.length}{" "}
                    {snippets.length === 1 ? "snippet" : "snippets"}
                </span>
            </div>

            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <Input
                    placeholder='Search by title, language, or tag…'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='pl-9 pr-9'
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                    >
                        <X className='w-4 h-4' />
                    </button>
                )}
            </div>

            {/* Language filter pills */}
            {availableLangs.length > 0 && (
                <div className='flex gap-1.5 flex-wrap'>
                    <button
                        onClick={() => setLangFilter(null)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            !langFilter
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:border-foreground"
                        }`}
                    >
                        All
                    </button>
                    {availableLangs.map((lang) => (
                        <button
                            key={lang}
                            onClick={() =>
                                setLangFilter(lang === langFilter ? null : lang)
                            }
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                                langFilter === lang
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:border-foreground"
                            }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            {filteredSnippets.length > 0 ? (
                <ul className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 w-full'>
                    {filteredSnippets.map((s: ISnippet) => (
                        <li key={s._id} className='col-span-1'>
                            <SnippetCard {...s} />
                        </li>
                    ))}
                </ul>
            ) : snippets.length === 0 ? (
                <div className='rounded-xl border bg-card py-16 flex flex-col items-center gap-4 text-center'>
                    <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
                        <Plus className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                        <p className='font-medium'>No snippets yet</p>
                        <p className='text-sm text-muted-foreground mt-1'>
                            Create your first snippet to get started.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href='/new'>Create snippet</Link>
                    </Button>
                </div>
            ) : (
                <div className='text-center py-12 text-muted-foreground text-sm'>
                    No snippets match your search.
                </div>
            )}
        </div>
    );
}
