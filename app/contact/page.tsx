"use client";
import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus]   = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd   = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    if (!data.name)    errs.name    = "Name is required.";
    if (!data.email)   errs.email   = "Email is required.";
    if (!data.message) errs.message = "Message is required.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("submitting");

    try {
      const res  = await fetch("/api/contact", {
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
            Contact
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] max-w-4xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Get in Touch.{" "}
            <em className="text-[#c4a86b] not-italic">Let&apos;s Talk.</em>
          </h1>
        </div>
      </section>

      {/* Contact grid */}
      <section className="bg-[#faf7f2] py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          {/* Left — info */}
          <div className="space-y-10">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Office</p>
              <p className="text-sm text-[#6b6b5e] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                1 Creative Quarter, Victoria Island<br />Lagos, Nigeria
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Phone</p>
              <a href="tel:+2348000000000" className="text-sm text-[#1e3323] hover:text-[#c4a86b] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                +234 800 000 0000
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Email</p>
              <a href="mailto:hello@centzmi.com" className="text-sm text-[#1e3323] hover:text-[#c4a86b] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                hello@centzmi.com
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>WhatsApp</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000"}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white bg-[#25D366] px-5 py-2.5 rounded-full hover:bg-[#1da851] transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Business Hours</p>
              <div className="space-y-1 text-sm text-[#6b6b5e]" style={{ fontFamily: "Inter, sans-serif" }}>
                <p>Monday – Friday: 8:00 am – 6:00 pm</p>
                <p>Saturday: 10:00 am – 2:00 pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Follow Us</p>
              <div className="flex gap-3">
                {[{ label: "LinkedIn", abbr: "Li" }, { label: "Instagram", abbr: "Ig" }, { label: "Facebook", abbr: "Fb" }, { label: "X", abbr: "X" }].map((s) => (
                  <a key={s.label} href="#" aria-label={s.label}
                    className="w-10 h-10 rounded-full border border-[#ede7db] flex items-center justify-center text-xs font-medium text-[#6b6b5e] hover:border-[#1e3323] hover:text-[#1e3323] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}>{s.abbr}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="text-3xl font-light text-[#1e3323] mb-8" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Send Us a Message
            </h2>

            {/* Error banner */}
            {status === "error" && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" style={{ fontFamily: "Inter, sans-serif" }}>
                {errorMsg}
              </div>
            )}

            {status === "success" ? (
              <div className="bg-[#f5f0e8] rounded-2xl border border-[#ede7db] p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#1e3323] flex items-center justify-center mx-auto mb-5">
                  <span className="text-[#c4a86b] text-xl">✓</span>
                </div>
                <h3 className="text-2xl font-light text-[#1e3323] mb-3" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  Message Received
                </h3>
                <p className="text-sm text-[#6b6b5e] leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                  We&apos;ll be in touch shortly. Check your inbox — we&apos;ve sent a confirmation to your email.
                </p>
                <Link href="/" className="text-sm text-[#c4a86b] border-b border-[#c4a86b] pb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                  Back to Homepage →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <CF label="Your Name" name="name" required error={errors.name} placeholder="Jane Doe" />
                  <CF label="Email" name="email" type="email" required error={errors.email} placeholder="jane@company.com" />
                </div>
                <CF label="Phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
                <div>
                  <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    Message <span className="text-[#c4a86b]">*</span>
                  </label>
                  <textarea
                    name="message" rows={6} placeholder="How can we help you?"
                    className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] resize-none focus:outline-none focus:ring-2 focus:ring-[#c4a86b] transition-colors placeholder:text-[#6b6b5e]/50 ${errors.message ? "border-red-400" : "border-[#ede7db]"}`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
                </div>
                <button
                  type="submit" id="contact-submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#1e3323] text-[#f5f0e8] text-sm font-semibold py-4 rounded-full hover:bg-[#2d4a2d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {status === "submitting" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps */}
        <a
          href="https://www.google.com/maps/place/Victoria+Island,+Lagos/@6.4281,3.4162,16z"
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-7xl mx-auto mt-16 rounded-2xl overflow-hidden h-72 border border-[#ede7db] relative group cursor-pointer"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.721844234093!2d3.4162!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53aec4dd92d%3A0x4c63c43a634ee5e!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng"
            width="100%" height="100%" style={{ border: 0, pointerEvents: "none" }}
            title="CentzMi office location"
          />
          {/* Overlay to intercept clicks and show subtle interactive hover state */}
          <div className="absolute inset-0 bg-[#1e3323]/0 group-hover:bg-[#1e3323]/5 transition-colors duration-200 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-[#1e3323] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" style={{ fontFamily: "Inter, sans-serif" }}>
              Open in Google Maps ↗
            </span>
          </div>
        </a>
      </section>
    </>
  );
}

function CF({ label, name, type = "text", required, error, placeholder }: {
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
