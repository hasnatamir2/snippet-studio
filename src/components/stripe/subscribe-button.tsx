import { Button } from "../ui/button";
import Link from "next/link";

export function SubscribeButton() {
    return (
        <Button
            asChild
            className='w-full bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] text-white border-0 hover:opacity-90'
        >
            <Link href='/billing/payment'>Upgrade to Pro</Link>
        </Button>
    );
}
