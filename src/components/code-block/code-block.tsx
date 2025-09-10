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
