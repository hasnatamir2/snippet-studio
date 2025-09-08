import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConvexHttpClient } from "convex/browser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ConvexHttp = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
