import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../components/convex/convex-client-provider";
import { ConvexUserBootstrapper } from "@/components/convex/convex-user-bootstrapper";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boudary";

export const metadata: Metadata = {
    title: "Snippet Studio",
    description: "Share your code snippets with ease.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body>
                    <ErrorBoundary>
                        <ConvexClientProvider>
                            <Toaster />
                            <ConvexUserBootstrapper />
                            <Header />
                            {children}
                        </ConvexClientProvider>
                    </ErrorBoundary>
                </body>
            </html>
        </ClerkProvider>
    );
}
