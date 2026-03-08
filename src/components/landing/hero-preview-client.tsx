"use client";
import dynamic from "next/dynamic";

const HeroPreview = dynamic(() => import("./hero-preview"), {
    ssr: false,
    loading: () => (
        <div className='rounded-xl border border-white/10 bg-[#1e1e1e] h-72 animate-pulse' />
    ),
});

export default function HeroPreviewClient() {
    return <HeroPreview />;
}
