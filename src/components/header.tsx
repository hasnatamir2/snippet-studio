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
import { useTheme } from "next-themes";
import { Sun, Moon, Plus, Menu, X, LayoutDashboard, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className='w-9 h-9' />;
    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label='Toggle theme'
        >
            {resolvedTheme === "dark" ? (
                <Sun className='w-4 h-4' />
            ) : (
                <Moon className='w-4 h-4' />
            )}
        </Button>
    );
}

const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/billing", label: "Billing", icon: CreditCard },
];

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='flex h-14 items-center justify-between px-4 max-w-7xl mx-auto'>
                {/* Left — logo */}
                <Link href='/' className='flex items-center gap-2 shrink-0'>
                    <svg
                        width='28'
                        height='28'
                        viewBox='0 0 48 48'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden
                    >
                        <defs>
                            <linearGradient
                                id='hdr-g'
                                x1='0'
                                y1='0'
                                x2='48'
                                y2='48'
                                gradientUnits='userSpaceOnUse'
                            >
                                <stop offset='0%' stopColor='#0EA5E9' />
                                <stop offset='100%' stopColor='#6C47FF' />
                            </linearGradient>
                        </defs>
                        <path
                            d='M18 8 L12 8 Q8 8 8 12 L8 20 Q8 24 12 24 Q8 24 8 28 L8 36 Q8 40 12 40 L18 40'
                            stroke='url(#hdr-g)'
                            strokeWidth='3.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            fill='none'
                        />
                        <path
                            d='M30 8 L36 8 Q40 8 40 12 L40 20 Q40 24 36 24 Q40 24 40 28 L40 36 Q40 40 36 40 L30 40'
                            stroke='url(#hdr-g)'
                            strokeWidth='3.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            fill='none'
                        />
                        <circle cx='24' cy='24' r='3.5' fill='url(#hdr-g)' />
                    </svg>
                    <span className='font-semibold text-sm bg-gradient-to-r from-[#0EA5E9] to-[#6C47FF] bg-clip-text text-transparent hidden sm:block'>
                        Snippet Studio
                    </span>
                </Link>

                {/* Center — desktop nav (signed in only) */}
                <SignedIn>
                    <nav className='hidden md:flex items-center gap-1'>
                        {NAV_LINKS.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                                    pathname === href
                                        ? "bg-muted font-medium text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </SignedIn>

                {/* Right — actions */}
                <div className='flex items-center gap-2'>
                    <ThemeToggle />

                    <SignedOut>
                        <SignInButton>
                            <Button variant='ghost' size='sm'>
                                Sign in
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button size='sm'>Sign up</Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        {/* New snippet CTA */}
                        <Button asChild size='sm' className='hidden sm:flex gap-1.5'>
                            <Link href='/new'>
                                <Plus className='w-4 h-4' />
                                New snippet
                            </Link>
                        </Button>
                        <UserButton />
                        {/* Mobile menu toggle */}
                        <Button
                            variant='ghost'
                            size='icon'
                            className='md:hidden'
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label='Menu'
                        >
                            {mobileOpen ? (
                                <X className='w-4 h-4' />
                            ) : (
                                <Menu className='w-4 h-4' />
                            )}
                        </Button>
                    </SignedIn>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className='md:hidden border-t bg-background px-4 py-3 space-y-1'>
                    <Link
                        href='/new'
                        className='flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium'
                    >
                        <Plus className='w-4 h-4' />
                        New snippet
                    </Link>
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                pathname === href
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            }`}
                        >
                            <Icon className='w-4 h-4' />
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
