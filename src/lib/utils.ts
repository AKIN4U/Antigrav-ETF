import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    return appUrl;
  }

  // Fallback for local development
  return 'http://localhost:3000';
}
