"use client";

import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <InnerProviders>{children}</InnerProviders>
        </ClerkProvider>
    );
}

export function InnerProviders({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <ConvexProviderWithClerk
            client={convex}
            useAuth={() => ({
                isLoaded: auth.isLoaded,
                isSignedIn: auth.isSignedIn,
                getToken: auth.getToken,
                orgId: auth.orgId,
                orgRole: auth.orgRole,
            })}
        >
            {children}
        </ConvexProviderWithClerk>
    );
}
