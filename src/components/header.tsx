"use client";

import { Button } from "@/components/ui/button";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className='w-9 h-9' />;
    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label='Toggle theme'
        >
            {resolvedTheme === "dark" ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
        </Button>
    );
}

export function Header() {
    return (
        <header className='flex h-16 w-full items-center justify-between gap-4 border-b px-4'>
            <div className='flex gap-4 text-sm font-medium items-center'>
                <SidebarTrigger />

                <Link href='/' className='flex items-center gap-x-2 mr-2'>
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <defs>
                            <linearGradient id="hdr-g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#0EA5E9"/>
                                <stop offset="100%" stopColor="#6C47FF"/>
                            </linearGradient>
                        </defs>
                        <path d="M18 8 L12 8 Q8 8 8 12 L8 20 Q8 24 12 24 Q8 24 8 28 L8 36 Q8 40 12 40 L18 40"
                            stroke="url(#hdr-g)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <path d="M30 8 L36 8 Q40 8 40 12 L40 20 Q40 24 36 24 Q40 24 40 28 L40 36 Q40 40 36 40 L30 40"
                            stroke="url(#hdr-g)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <circle cx="24" cy="24" r="3.5" fill="url(#hdr-g)"/>
                    </svg>
                    <span className='font-semibold hidden md:block bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] bg-clip-text text-transparent'>
                        Snippet Studio
                    </span>
                </Link>
            </div>
            <div className='flex items-center gap-x-2'>
                <ThemeToggle />
                <SignedOut>
                    <SignInButton>
                        <Button variant='ghost'>Sign in</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button>Sign up</Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    );
}
