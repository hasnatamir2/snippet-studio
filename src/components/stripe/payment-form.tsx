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

import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";

const formSchema = z.object();

const StripePaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const onSubmit = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`, // redirect after payment
            }
        });

        if (error) {
            setError(error.message ?? "Payment failed");
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h4 className="font-bold text-xl my-4 text-center">Complete your payment</h4>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-4 max-w-2/3 mx-auto'
                >
                    <PaymentElement />
                    <Button
                        type='submit'
                        disabled={!stripe || loading}
                        className='w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    >
                        {loading ? "Processing..." : "Pay"}
                    </Button>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                </form>
            </Form>
        </div>
    );
};

export default StripePaymentForm;
