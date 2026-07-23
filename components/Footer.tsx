import Link from "next/link";

const footerSolutions = [
  { label: "Brand Identity", href: "#solutions" },
  { label: "Corporate Branding", href: "#solutions" },
  { label: "Packaging Solutions", href: "#solutions" },
  { label: "Signage & Environmental", href: "#solutions" },
  { label: "Marketing & Promotional", href: "#solutions" },
  { label: "Creative Design", href: "#solutions" },
  { label: "Brand Production", href: "#solutions" },
];

const footerLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Process", href: "#process" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Request a Quote", href: "#quote" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1e3323] text-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-bold tracking-widest text-[#f5f0e8] block">
                CENTZMI
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#c4a86b] uppercase mt-0.5 block">
                Creative Branding
              </span>
            </div>
            <p
              className="text-sm text-[#f5f0e8]/65 leading-relaxed mt-4"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Creative branding and visual communications — helping businesses
              communicate with clarity, build stronger brands, and create lasting
              impressions.
            </p>
            <div className="flex gap-4 mt-6">
              {["Li", "Ig", "Fb", "Tw"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full border border-[#f5f0e8]/20 flex items-center justify-center text-xs text-[#f5f0e8]/60 hover:border-[#c4a86b] hover:text-[#c4a86b] transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-5 font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Solutions
            </h4>
            <ul className="space-y-3">
              {footerSolutions.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#f5f0e8]/65 hover:text-[#c4a86b] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-5 font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#f5f0e8]/65 hover:text-[#c4a86b] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-5 font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-[#f5f0e8]/65" style={{ fontFamily: "Inter, sans-serif" }}>
              <li>
                <a href="mailto:hello@centzmi.com" className="hover:text-[#c4a86b] transition-colors">
                  hello@centzmi.com
                </a>
              </li>
              <li>
                <a href="tel:+2348037529545" className="hover:text-[#c4a86b] transition-colors">
                  +234 803 752 9545
                </a>
              </li>
              <li className="text-[#f5f0e8]/50 leading-relaxed">
                Port Harcourt, Rivers, Nigeria
              </li>
              <li className="pt-2">
                <a
                  href="#quote"
                  className="inline-block border border-[#c4a86b] text-[#c4a86b] text-xs tracking-wider uppercase px-5 py-2.5 rounded-full hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all duration-200"
                >
                  Request a Quote
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#f5f0e8]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-[#f5f0e8]/40"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            © {new Date().getFullYear()} CentzMi. All rights reserved.
          </p>
          <p
            className="text-xs text-[#f5f0e8]/30 italic"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            &quot;Every Brand Tells a Story.&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
