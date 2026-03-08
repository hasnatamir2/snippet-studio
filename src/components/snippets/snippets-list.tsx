"use client";

import { useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import SnippetCard from "./snippet-card";
import { Lock, LockOpen, Search, X } from "lucide-react";
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
    const publicSnippetCount = useQuery(
        api.queries.snippets.getPublicSnippetCount
    );
    const privateSnippetCount = useQuery(
        api.queries.snippets.getPrivateSnippetCount
    );

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

    if (!userId) return <div>Please sign in to see snippets.</div>;

    if (snippets === undefined || snippets === null) {
        return <p className='text-gray-500'>Loading....</p>;
    }

    return (
        <div className='w-full space-y-4'>
            {/* Stats */}
            <div className='flex gap-4'>
                <p className='text-sm'>
                    <LockOpen className='w-4 h-3 inline-block' /> Public:{" "}
                    <span className='text-xl'>{publicSnippetCount || 0}</span>
                </p>
                <p className='text-sm'>
                    <Lock className='w-4 h-3 inline-block' /> Private:{" "}
                    <span className='text-xl'>{privateSnippetCount || 0}</span>
                </p>
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
                <ul className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap w-full'>
                    {filteredSnippets.map((s: ISnippet) => (
                        <li key={s._id} className='col-span-1'>
                            <SnippetCard {...s} />
                        </li>
                    ))}
                </ul>
            ) : snippets.length === 0 ? (
                <div className='w-full justify-center gap-4 flex flex-col items-center py-12'>
                    <p className='text-gray-600'>No snippets yet!</p>
                    <Button asChild>
                        <Link href='/new'>Create your first snippet</Link>
                    </Button>
                </div>
            ) : (
                <div className='text-center py-12 text-muted-foreground'>
                    No snippets match your search.
                </div>
            )}
        </div>
    );
}
