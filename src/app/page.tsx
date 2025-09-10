import SnippetModule from "@/components/snippets/snippet-form";

export default function Home() {
    return (
        <div className='py-16 text-center'>
            <h1 className='text-4xl font-bold'>Snippet Studio</h1>
            <p className='mt-4 text-lg'>
                Save, share and manage code snippets — Starter & Pro plans.
            </p>
            <div className='mt-8 flex justify-center gap-4 md:w-1/2 mx-auto'>
                <SnippetModule />
            </div>
        </div>
    );
}
