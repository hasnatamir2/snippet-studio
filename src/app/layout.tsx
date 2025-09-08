import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../components/convex/convex-client-provider";
import { ConvexUserBootstrapper } from "@/components/convex/convex-user-bootstrapper";
import { Header } from "@/components/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Header />

                    <ConvexClientProvider>
                        <ConvexUserBootstrapper />
                        {children}
                    </ConvexClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
