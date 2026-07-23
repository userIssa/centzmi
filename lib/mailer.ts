import nodemailer from "nodemailer";

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn(
    "[mailer] SMTP_USER or SMTP_PASS is not set — emails will not be sent."
  );
}

/**
 * Reusable Nodemailer transporter using Google SMTP.
 *
 * For Gmail personal accounts:
 *   - Enable 2-Step Verification
 *   - Generate an App Password at: myaccount.google.com/apppasswords
 *   - Set SMTP_USER=your@gmail.com, SMTP_PASS=<16-char-app-password>
 *
 * For Google Workspace:
 *   - Same process — use your Workspace address + App Password
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // false = STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Shared from/to defaults */
export const MAIL_FROM = process.env.MAIL_FROM ?? "CentzMi <noreply@centzmi.com>";
export const MAIL_TO   = process.env.MAIL_TO   ?? process.env.SMTP_USER ?? "";
