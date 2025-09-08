"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export function ConvexUserBootstrapper() {
  const { isSignedIn } = useAuth();
  const ensureUser = useMutation(api.mutations.users.ensureUser);

  useEffect(() => {
    if (isSignedIn) {
      ensureUser(); // make sure user exists in Convex
    }
  }, [isSignedIn, ensureUser]);

  return null;
}
