import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// In-memory token store (resets on server restart — acceptable for simple admin auth)
const validTokens = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, password } = body;

    // ---------- LOGIN ----------
    if (action === "login") {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required." },
          { status: 400 }
        );
      }

      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: "Invalid password." },
          { status: 401 }
        );
      }

      const token = generateToken();
      validTokens.add(token);

      return NextResponse.json({ token });
    }

    // ---------- VERIFY TOKEN ----------
    if (action === "verify") {
      const { token } = body;
      if (!token || !validTokens.has(token)) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }
      return NextResponse.json({ valid: true });
    }

    // ---------- LOGOUT ----------
    if (action === "logout") {
      const { token } = body;
      if (token) validTokens.delete(token);
      return NextResponse.json({ ok: true });
    }

    // ---------- FORGOT PASSWORD ----------
    if (action === "forgot") {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_FROM || "CentzMi <info@centzmi.com>",
        to: process.env.MAIL_TO || "info@centzmi.com",
        subject: "CentzMi Admin — Password Reminder",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1e3323;">Admin Password Reminder</h2>
            <p>Someone requested the admin portal password.</p>
            <div style="background: #f5f0e8; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
              <strong style="color: #1e3323;">Current Password:</strong>
              <code style="display: block; font-size: 18px; margin-top: 8px; color: #c4a86b;">${ADMIN_PASSWORD}</code>
            </div>
            <p style="color: #6b6b5e; font-size: 13px;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        message: "Password has been sent to the admin email.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    console.error("Admin auth error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

/** Helper to validate auth token from request headers */
export function validateToken(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return validTokens.has(token);
}
