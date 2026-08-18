"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InvoiceForm from "@/components/admin/InvoiceForm";

export default function NewInvoicePage() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("centzmi_admin_token");
    if (stored) {
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", token: stored }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) setToken(stored);
          else router.push("/admin");
        })
        .catch(() => router.push("/admin"))
        .finally(() => setChecking(false));
    } else {
      router.push("/admin");
    }
  }, [router]);

  if (checking || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#c4a86b] border-t-transparent rounded-full animate-spin" />
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
            New Invoice / Quote
          </span>
        </div>
      </header>

      <InvoiceForm
        token={token}
        onSaved={() => router.push("/admin")}
      />
    </div>
  );
}
