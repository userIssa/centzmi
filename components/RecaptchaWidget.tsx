"use client";

import { useEffect, useRef } from "react";

interface RecaptchaWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  siteKey?: string;
  theme?: "light" | "dark";
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (cb: () => void) => void;
    };
    __onRecaptchaLoaded?: () => void;
  }
}

export default function RecaptchaWidget({
  onVerify,
  onExpire,
  siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  theme = "light",
}: RecaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let isMounted = true;

    const renderWidget = () => {
      if (!window.grecaptcha || !window.grecaptcha.render || !containerRef.current || !isMounted) {
        return;
      }

      // Avoid re-rendering into already initialized container
      if (widgetIdRef.current !== null) {
        return;
      }

      try {
        containerRef.current.innerHTML = "";
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token: string) => {
            if (isMounted) onVerify(token);
          },
          "expired-callback": () => {
            if (isMounted) onExpire?.();
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.warn("[RecaptchaWidget] render error:", err);
      }
    };

    // If script already loaded
    if (typeof window.grecaptcha !== "undefined") {
      renderWidget();
    } else {
      // Check if script tag exists
      let script = document.getElementById("grecaptcha-v2-script") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "grecaptcha-v2-script";
        script.src = "https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoaded&render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      const prevCallback = window.__onRecaptchaLoaded;
      window.__onRecaptchaLoaded = () => {
        prevCallback?.();
        if (isMounted) renderWidget();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [siteKey, theme, onVerify, onExpire]);

  if (!siteKey) return null;

  return (
    <div className="my-3 flex flex-col items-start overflow-hidden">
      <div ref={containerRef} id="recaptcha-container" />
    </div>
  );
}
