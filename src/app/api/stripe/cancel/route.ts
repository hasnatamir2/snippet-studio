import { NextResponse } from "next/server";
import { fetchAction } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return new Response("Unauthorized", { status: 401 });

        const { userId } = await auth();

        await fetchAction(api.actions.stripe.cancelSubscription, {
            clerkId: userId!,
        });
        return NextResponse.json({ canceled: true });
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        console.error("Cancel Error:", errorMessage);
        return new NextResponse(`Cancel Error: ${errorMessage}`, {
            status: 400,
        });
    }
}
