/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeBlock } from "../code-block/code-block";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { Trash, Pencil } from "lucide-react";

const SnippetCard = (snip: any) => {
    const router = useRouter();

    const editSnippet = () => {
        router.push(`/snippets/${snip._id}`);
    };
    return (
        <Card className='snippet-card md:w-xl relative py-0 gap-1'>
            <CardContent className='h-40 overflow-scroll px-0 rounded-tr-lg rounded-tl-lg'>
                <pre className='absolute text-xs right-0 px-2 bg-gray-300 rounded-tr-lg font-medium'>
                    {snip.language}
                </pre>
                <CodeBlock code={snip.content} language={snip.language} />
            </CardContent>
            <CardFooter className='text-xs gap-2 justify-between items-center'>
                <div className="justify-between items-center flex">
                    <code>{snip.title}</code>

                    <Button
                        variant='link'
                        size='sm'
                        className='text-xs'
                        onClick={editSnippet}
                    >
                        <Pencil />
                    </Button>
                    <Button
                        variant='link'
                        size='sm'
                        className='text-xs'
                        disabled
                        onClick={editSnippet}
                    >
                        <Trash />
                    </Button>
                </div>
                <p className='text-[10px]'>
                    Updated at {new Date(snip.updatedAt).toLocaleString()}
                </p>
            </CardFooter>
        </Card>
    );
};

export default SnippetCard;
