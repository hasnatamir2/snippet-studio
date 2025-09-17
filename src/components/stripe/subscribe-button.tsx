import { Button } from "../ui/button";
import Link from "next/link";

export function SubscribeButton() {
    // const { getToken } = useAuth();

    // const handleClick = async () => {
    //     const token = await getToken({ template: "convex" });
    //     const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!;

    //     const res = await fetch("/api/stripe/checkout", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ priceId }),
    //     });
    //     const data = await res.json();
    //     window.location.href = data?.url;
    // };

    return (
        <Button className='bg-blue-600 text-white w-full hover:bg-blue-700'>
            <Link href='/billing/payment'>Subscribe</Link>
        </Button>
    );
}
