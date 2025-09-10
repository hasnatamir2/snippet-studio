"use client";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function CancelButton() {
    const { getToken } = useAuth();

    const handleCancel = async () => {
        const token = await getToken({ template: "convex" });

        await fetch("/api/stripe/cancel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        toast("Subscription will cancel at period end.");
    };

    return (
        <Button
            onClick={handleCancel}
            className='bg-red-600 text-white w-full hover:bg-red-700'
        >
            Cancel Subscription
        </Button>
    );
}
