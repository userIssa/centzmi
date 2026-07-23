import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactSubmission } from "@/lib/models/ContactSubmission";
import { transporter, MAIL_FROM, MAIL_TO } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    // 1. Save to MongoDB
    await connectDB();
    const record = await ContactSubmission.create({ name, email, phone, message });

    // 2. Notify CentzMi team
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1e3323">
          <div style="background:#1e3323;padding:32px;text-align:center">
            <h1 style="color:#f5f0e8;font-size:24px;letter-spacing:0.2em;margin:0">CENTZMI</h1>
            <p style="color:#c4a86b;font-size:11px;letter-spacing:0.3em;margin:4px 0 0">NEW CONTACT MESSAGE</p>
          </div>
          <div style="padding:32px;background:#faf7f2;border:1px solid #ede7db">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600;width:30%">Name</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Email</td><td style="padding:10px 0;border-bottom:1px solid #ede7db"><a href="mailto:${email}" style="color:#c4a86b">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Phone</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${phone}</td></tr>` : ""}
            </table>
            <div style="margin-top:24px">
              <p style="font-weight:600;margin-bottom:8px">Message</p>
              <p style="background:#f5f0e8;padding:16px;border-radius:8px;line-height:1.7;margin:0">${message}</p>
            </div>
            <div style="margin-top:24px;padding:16px;background:#1e3323;border-radius:8px;text-align:center">
              <p style="color:#f5f0e8;margin:0;font-size:13px">Record ID: <span style="color:#c4a86b;font-family:monospace">${record._id}</span></p>
            </div>
          </div>
          <div style="padding:16px;text-align:center;background:#f5f0e8;border:1px solid #ede7db;border-top:none">
            <p style="color:#6b6b5e;font-size:12px;margin:0">CentzMi — Creative Branding &amp; Visual Communications</p>
          </div>
        </div>
      `,
    });

    // 3. Auto-reply to sender
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: "We got your message — CentzMi",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1e3323">
          <div style="background:#1e3323;padding:32px;text-align:center">
            <h1 style="color:#f5f0e8;font-size:24px;letter-spacing:0.2em;margin:0">CENTZMI</h1>
            <p style="color:#c4a86b;font-size:11px;letter-spacing:0.3em;margin:4px 0 0">CREATIVE BRANDING</p>
          </div>
          <div style="padding:40px;background:#faf7f2;border:1px solid #ede7db">
            <h2 style="font-size:28px;font-weight:300;margin:0 0 16px;font-family:Georgia,serif">Hi ${name},</h2>
            <p style="color:#6b6b5e;line-height:1.7;margin:0 0 16px">
              Thanks for reaching out to CentzMi. We've received your message and will get back to you shortly — usually within <strong>one business day</strong>.
            </p>
            <p style="color:#6b6b5e;line-height:1.7;margin:0 0 32px">
              If your enquiry is urgent, feel free to reach us directly on WhatsApp.
            </p>
            <div style="text-align:center">
              <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:600;font-size:14px">Chat on WhatsApp</a>
            </div>
          </div>
          <div style="padding:16px;text-align:center;background:#f5f0e8;border:1px solid #ede7db;border-top:none">
            <p style="color:#6b6b5e;font-size:12px;margin:0">CentzMi — Creative Branding &amp; Visual Communications · Lagos, Nigeria</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: record._id });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
