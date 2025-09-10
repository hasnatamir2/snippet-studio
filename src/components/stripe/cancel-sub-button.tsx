"use client";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

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
        <button
            onClick={handleCancel}
            className='px-4 py-2 bg-red-600 text-white rounded w-full cursor-pointer hover:bg-red-700 transition'
        >
            Cancel Subscription
        </button>
    );
}
