import { NextResponse } from "next/server";
import { fetchAction } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

export async function POST(req: Request) {
    try {
        const { subscriptionId, paymentMethodId } = await req.json();
        const response = await fetchAction(api.actions.stripe.finalizeSubscription, {
            subscriptionId,
            paymentMethodId,
        });

        console.log(response)

        // Success!
        return NextResponse.json({
            success: true,
            status: "subscription_active",
        });
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        console.error("Checkout Error:", errorMessage);
        return new NextResponse(`Checkout Error: ${errorMessage}`, {
            status: 400,
        });
    }
}
