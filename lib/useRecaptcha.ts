"use client";

// Re-export or fallback utility if needed
export async function getRecaptchaToken(): Promise<string | null> {
  if (typeof window !== "undefined" && window.grecaptcha?.getResponse) {
    return window.grecaptcha.getResponse() || null;
  }
  return null;
}
