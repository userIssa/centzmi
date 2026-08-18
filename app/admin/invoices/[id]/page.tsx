"use client";

// This page requires runtime data — skip static prerendering
export const dynamic = "force-dynamic";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import InvoiceForm from "@/components/admin/InvoiceForm";
import type { InvoiceData } from "@/components/admin/InvoicePreview";

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [token, setToken] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("centzmi_admin_token");
    if (!stored) {
      router.push("/admin");
      return;
    }

    // Verify token and fetch invoice in parallel
    Promise.all([
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", token: stored }),
      }).then((r) => r.json()),
      fetch(`/api/admin/invoices/${id}`, {
        headers: { Authorization: `Bearer ${stored}` },
      }).then((r) => r.json()),
    ])
      .then(([authData, invData]) => {
        if (!authData.valid) {
          router.push("/admin");
          return;
        }
        setToken(stored);

        if (invData.invoice) {
          // Transform MongoDB dates to string format for the form
          const inv = invData.invoice;
          setInvoiceData({
            documentType: inv.documentType || "invoice",
            invoiceNumber: inv.invoiceNumber || "",
            billedTo: inv.billedTo || "",
            invoiceDate: inv.invoiceDate
              ? new Date(inv.invoiceDate).toISOString().split("T")[0]
              : "",
            paymentTerms: inv.paymentTerms || "Due Upon Receipt",
            sections: inv.sections || [],
            vatRate: inv.vatRate ?? 7.5,
            vatAmount: inv.vatAmount || 0,
            subtotal: inv.subtotal || 0,
            totalAmount: inv.totalAmount || 0,
            amountInWords: inv.amountInWords || "",
            paymentDetails: inv.paymentDetails || {
              accountName: "Bogaty Centrum Limited",
              bank: "GTCO",
              accountNumber: "0700573131",
            },
            rcNumber: inv.rcNumber || "1828269",
            fontFamily:
              inv.fontFamily ||
              "'Ebrima', 'Segoe UI', Tahoma, Arial, sans-serif",
            titleColor: inv.titleColor || "#C62828",
            textColor: inv.textColor || "#1A1A1A",
          });
        } else {
          setError("Invoice not found.");
        }
      })
      .catch(() => {
        setError("Failed to load invoice.");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#c4a86b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !token || !invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error || "Not found."}</p>
          <button
            onClick={() => router.push("/admin")}
            className="text-[#c4a86b] text-xs font-bold uppercase tracking-wider hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-[#2a4a2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="text-[#888] hover:text-[#f5f0e8] text-sm font-bold transition-colors"
          >
            ← Back
          </button>
          <span className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest">
            Edit: {invoiceData.invoiceNumber}
          </span>
        </div>
      </header>

      <InvoiceForm
        initialData={invoiceData}
        invoiceId={id}
        token={token}
        onSaved={() => router.push("/admin")}
      />
    </div>
  );
}
