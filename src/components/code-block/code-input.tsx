"use client";
import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { go } from "@codemirror/lang-go";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeInput = ({
    code,
    onChange,
    language,
}: {
    code: string;
    onChange: (code: string) => void;
    language: string;
}) => {

    const extensions = useMemo(() => {
        switch (language.toLowerCase()) {
            case "javascript":
            case "typescript":
                return [javascript({ jsx: true, typescript: true })];
            case "python":
                return [python()];
            case "html":
                return [html()];
            case "css":
                return [css()];
            case "go":
                return [go()];
            default:
                return [];
        }
    }, [language]);

    return (
        <div className='relative'>
            <CodeMirror
                value={code}
                onChange={onChange}
                minHeight='200px'
                theme={oneDark}
                basicSetup={{
                    foldGutter: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: false,
                }}
                extensions={extensions}
                className='rounded-lg border overflow-clip text-left'
            />
        </div>
    );
};

export default CodeInput;
