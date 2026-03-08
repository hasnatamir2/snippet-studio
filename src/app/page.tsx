import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Share2, Camera, Check } from "lucide-react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import HeroPreviewClient from "@/components/landing/hero-preview-client";

const FEATURES = [
    {
        icon: Code2,
        title: "Save & Organize",
        description:
            "Syntax highlighting for 28+ languages. Tag snippets and search your entire library in real time.",
        bullets: ["28+ languages", "Tags & search", "Public or private"],
    },
    {
        icon: Share2,
        title: "Share Instantly",
        description:
            "Toggle public/private per snippet. Share a link — viewers never need to create an account.",
        bullets: [
            "One-click share link",
            "No login to view",
            "Copy link from card",
        ],
    },
    {
        icon: Camera,
        title: "Look Beautiful",
        description:
            "Export stunning code screenshots with a macOS window frame and 8 gradient backgrounds.",
        bullets: [
            "8 gradient presets",
            "macOS window chrome",
            "PNG export or clipboard",
        ],
    },
];

const SCREENSHOT_PREVIEWS = [
    { label: "Noir", bg: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" },
    {
        label: "Purple",
        bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
        label: "Sunset",
        bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    { label: "Ocean", bg: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)" },
];

const PLANS = [
    {
        name: "Free",
        price: "$0",
        period: "/month",
        description: "For hobbyists",
        features: [
            "30 snippets",
            "Public sharing",
            "Syntax highlighting",
            "28+ languages",
            "Tags & search",
        ],
        cta: "Start for free",
        href: "/dashboard",
        highlighted: false,
        disabled: false,
    },
    {
        name: "Pro",
        price: "$5",
        period: "/month",
        description: "For serious developers",
        features: [
            "Unlimited snippets",
            "Private snippets",
            "Screenshot export",
            "AI features",
            "Priority support",
        ],
        cta: "Upgrade to Pro",
        href: "/billing",
        highlighted: true,
        disabled: false,
    },
    {
        name: "Team",
        price: "$12",
        period: "/seat/month",
        description: "For teams",
        features: [
            "Everything in Pro",
            "Shared collections",
            "Team snippet library",
            "Invite by email",
            "Admin controls",
        ],
        cta: "Coming soon",
        href: "/billing",
        highlighted: false,
        disabled: true,
    },
];

export default function Home() {
    return (
        <div className='w-full'>
            {/* ── Hero ─────────────────────────────────────────── */}
            <section className='bg-[#09090b] text-white px-6 py-20 md:py-28'>
                <div className='max-w-5xl mx-auto'>
                    <div className='grid md:grid-cols-2 gap-12 items-center'>
                        {/* Left: copy */}
                        <div className='text-center md:text-left'>
                            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-xs text-white/60 mb-6'>
                                <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
                                Free to start — no credit card required
                            </div>

                            <h1 className='text-4xl md:text-5xl font-bold leading-tight tracking-tight'>
                                Your code snippets,{" "}
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'>
                                    beautifully organized
                                </span>{" "}
                                &amp; instantly shareable
                            </h1>

                            <p className='mt-5 text-lg text-white/60 leading-relaxed'>
                                Save snippets with syntax highlighting, tag and
                                search your library, and share with a single
                                link. Export stunning screenshots to show off
                                your code anywhere.
                            </p>

                            <div className='mt-8 flex gap-3 flex-wrap justify-center md:justify-start'>
                                <SignedOut>
                                    <SignUpButton>
                                        <Button size='lg' className='gap-2'>
                                            Start for free{" "}
                                            <ArrowRight className='w-4 h-4' />
                                        </Button>
                                    </SignUpButton>
                                </SignedOut>
                                <SignedIn>
                                    <Button size='lg' asChild className='gap-2'>
                                        <Link href='/dashboard'>
                                            Go to dashboard{" "}
                                            <ArrowRight className='w-4 h-4' />
                                        </Link>
                                    </Button>
                                </SignedIn>
                                <Button
                                    size='lg'
                                    variant='outline'
                                    asChild
                                    className='border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white'
                                >
                                    <Link href='/new'>Try the editor</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right: live CodeMirror demo — hidden on mobile to prevent overflow */}
                        <div className='hidden md:block overflow-hidden'>
                            <HeroPreviewClient />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────── */}
            <section className='px-6 py-20 bg-background'>
                <div className='max-w-5xl mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl font-bold'>
                            Everything you need to manage code snippets
                        </h2>
                        <p className='mt-3 text-muted-foreground max-w-xl mx-auto'>
                            Built for developers who want to store knowledge,
                            not lose it.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-6'>
                        {FEATURES.map(
                            ({ icon: Icon, title, description, bullets }) => (
                                <div
                                    key={title}
                                    className='rounded-xl border bg-card p-6 flex flex-col gap-4'
                                >
                                    <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                                        <Icon className='w-5 h-5 text-primary' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg'>
                                            {title}
                                        </h3>
                                        <p className='mt-1 text-sm text-muted-foreground leading-relaxed'>
                                            {description}
                                        </p>
                                    </div>
                                    <ul className='space-y-1.5'>
                                        {bullets.map((b) => (
                                            <li
                                                key={b}
                                                className='flex items-center gap-2 text-sm text-muted-foreground'
                                            >
                                                <Check className='w-3.5 h-3.5 text-green-500 shrink-0' />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* ── Screenshot showcase ───────────────────────────── */}
            <section className='px-6 py-20 bg-[#09090b]'>
                <div className='max-w-5xl mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-white'>
                        Export beautiful code screenshots
                    </h2>
                    <p className='mt-3 text-white/60 max-w-xl mx-auto'>
                        Pick a gradient, then export as PNG or copy directly to
                        your clipboard. Perfect for Twitter, LinkedIn, or docs.
                    </p>

                    <div className='mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {SCREENSHOT_PREVIEWS.map(({ label, bg }) => (
                            <div
                                key={label}
                                className='rounded-xl p-5'
                                style={{ background: bg }}
                            >
                                <div className='rounded-lg overflow-hidden shadow-xl'>
                                    <div className='flex items-center gap-1.5 bg-[#1e1e1e] px-3 py-2'>
                                        <span className='w-2.5 h-2.5 rounded-full bg-[#ff5f57]' />
                                        <span className='w-2.5 h-2.5 rounded-full bg-[#febc2e]' />
                                        <span className='w-2.5 h-2.5 rounded-full bg-[#28c840]' />
                                    </div>
                                    <div className='bg-[#1e1e1e] p-4 text-left font-mono text-xs leading-relaxed'>
                                        <span className='text-blue-400'>
                                            const
                                        </span>{" "}
                                        <span className='text-yellow-300'>
                                            add
                                        </span>{" "}
                                        <span className='text-white'>= (</span>
                                        <span className='text-orange-300'>
                                            a
                                        </span>
                                        <span className='text-white'>, </span>
                                        <span className='text-orange-300'>
                                            b
                                        </span>
                                        <span className='text-white'>
                                            ) =&gt;{" "}
                                        </span>
                                        <span className='text-orange-300'>
                                            a
                                        </span>
                                        <span className='text-white'> + </span>
                                        <span className='text-orange-300'>
                                            b
                                        </span>
                                        <span className='text-white'>;</span>
                                    </div>
                                </div>
                                <p className='text-xs text-white/60 mt-2 text-center'>
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ──────────────────────────────────────── */}
            <section className='px-6 py-20 bg-background'>
                <div className='max-w-5xl mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl font-bold'>
                            Simple, transparent pricing
                        </h2>
                        <p className='mt-3 text-muted-foreground'>
                            Start free. Upgrade when you need more.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-6'>
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-xl border p-6 flex flex-col gap-5 ${
                                    plan.highlighted
                                        ? "border-primary bg-primary/5 shadow-lg"
                                        : "bg-card"
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className='w-fit px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium'>
                                        Most popular
                                    </div>
                                )}

                                <div>
                                    <h3 className='font-bold text-xl'>
                                        {plan.name}
                                    </h3>
                                    <p className='text-sm text-muted-foreground mt-0.5'>
                                        {plan.description}
                                    </p>
                                    <div className='mt-3 flex items-baseline gap-1'>
                                        <span className='text-4xl font-bold'>
                                            {plan.price}
                                        </span>
                                        <span className='text-sm text-muted-foreground'>
                                            {plan.period}
                                        </span>
                                    </div>
                                </div>

                                <ul className='space-y-2 flex-1'>
                                    {plan.features.map((f) => (
                                        <li
                                            key={f}
                                            className='flex items-center gap-2 text-sm'
                                        >
                                            <Check className='w-4 h-4 text-green-500 shrink-0' />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild={!plan.disabled}
                                    variant={
                                        plan.highlighted ? "default" : "outline"
                                    }
                                    disabled={plan.disabled}
                                    className='w-full'
                                >
                                    {plan.disabled ? (
                                        <span>{plan.cta}</span>
                                    ) : (
                                        <Link href={plan.href}>{plan.cta}</Link>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────── */}
            <footer className='border-t px-6 py-10 bg-background'>
                <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-2 font-medium text-foreground'>
                        <svg
                            fill='none'
                            viewBox='0 0 44 44'
                            className='size-6'
                            aria-hidden
                        >
                            <path
                                fill='currentColor'
                                d='M38 0a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6h32ZM22.982 9.105c-.208-1.081-1.756-1.081-1.964 0l-.85 4.421a1 1 0 0 1-1.666.541l-3.287-3.077c-.804-.752-2.056.158-1.589 1.155l1.911 4.077a1 1 0 0 1-1.03 1.417l-4.467-.558c-1.093-.136-1.571 1.336-.607 1.868l3.942 2.175a1 1 0 0 1 0 1.752l-3.942 2.175c-.964.532-.486 2.004.607 1.868l4.468-.558a1 1 0 0 1 1.03 1.417l-1.912 4.077c-.467.997.785 1.907 1.589 1.155l3.287-3.077a1 1 0 0 1 1.666.54l.85 4.422c.208 1.081 1.756 1.081 1.964 0l.85-4.421a1 1 0 0 1 1.666-.541l3.287 3.077c.804.752 2.056-.158 1.589-1.155l-1.911-4.077a1 1 0 0 1 1.03-1.417l4.467.558c1.093.136 1.572-1.336.607-1.868l-3.942-2.175a1 1 0 0 1 0-1.752l3.942-2.175c.965-.532.486-2.004-.607-1.868l-4.468.558a1 1 0 0 1-1.03-1.417l1.912-4.077c.467-.997-.785-1.907-1.589-1.155l-3.287 3.077a1 1 0 0 1-1.666-.54l-.85-4.422Z'
                            />
                        </svg>
                        Snippet Studio
                    </div>
                    <p>
                        © {new Date().getFullYear()} Snippet Studio. Built for
                        developers.
                    </p>
                    <div className='flex gap-4'>
                        <Link
                            href='/dashboard'
                            className='hover:text-foreground transition-colors'
                        >
                            Dashboard
                        </Link>
                        <Link
                            href='/billing'
                            className='hover:text-foreground transition-colors'
                        >
                            Pricing
                        </Link>
                        <Link
                            href='/new'
                            className='hover:text-foreground transition-colors'
                        >
                            New snippet
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
