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
  { label: "Admin", href: "#admin" },
];

export default function Footer() {
  return (
    <footer className="bg-[#243824] text-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-8 lg:pt-20 lg:pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 lg:mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 lg:mb-5">
              <img
                src="/logo.png"
                alt="CentzMi Logo"
                className="h-10 lg:h-12 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p
              className="hidden lg:block text-sm text-[#f5f0e8]/70 leading-relaxed mt-4 font-medium"
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              Creative branding and visual communications — helping businesses
              communicate with clarity, build stronger brands, and create lasting
              impressions.
            </p>
            <div className="flex gap-3.5 mt-4 lg:mt-6">
              {["Li", "Ig", "Fb", "Tw"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-[#f5f0e8]/20 flex items-center justify-center text-xs font-bold text-[#f5f0e8]/70 hover:border-[#c4a86b] hover:text-[#c4a86b] transition-colors"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid on Mobile (2 columns on small screens) */}
          <div className="grid grid-cols-2 col-span-1 md:col-span-1 lg:col-span-2 gap-6 lg:gap-12">
            {/* Solutions */}
            <div>
              <h4
                className="text-[11px] lg:text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-3 lg:mb-5 font-bold"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                SOLUTIONS
              </h4>
              <ul className="space-y-2 lg:space-y-3">
                {footerSolutions.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs lg:text-sm font-medium text-[#f5f0e8]/70 hover:text-[#c4a86b] transition-colors"
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation */}
            <div>
              <h4
                className="text-[11px] lg:text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-3 lg:mb-5 font-bold"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                NAVIGATION
              </h4>
              <ul className="space-y-2 lg:space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs lg:text-sm font-medium text-[#f5f0e8]/70 hover:text-[#c4a86b] transition-colors"
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[11px] lg:text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-3 lg:mb-5 font-bold"
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              GET IN TOUCH
            </h4>
            <ul className="space-y-2.5 lg:space-y-3 text-xs lg:text-sm text-[#f5f0e8]/70 font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              <li>
                <a href="mailto:info@centzmi.com" className="hover:text-[#c4a86b] transition-colors">
                  info@centzmi.com
                </a>
              </li>
              <li>
                <a href="tel:+2348066079075" className="hover:text-[#c4a86b] transition-colors font-bold">
                  +234 (0)806 607 9075
                </a>
              </li>
              <li className="text-[#f5f0e8]/50 text-[11px] lg:text-xs leading-relaxed">
                <span className="font-bold text-[#f5f0e8]/80 block">Bogaty Centrum Limited.</span>
                No. 5 National Supply Road, Trans Amadi Industrial Layout, Port Harcourt, Rivers State
              </li>
              <li className="pt-2">
                <a
                  href="#quote"
                  className="inline-block border border-[#c4a86b] text-[#c4a86b] text-[11px] lg:text-xs font-bold tracking-wider uppercase px-4 py-2 lg:px-5 lg:py-2.5 rounded-full hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all duration-200"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  REQUEST A QUOTE
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#f5f0e8]/10 pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p
            className="text-[10px] lg:text-xs text-[#f5f0e8]/40 font-medium uppercase"
            style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
          >
            © {new Date().getFullYear()} CentzMi. ALL RIGHTS RESERVED.
          </p>
          <p
            className="text-[10px] lg:text-xs text-[#f5f0e8]/40 font-bold uppercase tracking-wider"
            style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
          >
            &quot;EVERY BRAND TELLS A STORY.&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
