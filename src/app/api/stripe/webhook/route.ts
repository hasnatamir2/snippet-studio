import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { fetchAction } from "convex/nextjs"; // or fetchAction

export const dynamic = "force-dynamic"; // ensure no caching

export async function POST(request: Request) {
    const body = await request.text(); // must be raw body
    const sig = request.headers.get("stripe-signature") as string;

    try {
        // Forward event to Convex action
        await fetchAction(api.actions.stripe.webhook, { body, sig });
        return NextResponse.json({ received: true });
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        console.error("Webhook Error:", errorMessage);
        return new NextResponse(`Webhook Error: ${errorMessage}`, {
            status: 400,
        });
    }
}
