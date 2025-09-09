import { NextResponse } from "next/server";
import { fetchAction } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return new Response("Unauthorized", { status: 401 });
        
        const { priceId } = await req.json();
        const { userId } = await auth();

        const { url } = await fetchAction(api.actions.stripe.createCheckout, {
            priceId,
            clerkId: userId!,
        });

        return NextResponse.json({ url });
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        console.error("Checkout Error:", errorMessage);
        return new NextResponse(`Checkout Error: ${errorMessage}`, {
            status: 400,
        });
    }
}
