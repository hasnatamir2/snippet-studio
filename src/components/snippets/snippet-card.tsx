/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeBlock } from "../code-block/code-block";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { Trash, Pencil, Lock, LockOpen } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

const SnippetCard = (snip: any) => {
    const router = useRouter();
    const deleteSnippet = useMutation(api.mutations.snippet.deleteSnippet);

    const editSnippet = () => {
        router.push(`/snippets/${snip._id}`);
    };

    const handleDelete = async () => {
        await deleteSnippet({ snippetId: snip._id, userId: snip.userId });
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
                <div className='justify-between items-center flex'>
                    <code>{snip.title}</code>

                    <Button
                        variant='link'
                        size='sm'
                        className='text-xs'
                        onClick={editSnippet}
                    >
                        <Pencil />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button
                                variant='link'
                                size='sm'
                                className='text-xs'
                            >
                                <Trash />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your snippet.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    {snip.isPublic ? (
                        <LockOpen className='ml-2 w-4 h-4' />
                    ) : (
                        <Lock className='ml-2 w-4 h-4' />
                    )}
                </div>
                <p className='text-[10px]'>
                    Updated at {new Date(snip.updatedAt).toLocaleString()}
                </p>
            </CardFooter>
        </Card>
    );
};

export default SnippetCard;
