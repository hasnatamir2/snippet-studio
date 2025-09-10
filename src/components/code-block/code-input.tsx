"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import hljs from "highlight.js";
import { Button } from "../ui/button";
import { toast } from "sonner";

const CodeInput = ({
    code,
    onChange,
    langExt,
}: {
    code: string;
    onChange: (code: string) => void;
    langExt: string[];
}) => {
    const result = hljs.highlightAuto(code || "");
    const lang = result.language || "javascript";

    const extension = langExt.find(
        (ext) => ext.toLowerCase() === lang.toLowerCase()
    );

    return (
        <div className='relative'>
            <CodeMirror
                value={code}
                onChange={onChange}
                height='auto'
                theme='dark'
                basicSetup={{
                    foldGutter: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: false,
                }}
                lang={extension}
                className='rounded-lg border overflow-clip text-left'
            />
        </div>
    );
};

export default CodeInput;
