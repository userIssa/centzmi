export interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  errorCodes?: string[];
  error?: string;
}

/**
 * Verifies a Google reCAPTCHA (v3 or v2) token server-side.
 * @param token - The response token sent from the client
 * @param expectedAction - Optional expected action name for reCAPTCHA v3 verification
 * @param minScore - Minimum acceptable score for v3 (default 0.5)
 */
export async function verifyRecaptchaToken(
  token?: string | null,
  expectedAction?: string,
  minScore = 0.5
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If reCAPTCHA secret key is not set in development, bypass verification with a warning
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set. Bypassing reCAPTCHA check in non-production environment."
      );
      return { success: true, score: 1.0 };
    }
    console.error("[reCAPTCHA] RECAPTCHA_SECRET_KEY is not configured in production.");
    return {
      success: false,
      error: "reCAPTCHA server configuration error.",
    };
  }

  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[reCAPTCHA] No token received in development mode (e.g., ad-blocker active or localhost not registered). Allowing submission for local testing."
      );
      return { success: true, score: 1.0 };
    }
    return {
      success: false,
      error: "Missing reCAPTCHA token.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Google verification endpoint responded with HTTP ${res.status}`,
      };
    }

    const data = await res.json();

    if (!data.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[reCAPTCHA] Verification returned error codes in development:",
          data["error-codes"],
          "- Allowing submission in development mode."
        );
        return { success: true, score: 1.0 };
      }
      return {
        success: false,
        errorCodes: data["error-codes"],
        error: "reCAPTCHA verification failed.",
      };
    }

    // For reCAPTCHA v3, verify score and action if provided
    if (typeof data.score === "number") {
      if (data.score < minScore) {
        console.warn(`[reCAPTCHA] Low bot score: ${data.score} (threshold: ${minScore})`);
        return {
          success: false,
          score: data.score,
          action: data.action,
          error: "Verification failed due to low security score.",
        };
      }

      if (expectedAction && data.action && data.action !== expectedAction) {
        console.warn(
          `[reCAPTCHA] Action mismatch: expected ${expectedAction}, got ${data.action}`
        );
        return {
          success: false,
          score: data.score,
          action: data.action,
          error: "reCAPTCHA action mismatch.",
        };
      }
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    };
  } catch (err) {
    console.error("[reCAPTCHA] Error during token verification:", err);
    return {
      success: false,
      error: "Failed to connect to reCAPTCHA service.",
    };
  }
}
