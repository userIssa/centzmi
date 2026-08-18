"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import InvoicePreview, { InvoiceData, InvoiceSection } from "./InvoicePreview";
import { amountToWords } from "@/lib/numberToWords";

interface InvoiceFormProps {
  initialData?: InvoiceData;
  invoiceId?: string;
  token: string;
  onSaved?: () => void;
}

const DEFAULT_PAYMENT = {
  accountName: "Bogaty Centrum Limited",
  bank: "GTCO",
  accountNumber: "0700573131",
};

const DEFAULT_SECTION: InvoiceSection = {
  title: "",
  items: [{ description: "", amount: 0 }],
  subtotal: 0,
  discountAmount: 0,
  discountDescription: "",
};

const FONT_OPTIONS = [
  { label: "Ebrima (Default)", value: "'Ebrima', 'Segoe UI', Tahoma, Arial, sans-serif" },
  { label: "Nexa Bold", value: "'Nexa Bold', 'Nexa', sans-serif" },
  { label: "Inter (Modern Sans)", value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Cormorant (Classic Serif)", value: "'Cormorant Garamond', Georgia, serif" },
  { label: "Arial Clean", value: "Arial, Helvetica, sans-serif" },
];

const TITLE_COLOR_PRESETS = [
  { label: "Solid Black (Default)", value: "#1A1A1A" },
  { label: "CentzMi Red", value: "#C62828" },
  { label: "CentzMi Blue", value: "#1E73BE" },
  { label: "Forest Green", value: "#1E3323" },
  { label: "CentzMi Gold", value: "#C4A86B" },
];

const TEXT_COLOR_PRESETS = [
  { label: "Dark Charcoal (Default)", value: "#1A1A1A" },
  { label: "Deep Slate", value: "#334155" },
  { label: "Dark Green", value: "#1E3323" },
  { label: "Pure Black", value: "#000000" },
];

function emptyInvoiceData(): InvoiceData {
  return {
    documentType: "invoice",
    invoiceNumber: "",
    billedTo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    paymentTerms: "Due Upon Receipt",
    sections: [{ ...DEFAULT_SECTION, items: [{ description: "", amount: 0 }] }],
    vatRate: 7.5,
    vatAmount: 0,
    subtotal: 0,
    totalAmount: 0,
    amountInWords: "",
    paymentDetails: { ...DEFAULT_PAYMENT },
    rcNumber: "1828269",
    fontFamily: "'Ebrima', 'Segoe UI', Tahoma, Arial, sans-serif",
    titleColor: "#1A1A1A",
    textColor: "#1A1A1A",
  };
}

export default function InvoiceForm({
  initialData,
  invoiceId,
  token,
  onSaved,
}: InvoiceFormProps) {
  const [data, setData] = useState<InvoiceData>(
    initialData || emptyInvoiceData()
  );
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const styleMenuRef = useRef<HTMLDivElement>(null);

  // Close Style menu when tapping / clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        styleMenuRef.current &&
        !styleMenuRef.current.contains(event.target as Node)
      ) {
        setShowStyleMenu(false);
      }
    }

    if (showStyleMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showStyleMenu]);

  // ---- Recalculate totals ----
  const recalc = useCallback((d: InvoiceData): InvoiceData => {
    const sections = d.sections.map((s) => {
      const rawSubtotal = s.items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const subtotal = rawSubtotal - (Number(s.discountAmount) || 0);
      return { ...s, subtotal };
    });

    const subtotal = sections.reduce((sum, s) => sum + s.subtotal, 0);
    const vatAmount = Math.round(subtotal * (d.vatRate / 100));
    const totalAmount = subtotal + vatAmount;
    const amountInWords = amountToWords(totalAmount);

    return { ...d, sections, subtotal, vatAmount, totalAmount, amountInWords };
  }, []);

  const update = useCallback(
    (partial: Partial<InvoiceData>) => {
      setData((prev) => recalc({ ...prev, ...partial }));
    },
    [recalc]
  );

  // ---- Section helpers ----
  const updateSection = (idx: number, partial: Partial<InvoiceSection>) => {
    const sections = [...data.sections];
    sections[idx] = { ...sections[idx], ...partial };
    update({ sections });
  };

  const addSection = () => {
    update({
      sections: [
        ...data.sections,
        { ...DEFAULT_SECTION, items: [{ description: "", amount: 0 }] },
      ],
    });
  };

  const removeSection = (idx: number) => {
    if (data.sections.length <= 1) return;
    const sections = data.sections.filter((_, i) => i !== idx);
    update({ sections });
  };

  // ---- Item helpers ----
  const updateItem = (
    sIdx: number,
    iIdx: number,
    field: "description" | "amount",
    value: string | number
  ) => {
    const sections = [...data.sections];
    const items = [...sections[sIdx].items];
    items[iIdx] = { ...items[iIdx], [field]: field === "amount" ? Number(value) || 0 : value };
    sections[sIdx] = { ...sections[sIdx], items };
    update({ sections });
  };

  const addItem = (sIdx: number) => {
    const sections = [...data.sections];
    sections[sIdx] = {
      ...sections[sIdx],
      items: [...sections[sIdx].items, { description: "", amount: 0 }],
    };
    update({ sections });
  };

  const removeItem = (sIdx: number, iIdx: number) => {
    if (data.sections[sIdx].items.length <= 1) return;
    const sections = [...data.sections];
    sections[sIdx] = {
      ...sections[sIdx],
      items: sections[sIdx].items.filter((_, i) => i !== iIdx),
    };
    update({ sections });
  };

  // ---- Save ----
  const handleSave = async (status?: string) => {
    setSaving(true);
    setSaveMsg("");
    try {
      const url = invoiceId
        ? `/api/admin/invoices/${invoiceId}`
        : "/api/admin/invoices";
      const method = invoiceId ? "PUT" : "POST";

      const payload = { ...data };
      if (status) (payload as Record<string, unknown>).status = status;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed.");

      setSaveMsg("Saved successfully!");
      if (onSaved) onSaved();
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Print with guaranteed single-page auto-fit ----
  const handlePrint = () => {
    const prevTitle = document.title;
    const docLabel = data.documentType === "quote" ? "Quote" : "Invoice";
    const clientName = (data.billedTo.trim() || "CentzMi").replace(/[/\\?%*:|"<>]/g, "-");
    const invNum = data.invoiceNumber.trim()
      ? ` - ${data.invoiceNumber.trim().replace(/[/\\?%*:|"<>]/g, "-")}`
      : "";

    // Set page title so browser uses it as default file name when saving to PDF
    document.title = `${clientName} - ${docLabel}${invNum}`;

    // Target the dedicated print preview container to auto-fit
    const printEl = printRef.current?.querySelector("#invoice-preview") as HTMLElement | null;
    if (printEl) {
      printEl.style.transform = "none";
      printEl.style.transformOrigin = "top center";

      // A4 printable height at 96 DPI with margins is ~1040px
      const maxA4HeightPx = 1040;
      const actualHeight = printEl.scrollHeight;

      if (actualHeight > maxA4HeightPx) {
        const scaleRatio = Math.max(0.68, Math.min(0.98, maxA4HeightPx / actualHeight));
        printEl.style.transform = `scale(${scaleRatio})`;
        printEl.style.transformOrigin = "top center";
      }
    }

    window.print();

    // Restore title and print styles after print dialog closes
    setTimeout(() => {
      document.title = prevTitle;
      if (printEl) {
        printEl.style.transform = "none";
      }
    }, 1500);
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <div className="admin-form-wrapper flex flex-col xl:flex-row gap-6 p-4 sm:p-6">
        {/* ===== LEFT: FORM ===== */}
        <div className="flex-1 min-w-0 max-w-2xl">
          {/* Top Bar with Style Trigger Button */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest">
              Document Builder
            </span>

            {/* Style Button matching user reference */}
            <div className="relative" ref={styleMenuRef}>
              <button
                type="button"
                onClick={() => setShowStyleMenu(!showStyleMenu)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all shadow-sm ${
                  showStyleMenu
                    ? "bg-[#2a4a2e] border-[#c62828] text-white ring-2 ring-[#c62828]/40"
                    : "bg-[#142618] border-[#2a4a2e] text-[#c62828] hover:border-[#c62828] hover:bg-[#1a2e1e]"
                }`}
                title="Customize Document Font & Colors"
              >
                {/* Painter's Palette SVG Icon */}
                <svg
                  className="w-4 h-4 text-[#c62828]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r=".8" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".8" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".8" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".8" fill="currentColor" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
                <span className="font-bold text-sm text-[#c62828]">Style</span>
                <span className="text-[10px] text-[#888]">{showStyleMenu ? "▲" : "▼"}</span>
              </button>

              {/* Style Dropdown Popover */}
              {showStyleMenu && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0f1d13] border border-[#2a4a2e] rounded-2xl p-4 shadow-2xl z-30 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2a4a2e]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎨</span>
                      <span className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest">
                        Document Styling
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          fontFamily: "'Ebrima', 'Segoe UI', Tahoma, Arial, sans-serif",
                          titleColor: "#1A1A1A",
                          textColor: "#1A1A1A",
                        })
                      }
                      className="text-[#888] hover:text-[#c4a86b] text-[11px] font-semibold transition-colors"
                      title="Reset font and colors to default"
                    >
                      ↺ Reset
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {/* Font Selector */}
                    <div>
                      <label className="form-label text-[10px]">Font Family</label>
                      <select
                        value={data.fontFamily || FONT_OPTIONS[0].value}
                        onChange={(e) => update({ fontFamily: e.target.value })}
                        className="form-input text-xs"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title Color */}
                    <div>
                      <label className="form-label text-[10px]">Document Title Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={data.titleColor || "#1A1A1A"}
                          onChange={(e) => update({ titleColor: e.target.value })}
                          className="w-7 h-7 rounded-md cursor-pointer bg-transparent border border-[#2a4a2e] p-0.5 shrink-0"
                          title="Custom title color"
                        />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {TITLE_COLOR_PRESETS.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => update({ titleColor: p.value })}
                              className={`w-4 h-4 rounded-full border transition-transform ${
                                data.titleColor === p.value
                                  ? "scale-125 border-white ring-1 ring-[#c4a86b]"
                                  : "border-black/40 hover:scale-110"
                              }`}
                              style={{ background: p.value }}
                              title={p.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Body Text Color */}
                    <div>
                      <label className="form-label text-[10px]">Body Text Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={data.textColor || "#1A1A1A"}
                          onChange={(e) => update({ textColor: e.target.value })}
                          className="w-7 h-7 rounded-md cursor-pointer bg-transparent border border-[#2a4a2e] p-0.5 shrink-0"
                          title="Custom text color"
                        />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {TEXT_COLOR_PRESETS.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => update({ textColor: p.value })}
                              className={`w-4 h-4 rounded-full border transition-transform ${
                                data.textColor === p.value
                                  ? "scale-125 border-white ring-1 ring-[#c4a86b]"
                                  : "border-black/40 hover:scale-110"
                              }`}
                              style={{ background: p.value }}
                              title={p.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Type & Invoice Number */}
          <div className="bg-[#1a2e1e] rounded-xl p-5 mb-5 border border-[#2a4a2e]">
            <h2 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest mb-4">
              Document Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Type</label>
                <select
                  value={data.documentType}
                  onChange={(e) =>
                    update({
                      documentType: e.target.value as "invoice" | "quote",
                    })
                  }
                  className="form-input"
                >
                  <option value="invoice">Invoice</option>
                  <option value="quote">Quotation</option>
                </select>
              </div>
              <div>
                <label className="form-label">
                  {data.documentType === "quote" ? "Quote" : "Invoice"} #
                </label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => update({ invoiceNumber: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={data.invoiceDate}
                  onChange={(e) => update({ invoiceDate: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-[#1a2e1e] rounded-xl p-5 mb-5 border border-[#2a4a2e]">
            <h2 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest mb-4">
              Client Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Billed To</label>
                <input
                  type="text"
                  value={data.billedTo}
                  onChange={(e) => update({ billedTo: e.target.value })}
                  placeholder="Client / Company name"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Payment Terms</label>
                <input
                  type="text"
                  value={data.paymentTerms}
                  onChange={(e) => update({ paymentTerms: e.target.value })}
                  placeholder="Due Upon Receipt"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* ===== SECTIONS ===== */}
          {data.sections.map((section, sIdx) => {
            const sectionColors = ["#C62828", "#1E73BE", "#689F38"];
            const sectionColorNames = ["Red", "Blue", "Lime"];
            const currentColor = sectionColors[sIdx % sectionColors.length];
            const currentName = sectionColorNames[sIdx % sectionColorNames.length];

            return (
              <div
                key={sIdx}
                className="bg-[#1a2e1e] rounded-xl p-5 mb-5 border border-[#2a4a2e] relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                      style={{ background: currentColor }}
                      title={`${currentName} Header`}
                    />
                    <h2 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest">
                      Project Section {sIdx + 1}
                      <span className="text-[#888] font-normal normal-case ml-2 text-[11px]">
                        ({currentName} theme)
                      </span>
                    </h2>
                  </div>
                  {data.sections.length > 1 && (
                    <button
                      onClick={() => removeSection(sIdx)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                {/* Section title */}
                <div className="mb-4">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateSection(sIdx, { title: e.target.value })
                    }
                    placeholder="e.g. Kha-Riz, B-Project Ventures"
                    className="form-input"
                  />
                </div>

              {/* Line items */}
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-[1fr_120px_36px] gap-2 text-[10px] text-[#888] uppercase tracking-widest font-bold px-1">
                  <span>Description</span>
                  <span className="text-right">Amount (₦)</span>
                  <span />
                </div>

                {section.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="grid grid-cols-[1fr_120px_36px] gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(sIdx, iIdx, "description", e.target.value)
                      }
                      placeholder="Service description..."
                      className="form-input text-sm"
                    />
                    <input
                      type="number"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updateItem(sIdx, iIdx, "amount", e.target.value)
                      }
                      placeholder="0"
                      className="form-input text-sm text-right"
                    />
                    <button
                      onClick={() => removeItem(sIdx, iIdx)}
                      className="text-red-400/60 hover:text-red-300 text-lg leading-none transition-colors disabled:opacity-20"
                      disabled={section.items.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addItem(sIdx)}
                className="text-[#c4a86b] hover:text-[#d4bc8b] text-xs font-bold uppercase tracking-wider transition-colors mb-4"
              >
                + Add Line Item
              </button>

              {/* Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#2a4a2e]">
                <div>
                  <label className="form-label">Discount Amount (₦)</label>
                  <input
                    type="number"
                    value={section.discountAmount || ""}
                    onChange={(e) =>
                      updateSection(sIdx, {
                        discountAmount: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Discount Description</label>
                  <input
                    type="text"
                    value={section.discountDescription}
                    onChange={(e) =>
                      updateSection(sIdx, {
                        discountDescription: e.target.value,
                      })
                    }
                    placeholder="e.g. ₦50,000 hosting discount + ..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* Section subtotal */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#2a4a2e]">
                <span className="text-sm text-[#aaa]">Section Subtotal</span>
                <span className="text-lg font-bold text-[#f5f0e8]">
                  ₦{formatCurrency(section.subtotal)}
                </span>
              </div>
            </div>
            );
          })}

          <button
            onClick={addSection}
            className="w-full py-3 rounded-xl border-2 border-dashed border-[#2a4a2e] text-[#c4a86b] hover:border-[#c4a86b] hover:bg-[#1a2e1e] text-sm font-bold uppercase tracking-wider transition-all mb-5"
          >
            + Add Project Section
          </button>

          {/* VAT & Payment Details */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
            {/* VAT */}
            <div className="bg-[#1a2e1e] rounded-xl p-5 border border-[#2a4a2e]">
              <h2 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest mb-4">
                Tax
              </h2>
              <div>
                <label className="form-label">VAT Rate (%)</label>
                <input
                  type="number"
                  value={data.vatRate}
                  onChange={(e) =>
                    update({ vatRate: Number(e.target.value) || 0 })
                  }
                  step="0.5"
                  className="form-input"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#1a2e1e] rounded-xl p-5 border border-[#2a4a2e]">
              <h2 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest mb-4">
                Payment Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="form-label">Account Name</label>
                  <input
                    type="text"
                    value={data.paymentDetails.accountName}
                    onChange={(e) =>
                      update({
                        paymentDetails: {
                          ...data.paymentDetails,
                          accountName: e.target.value,
                        },
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Bank</label>
                  <input
                    type="text"
                    value={data.paymentDetails.bank}
                    onChange={(e) =>
                      update({
                        paymentDetails: {
                          ...data.paymentDetails,
                          bank: e.target.value,
                        },
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    value={data.paymentDetails.accountNumber}
                    onChange={(e) =>
                      update({
                        paymentDetails: {
                          ...data.paymentDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RC Number */}
          <div className="bg-[#1a2e1e] rounded-xl p-5 mb-5 border border-[#2a4a2e]">
            <h2 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest mb-4">
              Company Details
            </h2>
            <div>
              <label className="form-label">RC Number</label>
              <input
                type="text"
                value={data.rcNumber}
                onChange={(e) => update({ rcNumber: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* ===== TOTALS SUMMARY ===== */}
          <div className="bg-[#1a2e1e] rounded-xl p-5 mb-5 border border-[#c4a86b]/30">
            <div className="space-y-2 text-sm">
              {data.sections.map((s, i) => (
                <div key={i} className="flex justify-between text-[#aaa]">
                  <span>{s.title || `Section ${i + 1}`} Subtotal</span>
                  <span>₦{formatCurrency(s.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#f5f0e8] font-bold border-t border-[#2a4a2e] pt-2">
                <span>Subtotal</span>
                <span>₦{formatCurrency(data.subtotal)}</span>
              </div>
              {data.vatRate > 0 && (
                <div className="flex justify-between text-[#aaa]">
                  <span>VAT @ {data.vatRate}%</span>
                  <span>₦{formatCurrency(data.vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#c4a86b] font-bold text-lg border-t border-[#c4a86b]/30 pt-3 mt-2">
                <span>TOTAL AMOUNT DUE</span>
                <span>₦{formatCurrency(data.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex-1 min-w-[140px] py-3 rounded-xl bg-[#2a4a2e] text-[#f5f0e8] font-bold text-sm uppercase tracking-wider hover:bg-[#3d6040] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave("sent")}
              disabled={saving}
              className="flex-1 min-w-[140px] py-3 rounded-xl bg-[#c4a86b] text-[#1e3323] font-bold text-sm uppercase tracking-wider hover:bg-[#d4bc8b] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Finalise"}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 min-w-[140px] py-3 rounded-xl bg-[#c62828] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#d32f2f] transition-colors"
            >
              📄 Download PDF
            </button>
          </div>

          {saveMsg && (
            <p
              className={`text-sm text-center mb-4 ${
                saveMsg.includes("success") ? "text-green-400" : "text-red-400"
              }`}
            >
              {saveMsg}
            </p>
          )}
        </div>

        {/* ===== RIGHT: LIVE PREVIEW (desktop) ===== */}
        <div className="hidden xl:block flex-1 min-w-[440px] max-w-[660px]">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span>Live Preview</span>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </h3>
              <span className="text-[10px] text-[#888] bg-[#1a2e1e] border border-[#2a4a2e] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                {data.documentType === "quote" ? "Quotation" : "Invoice"}
              </span>
            </div>
            <div className="bg-[#0b140e] p-3 sm:p-4 rounded-2xl border border-[#2a4a2e] shadow-2xl max-h-[calc(100vh-90px)] overflow-y-auto">
              <InvoicePreview data={data} />
            </div>
          </div>
        </div>

        {/* Mobile preview toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="fixed bottom-6 right-6 xl:hidden z-40 w-14 h-14 rounded-full bg-[#c4a86b] text-[#1e3323] shadow-lg flex items-center justify-center text-xl font-bold hover:bg-[#d4bc8b] transition-colors"
        >
          {showPreview ? "✕" : "👁"}
        </button>
      </div>

      {/* ===== MOBILE PREVIEW OVERLAY ===== */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/85 z-50 xl:hidden overflow-y-auto p-4 print:hidden">
          <div className="max-w-2xl mx-auto py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#c4a86b] text-xs font-bold uppercase tracking-widest">
                Document Preview
              </span>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-[#1a2e1e] text-[#f5f0e8] hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2a4a2e]"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <InvoicePreview data={data} />
            </div>
          </div>
        </div>
      )}

      {/* ===== PRINT-ONLY PREVIEW ===== */}
      <div className="print-only" ref={printRef}>
        <InvoicePreview data={data} />
      </div>
    </>
  );
}
