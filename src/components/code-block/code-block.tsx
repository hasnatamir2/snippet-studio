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
        if (codeRef.current) {
            // reset old highlight
            codeRef.current.removeAttribute("data-highlighted");
            codeRef.current.classList.remove(
                ...Array.from(codeRef.current.classList).filter((c) =>
                    c.startsWith("hljs")
                )
            );

            // re-highlight
            hljs.highlightElement(codeRef.current);
        }
    }, [code, language]);

    return (
        <pre className='rounded-lg text-sm bg-muted overflow-x-auto'>
            <code
                ref={codeRef}
                className={language ? `language-${language}` : ""}
            >
                {code}
            </code>
        </pre>
    );
}
