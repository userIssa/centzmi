"use client";

import React from "react";

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface InvoiceSection {
  title: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountDescription: string;
}

export interface InvoiceData {
  documentType: "invoice" | "quote";
  invoiceNumber: string;
  billedTo: string;
  invoiceDate: string;
  paymentTerms: string;
  sections: InvoiceSection[];
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  totalAmount: number;
  amountInWords: string;
  paymentDetails: {
    accountName: string;
    bank: string;
    accountNumber: string;
  };
  rcNumber: string;
  fontFamily?: string;
  titleColor?: string;
  textColor?: string;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const SECTION_COLORS = ["#C62828", "#1E73BE", "#689F38"];

export default function InvoicePreview({ data }: { data: InvoiceData }) {
  const docLabel = data.documentType === "quote" ? "QUOTATION" : "INVOICE";
  const fontFamily =
    data.fontFamily || "'Ebrima', 'Segoe UI', Tahoma, Arial, sans-serif";
  const titleColor = data.titleColor || "#1A1A1A";
  const textColor = data.textColor || "#1A1A1A";

  // Calculate content density to guarantee 1-page fit
  const totalItems = data.sections.reduce(
    (sum, s) => sum + (s.items?.length || 0),
    0
  );
  const totalSections = data.sections.length;
  const isCompact = totalItems > 4 || totalSections > 1;
  const isVeryCompact = totalItems > 8 || totalSections > 2;
  const isUltraCompact = totalItems > 12 || totalSections > 3;

  const containerPadding = isUltraCompact
    ? "14px 22px 10px"
    : isVeryCompact
    ? "18px 26px 14px"
    : isCompact
    ? "22px 28px 18px"
    : "28px 32px 24px";

  const headerLogoHeight = isUltraCompact ? "38px" : isCompact ? "44px" : "50px";
  const headerTitleSize = isUltraCompact ? "20pt" : isCompact ? "23pt" : "26pt";
  const clientInfoMargin = isUltraCompact ? "10px" : isCompact ? "14px" : "20px";
  const sectionMargin = isUltraCompact ? "8px" : isCompact ? "12px" : "16px";
  const sectionPadding = isUltraCompact ? "4px 8px" : isCompact ? "5px 10px" : "7px 12px";
  const tableCellPadding = isUltraCompact ? "3px 6px" : isCompact ? "5px 8px" : "7px 10px";
  const baseFontSize = isUltraCompact ? "8pt" : isCompact ? "9pt" : "9.5pt";

  return (
    <div
      id="invoice-preview"
      className="invoice-preview-root w-full bg-white shadow-xl rounded-md mx-auto"
      style={{
        ["--invoice-font" as string]: fontFamily,
        ["--invoice-title-color" as string]: titleColor,
        ["--invoice-text-color" as string]: textColor,
        fontFamily: fontFamily,
        color: textColor,
        fontSize: baseFontSize,
        lineHeight: isUltraCompact ? 1.3 : 1.4,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Inner padding container */}
      <div className="invoice-preview-inner" style={{ padding: containerPadding }}>
        {/* ===== HEADER ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: isUltraCompact ? "3px" : "6px",
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/logo.png"
              alt="CentzMi"
              style={{ height: headerLogoHeight, width: "auto", objectFit: "contain" }}
            />
          </div>

          {/* Title + Tagline */}
          <div style={{ textAlign: "right" }}>
            <h1
              className="invoice-main-title"
              style={{
                fontSize: headerTitleSize,
                fontWeight: 700,
                color: titleColor,
                letterSpacing: "3px",
                margin: 0,
                lineHeight: 1.1,
                fontStyle: "italic",
              }}
            >
              {docLabel}
            </h1>
            <p
              style={{
                fontSize: isUltraCompact ? "6.5pt" : "7.5pt",
                color: "#555",
                margin: "2px 0 0",
                fontWeight: 500,
              }}
            >
              A subsidiary of Bogaty Centrum Limited
            </p>
            <p
              style={{
                fontSize: isUltraCompact ? "6pt" : "7pt",
                color: "#888",
                margin: "1px 0 0",
                fontStyle: "italic",
              }}
            >
              Creative Branding · Premium Packaging · Lasting Impressions
            </p>
          </div>
        </div>

        {/* Colored stripe bar */}
        <div
          style={{
            display: "flex",
            height: isUltraCompact ? "3px" : "4px",
            margin: isUltraCompact ? "6px 0 12px" : "8px 0 16px",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, background: "#C62828" }} />
          <div style={{ flex: 1, background: "#F59E0B" }} />
          <div style={{ flex: 1, background: "#689F38" }} />
          <div style={{ flex: 1, background: "#1E73BE" }} />
        </div>

        {/* ===== CLIENT INFO ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: clientInfoMargin,
            gap: "16px",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: isUltraCompact ? "6.5pt" : "7pt",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                margin: "0 0 2px",
              }}
            >
              BILLED TO
            </p>
            <p
              style={{
                fontSize: isUltraCompact ? "9.5pt" : isCompact ? "10pt" : "11pt",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {data.billedTo || "—"}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p
              style={{
                fontSize: isUltraCompact ? "6.5pt" : "7pt",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                margin: "0 0 1px",
              }}
            >
              {docLabel} DATE
            </p>
            <p
              style={{
                fontSize: isUltraCompact ? "8.5pt" : "9.5pt",
                fontWeight: 700,
                margin: isUltraCompact ? "0 0 4px" : "0 0 6px",
              }}
            >
              {formatDate(data.invoiceDate)}
            </p>
            <p
              style={{
                fontSize: isUltraCompact ? "6.5pt" : "7pt",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                margin: "0 0 1px",
              }}
            >
              PAYMENT TERMS
            </p>
            <p style={{ fontSize: isUltraCompact ? "8.5pt" : "9.5pt", fontWeight: 700, margin: 0 }}>
              {data.paymentTerms || "Due Upon Receipt"}
            </p>
          </div>
        </div>

        {/* ===== PROJECT SECTIONS ===== */}
        {data.sections.map((section, idx) => {
          const sectionColor = SECTION_COLORS[idx % SECTION_COLORS.length];
          return (
            <div key={idx} style={{ marginBottom: sectionMargin }}>
              {/* Section header with rotating Red, Blue, Lime */}
              <div
                style={{
                  background: sectionColor,
                  color: "#fff",
                  padding: sectionPadding,
                  fontSize: isUltraCompact ? "8pt" : isCompact ? "8.5pt" : "9pt",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  borderRadius: "3px 3px 0 0",
                }}
              >
                {section.title || `Section ${idx + 1}`}
              </div>

            {/* Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: isUltraCompact ? "8pt" : isCompact ? "8.5pt" : "9pt",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1.5px solid #ddd",
                    textTransform: "uppercase",
                    fontSize: isUltraCompact ? "6.5pt" : "7pt",
                    letterSpacing: "1px",
                    color: "#666",
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      padding: tableCellPadding,
                      width: "36px",
                      fontWeight: 600,
                    }}
                  >
                    S/N
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: tableCellPadding,
                      fontWeight: 600,
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: tableCellPadding,
                      width: isUltraCompact ? "110px" : "130px",
                      fontWeight: 600,
                    }}
                  >
                    Amount (₦)
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((item, iIdx) => (
                  <tr
                    key={iIdx}
                    style={{
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td style={{ padding: tableCellPadding, color: "#555" }}>
                      {iIdx + 1}
                    </td>
                    <td style={{ padding: tableCellPadding }}>{item.description}</td>
                    <td
                      style={{
                        padding: tableCellPadding,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
                {/* Subtotal row */}
                <tr
                  style={{
                    borderTop: "1.5px solid #333",
                    fontWeight: 700,
                  }}
                >
                  <td style={{ padding: tableCellPadding }} />
                  <td style={{ padding: tableCellPadding, fontWeight: 700 }}>
                    {section.title} Subtotal
                  </td>
                  <td
                    style={{
                      padding: tableCellPadding,
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    ₦{formatCurrency(section.subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Discount note */}
            {section.discountAmount > 0 && (
              <p
                style={{
                  fontSize: isUltraCompact ? "6.5pt" : "7pt",
                  color: "#c62828",
                  margin: "3px 0 0 8px",
                  fontStyle: "italic",
                }}
              >
                Discounts Applied:{" "}
                <strong>₦{formatCurrency(section.discountAmount)}</strong>
                {section.discountDescription
                  ? ` (${section.discountDescription})`
                  : ""}
              </p>
            )}
            </div>
          );
        })}

        {/* ===== SUMMARY TABLE ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: isUltraCompact ? "4px" : "8px",
            marginBottom: isUltraCompact ? "6px" : "10px",
          }}
        >
          <table
            style={{
              fontSize: isUltraCompact ? "8pt" : isCompact ? "8.5pt" : "9.5pt",
              minWidth: isUltraCompact ? "280px" : "320px",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {/* Per-section subtotals */}
              {data.sections.map((section, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: isUltraCompact ? "2px 12px 2px 0" : "4px 14px 4px 0",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {section.title} Subtotal
                  </td>
                  <td
                    style={{
                      padding: isUltraCompact ? "2px 0" : "4px 0",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    ₦{formatCurrency(section.subtotal)}
                  </td>
                </tr>
              ))}

              {/* Overall subtotal */}
              <tr style={{ borderTop: "1px solid #ddd" }}>
                <td
                  style={{
                    padding: isUltraCompact ? "4px 12px 3px 0" : "6px 14px 4px 0",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Subtotal
                </td>
                <td
                  style={{
                    padding: isUltraCompact ? "4px 0 3px" : "6px 0 4px",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  ₦{formatCurrency(data.subtotal)}
                </td>
              </tr>

              {/* VAT */}
              {data.vatRate > 0 && (
                <tr>
                  <td
                    style={{
                      padding: isUltraCompact ? "2px 12px 2px 0" : "4px 14px 4px 0",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    VAT @ {data.vatRate}%
                  </td>
                  <td
                    style={{
                      padding: isUltraCompact ? "2px 0" : "4px 0",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    ₦{formatCurrency(data.vatAmount)}
                  </td>
                </tr>
              )}

              {/* Total */}
              <tr>
                <td colSpan={2} style={{ paddingTop: isUltraCompact ? "4px" : "6px" }}>
                  <div
                    style={{
                      background: "#1a1a1a",
                      color: "#fff",
                      padding: isUltraCompact ? "6px 12px" : "8px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: isUltraCompact ? "9.5pt" : isCompact ? "10pt" : "11pt",
                      borderRadius: "3px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <span>TOTAL AMOUNT DUE</span>
                    <span>₦{formatCurrency(data.totalAmount)}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== AMOUNT IN WORDS ===== */}
        <div
          style={{
            textAlign: "center",
            margin: isUltraCompact ? "4px 0 2px" : "8px 0 3px",
          }}
        >
          <p
            style={{
              fontSize: isUltraCompact ? "7pt" : "8pt",
              fontStyle: "italic",
              color: "#444",
              margin: 0,
            }}
          >
            Amount in Words:{" "}
            <em>{data.amountInWords || "—"}</em>
          </p>
          <p
            style={{
              fontSize: isUltraCompact ? "6pt" : "7pt",
              color: "#999",
              margin: isUltraCompact ? "2px 0 0" : "3px 0 0",
              textAlign: "right",
            }}
          >
            RC. {data.rcNumber || "1828269"}
          </p>
        </div>

        {/* ===== PAYMENT DETAILS ===== */}
        {data.documentType === "invoice" && (
          <div
            style={{
              background: "#F8FAFC",
              borderLeft: "4px solid #1E73BE",
              padding: isUltraCompact ? "6px 12px" : "9px 14px",
              margin: isUltraCompact ? "6px 0" : "12px 0",
              maxWidth: isUltraCompact ? "300px" : "340px",
            }}
          >
            <h3
              style={{
                fontSize: isUltraCompact ? "7.5pt" : "8.5pt",
                fontWeight: 700,
                color: "#1E73BE",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                margin: isUltraCompact ? "0 0 3px" : "0 0 5px",
              }}
            >
              PAYMENT DETAILS
            </h3>
            <table style={{ fontSize: isUltraCompact ? "7.5pt" : "8.5pt", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "1px 12px 1px 0",
                      color: "#64748B",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Account Name:
                  </td>
                  <td style={{ fontWeight: 600, color: "#1A1A1A" }}>
                    {data.paymentDetails.accountName}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "1px 12px 1px 0",
                      color: "#64748B",
                    }}
                  >
                    Bank:
                  </td>
                  <td style={{ fontWeight: 600, color: "#1A1A1A" }}>
                    {data.paymentDetails.bank}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "1px 12px 1px 0",
                      color: "#64748B",
                    }}
                  >
                    Account Number:
                  </td>
                  <td style={{ fontWeight: 600, color: "#1A1A1A" }}>
                    {data.paymentDetails.accountNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div
          style={{
            textAlign: "center",
            marginTop: isUltraCompact ? "8px" : "14px",
            paddingTop: isUltraCompact ? "6px" : "10px",
            borderTop: "1px solid #eee",
          }}
        >
          <p
            style={{
              fontSize: isUltraCompact ? "7.5pt" : "8.5pt",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 2px",
            }}
          >
            Thank you for choosing CentzMi.
          </p>
          <p
            style={{
              fontSize: isUltraCompact ? "6pt" : "7pt",
              color: "#888",
              margin: "0 0 3px",
              fontStyle: "italic",
            }}
          >
            Creative Branding · Premium Packaging · Lasting Impressions
          </p>
          <p
            style={{
              fontSize: isUltraCompact ? "6.5pt" : "7.5pt",
              fontWeight: 600,
              color: "#1E73BE",
              letterSpacing: "0.5px",
              margin: 0,
            }}
          >
            www.centzmi.com
          </p>
        </div>
      </div>
    </div>
  );
}
