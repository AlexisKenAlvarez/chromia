import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDomainName(url: string) {
  // Remove "https://" or "http://"
  if (url.startsWith("https://")) {
    url = url.replace("https://", "");
  } else if (url.startsWith("http://")) {
    url = url.replace("http://", "");
  }

  // Remove "www."
  url = url.replace("www.", "");

  // Extract domain name
  const domainName: string = url.split(".")[0];

  return domainName;
}

export function isChromeExtensionURL(url: string) {
  return url.startsWith("chrome-extension://");
}

export function isValidURL(url: string) {
  const pattern = /^(https?|ftp|file|chrome-extension):\/\/[^\s/$.?#].[^\s]*$/;
  return pattern.test(url);
}
