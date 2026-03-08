import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({}, { status: 400 });

    try {
        const snippet = await fetchQuery(api.queries.snippets.getSnippetById, {
            snippetId: id as Id<"snippets">,
        });
        if (!snippet) return NextResponse.json({}, { status: 404 });
        return NextResponse.json({ title: snippet.title, language: snippet.language });
    } catch {
        return NextResponse.json({}, { status: 500 });
    }
}
