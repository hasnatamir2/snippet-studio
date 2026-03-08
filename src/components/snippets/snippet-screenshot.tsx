"use client";
import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Camera, Download, Clipboard, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const GRADIENTS = [
    {
        label: "Noir",
        value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    },
    {
        label: "Dark",
        value: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
    },
    {
        label: "Purple",
        value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
        label: "Ocean",
        value: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
    },
    {
        label: "Sunset",
        value: "linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)",
    },
    {
        label: "Forest",
        value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    },
    {
        label: "Candy",
        value: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    },
    {
        label: "Light",
        value: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
    },
];

// X (Twitter) icon SVG
function XIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox='0 0 24 24'
            className={className}
            fill='currentColor'
            aria-hidden
        >
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
    );
}

// LinkedIn icon SVG
function LinkedInIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox='0 0 24 24'
            className={className}
            fill='currentColor'
            aria-hidden
        >
            <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
        </svg>
    );
}

export function SnippetScreenshot({
    code,
    language,
    title,
    tags,
    snippetUrl,
}: {
    code: string;
    language: string;
    title: string;
    tags?: string[];
    snippetUrl?: string;
}) {
    const captureRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [gradient, setGradient] = useState(GRADIENTS[0].value);
    const [exporting, setExporting] = useState(false);

    const codeRef = useCallback(
        (el: HTMLElement | null) => {
            if (!el) return;
            el.textContent = code;
            el.removeAttribute("data-highlighted");
            el.className = language ? `language-${language}` : "";
            hljs.highlightElement(el);
        },
        [code, language]
    );

    const capture = async (): Promise<string | null> => {
        if (!captureRef.current) return null;
        return toPng(captureRef.current, { pixelRatio: 2, cacheBust: true });
    };

    const exportPng = async () => {
        setExporting(true);
        try {
            const dataUrl = await capture();
            if (!dataUrl) return;
            const link = document.createElement("a");
            link.download = `${title || "snippet"}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Screenshot exported!");
        } catch {
            toast.error("Failed to export screenshot");
        } finally {
            setExporting(false);
        }
    };

    const copyToClipboard = async () => {
        setExporting(true);
        try {
            const dataUrl = await capture();
            if (!dataUrl) return;
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ]);
            toast.success("Screenshot copied to clipboard!");
        } catch {
            toast.error("Failed to copy screenshot");
        } finally {
            setExporting(false);
        }
    };

    // Web Share API — shares the PNG file natively on mobile
    const nativeShare = async () => {
        setExporting(true);
        try {
            const dataUrl = await capture();
            if (!dataUrl) return;
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `${title || "snippet"}.png`, {
                type: "image/png",
            });

            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    title: title || "Code Snippet",
                    text: `Check out this snippet on Snippet Studio${snippetUrl ? ": " + snippetUrl : ""}`,
                    files: [file],
                });
            } else if (navigator.share && snippetUrl) {
                await navigator.share({
                    title: title || "Code Snippet",
                    text: `Check out this snippet on Snippet Studio`,
                    url: snippetUrl,
                });
            } else {
                // Fallback: download
                await exportPng();
            }
        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
                toast.error("Sharing failed");
            }
        } finally {
            setExporting(false);
        }
    };

    const shareToX = () => {
        const text = encodeURIComponent(
            `Check out this ${language} snippet: "${title}" 🚀`
        );
        const url = snippetUrl ? encodeURIComponent(snippetUrl) : "";
        window.open(
            `https://x.com/intent/tweet?text=${text}${url ? `&url=${url}` : ""}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const shareToLinkedIn = () => {
        if (!snippetUrl) return;
        const url = encodeURIComponent(snippetUrl);
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const canNativeShare =
        typeof navigator !== "undefined" && "share" in navigator;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='sm'>
                    <Camera className='w-4 h-4 mr-1' /> Screenshot
                </Button>
            </DialogTrigger>

            <DialogContent className='w-full md:max-w-4xl max-w-2xl flex flex-col gap-0 p-0 max-h-[92vh] overflow-hidden'>
                {/* Header */}
                <div className='px-5 pt-5 pb-3 shrink-0'>
                    <DialogTitle className='text-base font-semibold'>
                        Export Screenshot
                    </DialogTitle>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                        Pick a background, then export or share
                    </p>
                </div>

                {/* Gradient picker — horizontal scroll on mobile */}
                <div className='px-5 pb-3 shrink-0'>
                    <div className='flex gap-2 overflow-x-auto p-1 no-scrollbar'>
                        {GRADIENTS.map((g) => (
                            <button
                                key={g.label}
                                title={g.label}
                                className={`w-8 h-8 rounded-full border-2 shrink-0 transition-all ${
                                    gradient === g.value
                                        ? "border-primary scale-110 shadow-md"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                                style={{ background: g.value }}
                                onClick={() => setGradient(g.value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Preview — scrollable */}
                <div className='flex-1 min-h-0 overflow-y-auto px-5 pb-3'>
                    <div
                        ref={captureRef}
                        style={{
                            background: gradient,
                            padding: "24px",
                            borderRadius: "12px",
                        }}
                    >
                        <div
                            style={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                            }}
                        >
                            {/* Title bar */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "#1e1e1e",
                                    padding: "10px 16px",
                                }}
                            >
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        background: "#ff5f57",
                                        display: "inline-block",
                                    }}
                                />
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        background: "#febc2e",
                                        display: "inline-block",
                                    }}
                                />
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        background: "#28c840",
                                        display: "inline-block",
                                    }}
                                />
                                <span
                                    style={{
                                        flex: 1,
                                        textAlign: "center",
                                        fontSize: "12px",
                                        color: "#888",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {title || language}
                                </span>
                                <span
                                    style={{
                                        fontSize: "10px",
                                        color: "#666",
                                        fontFamily: "monospace",
                                        background: "#2a2a2a",
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                    }}
                                >
                                    {language}
                                </span>
                            </div>

                            {/* Tags strip */}
                            {tags && tags.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "6px",
                                        flexWrap: "wrap",
                                        padding: "8px 16px",
                                        background: "#161616",
                                        borderBottom: "1px solid #2a2a2a",
                                    }}
                                >
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                fontSize: "11px",
                                                color: "#9ca3af",
                                                background: "#252525",
                                                border: "1px solid #333",
                                                padding: "2px 8px",
                                                borderRadius: "999px",
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Code */}
                            <pre
                                style={{
                                    background: "#0d1117",
                                    padding: "20px",
                                    margin: 0,
                                    fontSize: "13px",
                                    lineHeight: "1.6",
                                    fontFamily: "monospace",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    overflowX: "hidden",
                                }}
                            >
                                <code ref={codeRef} />
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Actions — pinned bottom */}
                <div className='shrink-0 px-5 pb-5 pt-3 border-t space-y-2'>
                    {/* Export row */}
                    <div className='grid grid-cols-2 gap-2'>
                        <Button
                            onClick={exportPng}
                            disabled={exporting}
                            className='w-full'
                        >
                            {exporting ? (
                                <Loader2 className='w-4 h-4 mr-1.5 animate-spin' />
                            ) : (
                                <Download className='w-4 h-4 mr-1.5' />
                            )}
                            Download PNG
                        </Button>
                        <Button
                            variant='outline'
                            onClick={copyToClipboard}
                            disabled={exporting}
                            className='w-full'
                        >
                            <Clipboard className='w-4 h-4 mr-1.5' />
                            Copy Image
                        </Button>
                    </div>

                    {/* Share row */}
                    <div className='grid grid-cols-3 gap-2'>
                        {canNativeShare && (
                            <Button
                                variant='outline'
                                onClick={nativeShare}
                                disabled={exporting}
                                className='w-full col-span-1'
                            >
                                <Share2 className='w-4 h-4 mr-1.5' />
                                <span className='hidden xs:inline'>Share</span>
                                <span className='xs:hidden'>Share</span>
                            </Button>
                        )}
                        <Button
                            variant='outline'
                            onClick={shareToX}
                            className={`w-full ${canNativeShare ? "" : "col-span-1"}`}
                        >
                            <XIcon className='w-3.5 h-3.5 mr-1.5' />
                            Post on X
                        </Button>
                        <Button
                            variant='outline'
                            onClick={shareToLinkedIn}
                            disabled={!snippetUrl}
                            className='w-full'
                        >
                            <LinkedInIcon className='w-3.5 h-3.5 mr-1.5' />
                            LinkedIn
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
