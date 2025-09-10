import { CodeBlock } from "../code-block/code-block";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { Trash, Pencil, Lock, LockOpen, Share, Copy, Link } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { ISnippet } from "./snippet-form";

const SnippetCard = (snip: ISnippet) => {
    const router = useRouter();
    const deleteSnippet = useMutation(api.mutations.snippet.deleteSnippet);
    const toggleSnippetVisibility = useMutation(
        api.mutations.snippet.toggleSnippetVisibility
    );

    const editSnippet = () => {
        router.push(`/snippets/${snip._id}`);
    };

    const handleDelete = async () => {
        await deleteSnippet({ snippetId: snip._id, userId: snip.userId });
    };

    const snippetShareLink = `${process.env.NEXT_PUBLIC_APP_URL}/snippets/${snip._id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippetShareLink);
        toast.success("Link copied to clipboard!");
    };

    const updateVisibilty = async () => {
        await toggleSnippetVisibility({
            snippetId: snip._id,
            userId: snip.userId,
        });
        toast.success("Snippet visibility updated!");
    };

    return (
        <Card className='snippet-card relative py-0 gap-1'>
            <CardContent className='h-40 overflow-scroll px-0 rounded-tr-lg rounded-tl-lg'>
                <pre className='absolute text-xs right-0 px-2 bg-gray-300 rounded-tr-lg font-medium'>
                    {snip.language}
                </pre>
                <CodeBlock code={snip.content} language={snip.language} />
            </CardContent>
            <CardFooter className='text-xs gap-2 justify-between items-center'>
                <div className='justify-between items-center flex'>
                    <code className=''>{snip.title}</code>

                    <Button variant='link' size='sm' onClick={editSnippet}>
                        <Pencil />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant='link' size='sm'>
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
                    <Button variant='link' size='sm' onClick={updateVisibilty}>
                        {snip.isPublic ? (
                            <LockOpen className='w-4 h-4' />
                        ) : (
                            <Lock className='w-4 h-4 ' />
                        )}
                    </Button>
                    <Popover>
                        <PopoverTrigger
                            className={`px-2.5 ${snip.isPublic && "cursor-pointer"}`}
                            disabled={!snip.isPublic}
                        >
                            <Share
                                className={`w-4 h-4 ${!snip.isPublic && "text-gray-500"}`}
                            />
                        </PopoverTrigger>
                        <PopoverContent className='md:w-96'>
                            <div className='flex items-center gap-1'>
                                <Input
                                    id='share-link'
                                    defaultValue={snippetShareLink}
                                    disabled
                                    className='col-span-3 h-8'
                                />
                                <Button
                                    className='col-span-1'
                                    size='sm'
                                    variant='outline'
                                    onClick={copyToClipboard}
                                >
                                    <Link />
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <p className='text-[10px]'>
                    Updated at {formatDate(snip.updatedAt)}
                </p>
            </CardFooter>
        </Card>
    );
};

export default SnippetCard;
