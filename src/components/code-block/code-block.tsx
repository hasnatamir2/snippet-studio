"use client";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useEffect, useRef } from "react";

export function CodeBlock({
    code,
    language,
}: {
    code: string;
    language: string;
}) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = codeRef.current;
        if (!el) return;
        // Set raw text first so hljs always gets clean input
        el.textContent = code;
        el.removeAttribute("data-highlighted");
        el.className = language ? `language-${language}` : "";
        hljs.highlightElement(el);
    }, [code, language]);

    return (
        <pre className='rounded-lg text-sm overflow-x-auto m-0 h-full'>
            {/* No React children — content is set imperatively via ref */}
            <code ref={codeRef} />
        </pre>
    );
}
