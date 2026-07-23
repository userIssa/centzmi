"use client";
import { useState } from "react";
import { solutions } from "@/lib/data";

const budgetRanges = [
  "Under ₦500,000",
  "₦500,000 – ₦1,000,000",
  "₦1,000,000 – ₦5,000,000",
  "₦5,000,000 – ₦10,000,000",
  "Over ₦10,000,000",
  "Prefer not to say",
];

const timelines = [
  "ASAP (under 2 weeks)",
  "2–4 weeks",
  "1–2 months",
  "2–3 months",
  "3+ months",
  "Flexible",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function QuotePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: Record<string, string>) => {
    const errs: Record<string, string> = {};
    if (!data.fullName)    errs.fullName    = "Full name is required.";
    if (!data.company)     errs.company     = "Company name is required.";
    if (!data.email)       errs.email       = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                           errs.email       = "Please enter a valid email.";
    if (!data.phone)       errs.phone       = "Phone number is required.";
    if (!data.service)     errs.service     = "Please select a service.";
    if (!data.description) errs.description = "Please describe your project.";
    if (!data.timeline)    errs.timeline    = "Please select a timeline.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd   = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs = validate(data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/quote", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed.");
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3323] pt-40 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            Get Started
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] max-w-4xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Let&apos;s Build Something{" "}
            <em className="text-[#c4a86b] not-italic">Remarkable.</em>
          </h1>
          <p
            className="text-[#f5f0e8]/60 mt-8 max-w-xl text-base leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Fill in the form below and our team will respond within one business
            day with a tailored proposal.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-[#faf7f2] py-20 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">

          {/* Success */}
          {status === "success" && (
            <div className="text-center py-24 bg-[#f5f0e8] rounded-2xl border border-[#ede7db]">
              <div className="w-16 h-16 rounded-full bg-[#1e3323] flex items-center justify-center mx-auto mb-6">
                <span className="text-[#c4a86b] text-2xl">✓</span>
              </div>
              <h2
                className="text-4xl font-light text-[#1e3323] mb-4"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                Request Received
              </h2>
              <p
                className="text-[#6b6b5e] max-w-sm mx-auto leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
              >
                Thank you for reaching out. A member of the CentzMi team will be
                in touch within one business day.
                <br /><br />
                Check your inbox — we&apos;ve sent a confirmation to your email.
              </p>
            </div>
          )}

          {/* Error banner */}
          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" style={{ fontFamily: "Inter, sans-serif" }}>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          {status !== "success" && (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Full Name" name="fullName" required error={errors.fullName} placeholder="Jane Doe" />
                <Field label="Company Name" name="company" required error={errors.company} placeholder="Acme Corp" />
              </div>

              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Email Address" name="email" type="email" required error={errors.email} placeholder="jane@company.com" />
                <Field label="Phone Number" name="phone" type="tel" required error={errors.phone} placeholder="+234 800 000 0000" />
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Service Required <span className="text-[#c4a86b]">*</span>
                </label>
                <select
                  name="service"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] focus:outline-none focus:ring-2 focus:ring-[#c4a86b] transition-colors ${errors.service ? "border-red-400" : "border-[#ede7db]"}`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a service…</option>
                  {solutions.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1.5">{errors.service}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Project Description <span className="text-[#c4a86b]">*</span>
                </label>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Tell us about your project, brand, and what you're looking to achieve…"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] resize-none focus:outline-none focus:ring-2 focus:ring-[#c4a86b] transition-colors ${errors.description ? "border-red-400" : "border-[#ede7db]"}`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
              </div>

              {/* Row 3 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Estimated Quantity" name="quantity" placeholder="e.g. 500 units, 3 signage panels" />
                <div>
                  <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    Budget Range <span className="text-[#6b6b5e] font-normal">(optional)</span>
                  </label>
                  <select
                    name="budget"
                    className="w-full bg-[#f5f0e8] border border-[#ede7db] rounded-xl px-4 py-3.5 text-sm text-[#1e3323] focus:outline-none focus:ring-2 focus:ring-[#c4a86b] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a range…</option>
                    {budgetRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Preferred Timeline <span className="text-[#c4a86b]">*</span>
                </label>
                <select
                  name="timeline"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] focus:outline-none focus:ring-2 focus:ring-[#c4a86b] transition-colors ${errors.timeline ? "border-red-400" : "border-[#ede7db]"}`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a timeline…</option>
                  {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.timeline && <p className="text-red-500 text-xs mt-1.5">{errors.timeline}</p>}
              </div>

              {/* Reference Files Upload */}
              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Reference Files <span className="text-[#6b6b5e] font-normal">(optional — logos, briefs, mood boards)</span>
                </label>
                <div className="border-2 border-dashed border-[#ede7db] rounded-xl p-8 text-center bg-[#f5f0e8] hover:border-[#c4a86b] transition-colors group">
                  <input
                    type="file"
                    name="files"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.ai,.eps,.zip"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const label = document.getElementById("file-label");
                      if (label && e.target.files?.length) {
                        const fileNames = Array.from(e.target.files).map(f => f.name).join(", ");
                        label.textContent = `${e.target.files.length} file(s) selected: ${fileNames}`;
                      }
                    }}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <span className="text-3xl block mb-2 transition-transform group-hover:scale-110 duration-200">📎</span>
                    <span id="file-label" className="text-sm font-medium text-[#1e3323] block" style={{ fontFamily: "Inter, sans-serif" }}>
                      Click or drag files to upload
                    </span>
                    <span className="block text-xs text-[#6b6b5e]/70 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      PDF, JPG, PNG, AI, EPS, ZIP — max 20MB each
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="submit-quote"
                disabled={status === "submitting"}
                className="w-full bg-[#1e3323] text-[#f5f0e8] text-sm font-semibold py-4 rounded-full hover:bg-[#2d4a2d] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {status === "submitting" ? "Sending…" : "Submit Quote Request"}
              </button>

              <p className="text-center text-xs text-[#6b6b5e]" style={{ fontFamily: "Inter, sans-serif" }}>
                We respond within 1 business day. Your information is kept confidential.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label, name, type = "text", required, error, placeholder,
}: {
  label: string; name: string; type?: string;
  required?: boolean; error?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
        {label} {required && <span className="text-[#c4a86b]">*</span>}
      </label>
      <input
        type={type} name={name} placeholder={placeholder}
        className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] focus:outline-none focus:ring-2 focus:ring-[#c4a86b] transition-colors placeholder:text-[#6b6b5e]/50 ${error ? "border-red-400" : "border-[#ede7db]"}`}
        style={{ fontFamily: "Inter, sans-serif" }}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
