import SnippetModule from "@/components/snippets/snippet-form";

export default function Home() {
    return (
        <div className='md:my-16 my-4 px-4 text-center'>
            <h1 className='md:text-4xl text-2xl font-bold'>Snippet Studio</h1>
            <p className='mt-4 text-lg'>
                Save, share and manage code snippets — Starter & Pro plans.
            </p>
            <div className='mt-8 flex justify-center gap-4 md:w-1/2 mx-auto'>
                <SnippetModule isOwner/>
            </div>
        </div>
    );
}
