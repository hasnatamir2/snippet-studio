"use client";
import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Camera, Download, Clipboard } from "lucide-react";
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

export function SnippetScreenshot({
    code,
    language,
    title,
    tags,
}: {
    code: string;
    language: string;
    title: string;
    tags?: string[];
}) {
    const captureRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [gradient, setGradient] = useState(GRADIENTS[0].value);
    const [exporting, setExporting] = useState(false);

    // Callback ref: fires the instant the <code> element mounts in the portal,
    // which is after the Dialog opens — useRef+useEffect misses this timing.
    const codeRef = useCallback((el: HTMLElement | null) => {
        if (!el) return;
        el.textContent = code;
        el.removeAttribute("data-highlighted");
        el.className = language ? `language-${language}` : "";
        hljs.highlightElement(el);
    }, [code, language]);

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='sm'>
                    <Camera className='w-4 h-4 mr-1' /> Screenshot
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-5xl min-w-3xl flex flex-col max-h-[90vh]'>
                <DialogTitle>Export Screenshot</DialogTitle>

                {/* Gradient picker — always visible */}
                <div className='flex gap-2 flex-wrap shrink-0'>
                    {GRADIENTS.map((g) => (
                        <button
                            key={g.label}
                            title={g.label}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                                gradient === g.value
                                    ? "border-primary scale-110"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            style={{ background: g.value }}
                            onClick={() => setGradient(g.value)}
                        />
                    ))}
                </div>

                {/* Scrollable preview area */}
                <div className='overflow-y-auto flex-1 min-h-0'>
                    {/* Capture target — inline styles only so html-to-image picks them up */}
                    <div
                        ref={captureRef}
                        style={{
                            background: gradient,
                            padding: "32px",
                            borderRadius: "12px",
                        }}
                    >
                        {/* macOS window chrome */}
                        <div
                            style={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
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
                                {/* Language badge */}
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

                            {/* Code area */}
                            <pre
                                style={{
                                    background: "#0d1117",
                                    padding: "24px",
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

                {/* Export buttons — always pinned at the bottom */}
                <div className='flex gap-2 shrink-0 pt-2 border-t'>
                    <Button
                        onClick={exportPng}
                        disabled={exporting}
                        className='flex-1'
                    >
                        <Download className='w-4 h-4 mr-1' /> Export PNG
                    </Button>
                    <Button
                        variant='outline'
                        onClick={copyToClipboard}
                        disabled={exporting}
                        className='flex-1'
                    >
                        <Clipboard className='w-4 h-4 mr-1' /> Copy Image
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
