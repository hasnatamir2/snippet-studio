/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeBlock } from "../code-block/code-block";
import { Card, CardContent, CardFooter } from "../ui/card";

const SnippetCard = (snip: any) => {
    return (
        <Card className='snippet-card max-w-2xl relative'>
            <CardContent className='h-20'>
                <p className='absolute text-xs right-0 px-2 bg-gray-300'>
                    {snip.title}
                </p>
                <CodeBlock code={snip.content} language={snip.language} />
            </CardContent>
            <CardFooter className='text-xs gap-2'>
                <code>lng:{snip.language}</code>
                <p>updated at: {new Date(snip.updatedAt).toLocaleString()}</p>
            </CardFooter>
        </Card>
    );
};

export default SnippetCard;
