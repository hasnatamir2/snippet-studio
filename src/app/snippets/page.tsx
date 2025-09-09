import NewSnippetClient from "@/components/snippets/create-snippet-form";
import { Suspense } from "react";
import SnippetsList from "@/components/snippets/snippets-list";

export default function SnippetsPage() {
    return (
        <div className="mx-4 my-6">
            <div className='mt-4 '>
                <NewSnippetClient />
            </div>
            <h1 className='text-2xl font-bold'>My Snippets</h1>
            <div className='mt-4'>
                <Suspense fallback={<p>Loading snippets...</p>}>
                    <SnippetsList />
                </Suspense>
            </div>
            
        </div>
    );
}
