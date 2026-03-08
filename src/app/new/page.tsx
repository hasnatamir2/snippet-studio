import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SnippetModule from "@/components/snippets/snippet-form";

export default async function NewSnippetPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className='max-w-4xl w-full mx-auto py-8 px-4'>
            <h1 className='text-2xl font-bold mb-4'>New Snippet</h1>
            <SnippetModule isOwner />
        </div>
    );
}
