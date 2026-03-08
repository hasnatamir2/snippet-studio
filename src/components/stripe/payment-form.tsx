"use client";
import { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";

const formSchema = z.object();

const StripePaymentForm = ({
    subscriptionId,
}: {
    subscriptionId: string | null;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { push } = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const onSubmit = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
            },
            redirect: "if_required",
        });

        if (error) {
            setError(error.message ?? "Payment failed");
            setLoading(false);
        } else if (setupIntent) {
            const response = await fetch("/api/stripe/finalize-subscription", {
                method: "POST",
                body: JSON.stringify({
                    subscriptionId,
                    setupIntentId: setupIntent.id,
                    paymentMethodId: setupIntent.payment_method,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setLoading(true);
                setError(null);
                push("/");
                toast("Successfully subscribed to Pro!");
            }
        }
    };

    return (
        <div className='rounded-xl border bg-card p-6'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-5'
                >
                    <PaymentElement />
                    <Button
                        type='submit'
                        disabled={!stripe || loading}
                        className='w-full bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] text-white border-0 hover:opacity-90'
                    >
                        {loading ? (
                            <>
                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                Processing…
                            </>
                        ) : (
                            "Subscribe · $9/month"
                        )}
                    </Button>
                    {error && (
                        <p className='text-sm text-destructive text-center'>
                            {error}
                        </p>
                    )}
                    <p className='flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
                        <ShieldCheck className='w-3.5 h-3.5' />
                        Secured by Stripe · Cancel anytime
                    </p>
                </form>
            </Form>
        </div>
    );
};

export default StripePaymentForm;
