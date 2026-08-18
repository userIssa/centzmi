"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface InvoiceSummary {
  _id: string;
  documentType: string;
  invoiceNumber: string;
  billedTo: string;
  totalAmount: number;
  status: string;
  invoiceDate: string;
  createdAt: string;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Login state
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Dashboard state
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Check existing session
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
          else localStorage.removeItem("centzmi_admin_token");
        })
        .catch(() => localStorage.removeItem("centzmi_admin_token"))
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setInvoices(data.invoices || []);
    } catch (err) {
      console.error("Fetch invoices error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchInvoices();
  }, [token, fetchInvoices]);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      localStorage.setItem("centzmi_admin_token", data.token);
      setToken(data.token);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Forgot password
  const handleForgot = async () => {
    setForgotLoading(true);
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot" }),
      });
      setForgotSent(true);
    } catch {
      // silent
    } finally {
      setForgotLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    if (token) {
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout", token }),
      });
    }
    localStorage.removeItem("centzmi_admin_token");
    setToken(null);
    setInvoices([]);
  };

  // Delete invoice
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    setDeleteId(id);
    try {
      await fetch(`/api/admin/invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (n: number) =>
    "₦" +
    n.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const statusColor: Record<string, string> = {
    draft: "bg-yellow-500/20 text-yellow-400",
    sent: "bg-blue-500/20 text-blue-400",
    paid: "bg-green-500/20 text-green-400",
  };

  // Loading check
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#c4a86b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ===== LOGIN SCREEN =====
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="CentzMi"
              className="h-14 mx-auto mb-4"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <h1 className="text-2xl font-bold text-[#f5f0e8] mb-1">
              Admin Portal
            </h1>
            <p className="text-sm text-[#6b6b5e]">
              Sign in to manage invoices & quotes
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#888] uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#1a2e1e] border border-[#2a4a2e] rounded-xl px-4 py-3.5 text-[#f5f0e8] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4a86b] focus:border-transparent placeholder:text-[#555] transition-all"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs text-center">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full py-3.5 rounded-xl bg-[#c4a86b] text-[#1e3323] font-bold text-sm uppercase tracking-wider hover:bg-[#d4bc8b] transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center">
              {forgotSent ? (
                <p className="text-green-400 text-xs">
                  Password sent to admin email ✓
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleForgot}
                  disabled={forgotLoading}
                  className="text-[#c4a86b] text-xs hover:underline disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Forgot password?"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-[#2a4a2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="CentzMi"
            className="h-8"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest hidden sm:inline">
            Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/invoices/new"
            className="px-5 py-2.5 rounded-xl bg-[#c4a86b] text-[#1e3323] text-xs font-bold uppercase tracking-wider hover:bg-[#d4bc8b] transition-colors"
          >
            + New Document
          </Link>
          <button
            onClick={handleLogout}
            className="text-[#888] hover:text-[#f5f0e8] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f5f0e8]">
            Invoices & Quotes
          </h2>
          <button
            onClick={fetchInvoices}
            className="text-[#c4a86b] text-xs font-bold uppercase tracking-wider hover:underline"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#c4a86b] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 bg-[#1a2e1e] rounded-xl border border-[#2a4a2e]">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-[#aaa] text-sm mb-4">
              No invoices or quotes yet.
            </p>
            <Link
              href="/admin/invoices/new"
              className="inline-block px-6 py-3 rounded-xl bg-[#c4a86b] text-[#1e3323] text-xs font-bold uppercase tracking-wider hover:bg-[#d4bc8b] transition-colors"
            >
              Create Your First Invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="bg-[#1a2e1e] border border-[#2a4a2e] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3d6040] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#f5f0e8] font-bold text-sm">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        statusColor[inv.status] || statusColor.draft
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2a4a2e] text-[#888]">
                      {inv.documentType}
                    </span>
                  </div>
                  <p className="text-[#aaa] text-xs truncate">
                    {inv.billedTo} · {formatDate(inv.invoiceDate)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#c4a86b] font-bold text-sm whitespace-nowrap">
                    {formatCurrency(inv.totalAmount)}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/invoices/${inv._id}`}
                      className="text-[#c4a86b] hover:text-[#d4bc8b] text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      disabled={deleteId === inv._id}
                      className="text-red-400/60 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-30"
                    >
                      {deleteId === inv._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
