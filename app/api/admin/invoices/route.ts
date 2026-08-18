import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invoice } from "@/lib/models/Invoice";

export async function GET(req: NextRequest) {
  try {
    // Check auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(),
    ]);

    return NextResponse.json({
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("List invoices error:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoices." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    // Auto-generate invoice number if not provided
    if (!body.invoiceNumber) {
      const year = new Date().getFullYear();
      const prefix = body.documentType === "quote" ? "QUO" : "INV";
      const count = await Invoice.countDocuments({
        documentType: body.documentType || "invoice",
      });
      body.invoiceNumber = `${prefix}-${year}-${String(count + 1).padStart(3, "0")}`;
    }

    const invoice = await Invoice.create(body);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create invoice error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create invoice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
