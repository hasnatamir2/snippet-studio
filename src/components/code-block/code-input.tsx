"use client";
import React, { useMemo, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@codemirror/view";
import { Sun, Moon, Hash } from "lucide-react";

// Maps app language names → loadLanguage identifiers (file-extension strings)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LANG_ID: Record<string, any> = {
    javascript: "js",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    ruby: "rb",
    go: "go",
    rust: "rs",
    php: "php",
    swift: "swift",
    kotlin: "kt",
    scala: "scala",
    sql: "sql",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    markdown: "md",
    shell: "sh",
    r: "r",
    dart: "dart",
    lua: "lua",
    haskell: "hs",
    groovy: "groovy",
    julia: "jl",
    vue: "vue",
};

const FONT_SIZES = [
    { label: "SM", value: 13 },
    { label: "MD", value: 15 },
    { label: "LG", value: 17 },
];

const CodeInput = ({
    code,
    onChange,
    language,
    onSave,
    readOnly = false,
}: {
    code: string;
    onChange: (code: string) => void;
    language: string;
    onSave?: () => void;
    readOnly?: boolean;
}) => {
    const [theme, setTheme] = React.useState<"dark" | "light">("dark");
    const [fontSize, setFontSize] = React.useState(15);
    const [showLineNumbers, setShowLineNumbers] = React.useState(true);

    useEffect(() => {
        if (!onSave) return;
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                onSave();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onSave]);

    const extensions = useMemo(() => {
        const id = LANG_ID[language.toLowerCase()];
        const langExt = id ? loadLanguage(id) : null;
        const exts = [EditorView.lineWrapping];
        if (langExt) exts.push(langExt);
        return exts;
    }, [language]);

    return (
        <div className='relative rounded-lg border overflow-hidden w-full max-w-full'>
            {/* Floating controls — overlaid top-right of the editor */}
            <div className='absolute top-2 right-2 z-10 flex items-center gap-0.5 bg-background/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-md border px-1.5 py-1 shadow-sm max-w-[calc(100%-1rem)] overflow-x-auto'>
                {/* Theme toggle */}
                <button
                    type='button'
                    onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                    className='p-1 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                    title={theme === "dark" ? "Light mode" : "Dark mode"}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? <Sun className='w-3.5 h-3.5' /> : <Moon className='w-3.5 h-3.5' />}
                </button>

                <div className='w-px h-4 bg-border mx-0.5' />

                {/* Font size */}
                {FONT_SIZES.map(({ label, value }) => (
                    <button
                        key={value}
                        type='button'
                        onClick={() => setFontSize(value)}
                        aria-label={`Set font size ${label}`}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                            fontSize === value
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        }`}
                    >
                        {label}
                    </button>
                ))}

                <div className='w-px h-4 bg-border mx-0.5' />

                {/* Line numbers toggle */}
                <button
                    type='button'
                    onClick={() => setShowLineNumbers((n) => !n)}
                    title='Toggle line numbers'
                    aria-label={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
                    className={`p-1 rounded transition-colors hover:bg-muted/80 ${
                        showLineNumbers ? "text-foreground" : "text-muted-foreground/40"
                    }`}
                >
                    <Hash className='w-3.5 h-3.5' />
                </button>

                {onSave && (
                    <>
                        <div className='w-px h-4 bg-border mx-0.5 hidden sm:block' />
                        <kbd className='text-[9px] text-muted-foreground px-1 font-mono select-none hidden sm:inline'>⌘S</kbd>
                    </>
                )}
            </div>

            <CodeMirror
                value={code}
                onChange={onChange}
                minHeight='200px'
                maxHeight='65vh'
                theme={theme === "dark" ? oneDark : "light"}
                readOnly={readOnly}
                basicSetup={{
                    lineNumbers: showLineNumbers,
                    syntaxHighlighting: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                }}
                extensions={extensions}
                className='text-left w-full'
                style={{ fontSize: `${fontSize}px` }}
            />
        </div>
    );
};

export default CodeInput;
