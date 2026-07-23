"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Solutions", href: "#solutions" },
  { label: "Process", href: "#process" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      // Section observer logic
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${sectionId}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileOpen(false);
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-full transition-all duration-300 relative ${
          scrolled || mobileOpen
            ? "bg-[#faf7f2]/90 backdrop-blur-xl border border-[#ede7db] shadow-[0_10px_35px_rgba(0,0,0,0.08)] py-2.5"
            : "bg-[#faf7f2]/75 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)] py-3"
        }`}
      >
        <div className="px-6 lg:px-8 flex items-center justify-between relative z-10">
          {/* Left: Nav Links */}
          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                  activeSection === link.href
                    ? "text-[#c4a86b]"
                    : "text-[#1e3323] hover:text-[#c4a86b]"
                }`}
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Left Brand Name */}
          <div className="flex xl:hidden items-center">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex items-center gap-2 group"
            >
              <svg
                className="w-5 h-5 text-[#1e3323]"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 5 C14 5 14 15 20 20 C14 25 14 35 20 35 C26 35 26 25 20 20 C26 15 26 5 20 5 Z" />
                <path d="M5 20 C5 14 15 14 20 20 C25 14 35 14 35 20 C35 26 25 26 20 20 C15 26 5 26 5 20 Z" />
                <circle cx="20" cy="20" r="2.5" fill="currentColor" />
              </svg>
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase text-[#1e3323]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                CENTZMI
              </span>
            </a>
          </div>

          {/* Desktop Center: Emblem + Brand Name */}
          <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex flex-col items-center group cursor-pointer"
            >
              <svg
                className="w-5 h-5 mb-0.5 text-[#1e3323] transition-transform group-hover:scale-110 duration-300"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 5 C14 5 14 15 20 20 C14 25 14 35 20 35 C26 35 26 25 20 20 C26 15 26 5 20 5 Z" />
                <path d="M5 20 C5 14 15 14 20 20 C25 14 35 14 35 20 C35 26 25 26 20 20 C15 26 5 26 5 20 Z" />
                <circle cx="20" cy="20" r="2.5" fill="currentColor" />
              </svg>
              <span
                className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1e3323]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                CENTZMI
              </span>
            </a>
          </div>

          {/* Right: CTA Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <a
                href="#quote"
                onClick={(e) => handleNavClick(e, "#quote")}
                className="bg-[#1e3323] text-[#f5f0e8] text-xs font-medium px-5 py-2.5 rounded-full hover:bg-[#2d4a2d] transition-all duration-300 tracking-wide shadow-sm block"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Request a Quote
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="xl:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-[#1e3323] transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#1e3323] transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#1e3323] transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="xl:hidden px-6 pb-6 pt-2 border-t border-[#ede7db]/60 mt-2">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium py-1.5 border-b border-[#ede7db]/40 ${
                    activeSection === link.href ? "text-[#c4a86b]" : "text-[#1e3323]"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#quote"
                onClick={(e) => handleNavClick(e, "#quote")}
                className="mt-2 text-center bg-[#1e3323] text-[#f5f0e8] text-sm font-medium px-6 py-2.5 rounded-full shadow-sm block"
              >
                Request a Quote
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
