import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { QuoteRequest } from "@/lib/models/QuoteRequest";
import { transporter, MAIL_FROM, MAIL_TO } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, company, email, phone,
      service, description, quantity, budget, timeline,
    } = body;

    // Basic validation
    if (!fullName || !company || !email || !phone || !service || !description || !timeline) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // 1. Save to MongoDB
    await connectDB();
    const record = await QuoteRequest.create({
      fullName, company, email, phone,
      service, description, quantity, budget, timeline,
    });

    // 2. Send notification email to CentzMi team
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject: `New Quote Request — ${service} from ${company}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1e3323">
          <div style="background:#1e3323;padding:32px;text-align:center">
            <h1 style="color:#f5f0e8;font-size:24px;letter-spacing:0.2em;margin:0">CENTZMI</h1>
            <p style="color:#c4a86b;font-size:11px;letter-spacing:0.3em;margin:4px 0 0">NEW QUOTE REQUEST</p>
          </div>
          <div style="padding:32px;background:#faf7f2;border:1px solid #ede7db">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600;width:40%">Full Name</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${fullName}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Company</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${company}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Email</td><td style="padding:10px 0;border-bottom:1px solid #ede7db"><a href="mailto:${email}" style="color:#c4a86b">${email}</a></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Phone</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${phone}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Service</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${service}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Timeline</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${timeline}</td></tr>
              ${budget ? `<tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Budget</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${budget}</td></tr>` : ""}
              ${quantity ? `<tr><td style="padding:10px 0;border-bottom:1px solid #ede7db;font-weight:600">Quantity</td><td style="padding:10px 0;border-bottom:1px solid #ede7db">${quantity}</td></tr>` : ""}
            </table>
            <div style="margin-top:24px">
              <p style="font-weight:600;margin-bottom:8px">Project Description</p>
              <p style="background:#f5f0e8;padding:16px;border-radius:8px;line-height:1.7;margin:0">${description}</p>
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

    // 3. Send confirmation email to client
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: `We received your quote request — CentzMi`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1e3323">
          <div style="background:#1e3323;padding:32px;text-align:center">
            <h1 style="color:#f5f0e8;font-size:24px;letter-spacing:0.2em;margin:0">CENTZMI</h1>
            <p style="color:#c4a86b;font-size:11px;letter-spacing:0.3em;margin:4px 0 0">CREATIVE BRANDING</p>
          </div>
          <div style="padding:40px;background:#faf7f2;border:1px solid #ede7db">
            <h2 style="font-size:28px;font-weight:300;margin:0 0 16px;font-family:Georgia,serif">Thank you, ${fullName}.</h2>
            <p style="color:#6b6b5e;line-height:1.7;margin:0 0 16px">
              We've received your quote request for <strong>${service}</strong> and a member of the CentzMi team will be in touch within <strong>one business day</strong>.
            </p>
            <p style="color:#6b6b5e;line-height:1.7;margin:0 0 32px">
              In the meantime, feel free to explore our portfolio or reach out directly on WhatsApp if your project is time-sensitive.
            </p>
            <div style="text-align:center;margin-top:8px">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portfolio" style="display:inline-block;background:#c4a86b;color:#1e3323;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:600;font-size:14px">View Our Portfolio</a>
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
    console.error("[api/quote]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
