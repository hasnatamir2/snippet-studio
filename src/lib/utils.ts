import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConvexHttpClient } from "convex/browser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ConvexHttp = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export const formatDate = (date: string | number | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000; // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "yesterday";

  // If within this year → show "Sep 8"
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  // Otherwise → show "Sep 8, 2023"
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
