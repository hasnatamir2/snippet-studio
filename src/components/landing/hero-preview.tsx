"use client";
import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

const DEMO_CODE = `// snippet-studio.ts
import { snippetStudio } from "@snippet-studio/sdk";

const greet = async (name: string): Promise<string> => {
  const message = \`Welcome to Snippet Studio, \${name}!\`;

  await snippetStudio.create({
    title: "Greeting Function",
    language: "typescript",
    tags: ["utils", "typescript"],
    isPublic: true,
  });

  return message;
};

greet("Developer");
`;

export default function HeroPreview() {
    const extensions = useMemo(() => {
        const ext = loadLanguage("ts");
        return ext ? [ext] : [];
    }, []);

    return (
        <div className='rounded-xl overflow-hidden shadow-2xl border border-white/10 max-w-full'>
            {/* macOS title bar */}
            <div className='flex items-center gap-1.5 bg-[#1e1e1e] px-4 py-3'>
                <span className='w-3 h-3 rounded-full bg-[#ff5f57]' />
                <span className='w-3 h-3 rounded-full bg-[#febc2e]' />
                <span className='w-3 h-3 rounded-full bg-[#28c840]' />
                <span className='flex-1 text-center text-xs text-gray-500 font-mono'>
                    greeting.ts
                </span>
            </div>
            <CodeMirror
                value={DEMO_CODE}
                theme={oneDark}
                readOnly
                extensions={extensions}
                basicSetup={{
                    lineNumbers: true,
                    foldKeymap: false,
                    searchKeymap: false,
                    autocompletion: false,
                    highlightActiveLine: false,
                    highlightActiveLineGutter: false,
                }}
                className='text-sm overflow-x-auto'
            />
        </div>
    );
}
