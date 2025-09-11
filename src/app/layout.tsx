import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../components/convex/convex-client-provider";
import { ConvexUserBootstrapper } from "@/components/convex/convex-user-bootstrapper";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boudary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/sidebar";

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
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <SidebarProvider>
                <html lang='en'>
                    <AppSidebar />
                    <body>
                        <ErrorBoundary>
                            <ConvexClientProvider>
                                <Toaster />
                                <ConvexUserBootstrapper />
                                <SidebarInset>
                                    <Header />
                                    {children}
                                </SidebarInset>
                            </ConvexClientProvider>
                        </ErrorBoundary>
                    </body>
                </html>
            </SidebarProvider>
        </ClerkProvider>
    );
}
