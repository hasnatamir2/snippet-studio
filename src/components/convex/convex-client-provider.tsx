"use client";

import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <InnerProviders>{children}</InnerProviders>
    </ClerkProvider>
  );
}

export function InnerProviders({ children }: { children: ReactNode }) {
  return <ConvexProviderWithClerk client={convex} useAuth={useAuth}>{children}</ConvexProviderWithClerk>;
}