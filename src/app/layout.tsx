import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../components/convex/convex-client-provider";
import { ConvexUserBootstrapper } from "@/components/convex/convex-user-bootstrapper";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boudary";
import { ThemeProvider } from "@/components/theme-provider";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://snippetstudio.dev";

export const metadata: Metadata = {
    metadataBase: new URL(APP_URL),
    title: {
        default: "Snippet Studio — Share Code Instantly",
        template: "%s | Snippet Studio",
    },
    description:
        "Create, highlight, and share beautiful code snippets in seconds. Syntax highlighting, AI tags, screenshot export, and instant sharing links — built for developers.",
    keywords: [
        "code snippets",
        "snippet sharing",
        "syntax highlighting",
        "developer tools",
        "code sharing",
        "programming",
        "snippet studio",
    ],
    authors: [{ name: "Snippet Studio" }],
    creator: "Snippet Studio",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: APP_URL,
        siteName: "Snippet Studio",
        title: "Snippet Studio — Share Code Instantly",
        description:
            "Create, highlight, and share beautiful code snippets in seconds. Syntax highlighting, AI tags, screenshot export, and instant sharing links.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Snippet Studio — Share Code Instantly",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Snippet Studio — Share Code Instantly",
        description:
            "Create, highlight, and share beautiful code snippets in seconds.",
        images: ["/og-image.png"],
        creator: "@snippetstudio",
    },
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <html lang='en' suppressHydrationWarning>
                <body>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <ErrorBoundary>
                            <ConvexClientProvider>
                                <Toaster />
                                <ConvexUserBootstrapper />
                                <Header />
                                {children}
                            </ConvexClientProvider>
                        </ErrorBoundary>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
