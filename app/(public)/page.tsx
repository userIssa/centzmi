"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import RecaptchaWidget from "@/components/RecaptchaWidget";
import {
  solutions,
  industries,
  whyChoose,
  processSteps,
  portfolioItems,
  portfolioCategories,
  type PortfolioCategory,
} from "@/lib/data";

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

const coreValues = [
  { letter: "C", title: "Creativity", desc: "We transform ideas into compelling brand experiences." },
  { letter: "R", title: "Reliability", desc: "We deliver consistently on our promises." },
  { letter: "E", title: "Excellence", desc: "We pursue the highest standards in every project." },
  { letter: "A", title: "Accountability", desc: "We take ownership from concept to completion." },
  { letter: "T", title: "Teamwork", desc: "We collaborate to achieve exceptional outcomes." },
  { letter: "E", title: "Evolution", desc: "We continuously innovate and improve." },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function SinglePageHome() {
  // Portfolio filter & modal state
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("All");
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof portfolioItems)[0] | null>(null);

  // Pricing tab state (for mobile view toggle)
  const [pricingTab, setPricingTab] = useState<"corporate" | "individual">("corporate");

  // Quote form state
  const [quoteStatus, setQuoteStatus] = useState<FormStatus>("idle");
  const [quoteError, setQuoteError] = useState("");
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});

  // Contact form state
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [contactError, setContactError] = useState("");
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactRecaptchaToken, setContactRecaptchaToken] = useState("");

  // Filtered & sliced portfolio lists
  const filteredPortfolio =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  // Initial 2 rows = 8 items (in 4-column grid), expand to all when toggled
  const visiblePortfolio = isPortfolioExpanded
    ? filteredPortfolio
    : filteredPortfolio.slice(0, 8);

  // Keyboard navigation for modal preview
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = filteredPortfolio.findIndex((p) => p.id === selectedProject.id);
      if (currentIndex === -1) return;

      if (e.key === "ArrowLeft") {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPortfolio.length - 1;
        setSelectedProject(filteredPortfolio[prevIndex]);
      } else if (e.key === "ArrowRight") {
        const nextIndex = currentIndex < filteredPortfolio.length - 1 ? currentIndex + 1 : 0;
        setSelectedProject(filteredPortfolio[nextIndex]);
      } else if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, filteredPortfolio]);

  // Quote form handler
  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    if (!data.fullName) errs.fullName = "Full name is required.";
    if (!data.company) errs.company = "Company name is required.";
    if (!data.email) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Please enter a valid email.";
    if (!data.phone) errs.phone = "Phone number is required.";
    if (!data.service) errs.service = "Please select a service.";
    if (!data.description) errs.description = "Please describe your project.";
    if (!data.timeline) errs.timeline = "Please select a timeline.";

    if (Object.keys(errs).length > 0) {
      setQuoteErrors(errs);
      return;
    }
    setQuoteErrors({});
    setQuoteStatus("submitting");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed.");
      setQuoteStatus("success");
    } catch (err: unknown) {
      setQuoteError(err instanceof Error ? err.message : "Something went wrong.");
      setQuoteStatus("error");
    }
  };

  // Contact form handler
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
    if (fullName) data.name = fullName;

    const errs: Record<string, string> = {};
    if (!data.name && !data.firstName) errs.name = "First name is required.";
    if (!data.email) errs.email = "Email is required.";
    if (!data.message) errs.message = "Message is required.";

    if (Object.keys(errs).length > 0) {
      setContactErrors(errs);
      return;
    }
    setContactErrors({});
    setContactStatus("submitting");

    try {
      if (contactRecaptchaToken) {
        data.recaptchaToken = contactRecaptchaToken;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed.");
      setContactStatus("success");
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : "Something went wrong.");
      setContactStatus("error");
    }
  };

  return (
    <>
      {/* ===== 1. HERO SECTION ===== */}
      <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden bg-[#e8ded1] pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=85"
            alt="CentzMi Creative Studio"
            fill
            className="object-cover object-center opacity-40 mix-blend-multiply"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8ded1]/80 via-transparent to-[#e8ded1]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32 lg:py-44 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            <div className="lg:col-span-7">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.8rem] font-bold text-[#1e3323] uppercase leading-[0.92] tracking-tight"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                CREATIVE <br />
                BRANDING <br />
              </h1>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:pl-8">
              <p
                className="text-base sm:text-lg lg:text-xl text-[#1e3323]/85 font-medium leading-relaxed mb-8 max-w-md"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                Welcome to CentzMi, a creative studio for brand identity, premium packaging, and visual communications built for lasting impressions.
              </p>

              <a
                href="#quote"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#1e3323] text-[#f5f0e8] text-xs font-bold uppercase tracking-wider hover:bg-[#2d4a2d] transition-all duration-300 shadow-md"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                Start Your Project
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. ABOUT SECTION ===== */}
      <section id="about" className="bg-[#f5f0e8] py-28 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                WHO WE ARE
              </p>
              <h2
                className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase leading-tight mb-8 tracking-tight"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                MORE THAN DESIGN. <br />
                <span className="text-[#c4a86b]">MORE THAN PRODUCTION.</span>
              </h2>
              <p className="text-[#6b6b5e] leading-relaxed mb-6 text-base" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                CentzMi is a creative branding and visual communications company helping businesses communicate with clarity, build stronger brands, and create lasting impressions. We combine strategic thinking with exceptional craft — across every medium, every scale, every industry.
              </p>
              <p className="text-[#6b6b5e] leading-relaxed mb-8 text-base font-semibold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                &quot;EVERY BRAND TELLS A STORY.&quot; WE MAKE SURE YOURS IS ONE WORTH REMEMBERING.
              </p>
            </div>

            <div className="space-y-6">
              {/* Mission Card */}
              <div className="group relative bg-[#1e3323] border border-[#c4a86b]/20 rounded-2xl p-8 lg:p-10 text-[#f5f0e8] shadow-lg hover:border-[#c4a86b]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c4a86b]"></span>
                  <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-[0.15em] text-[#c4a86b]" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                    Our Mission
                  </h3>
                </div>
                <p 
                  className="text-base lg:text-lg font-light text-[#f5f0e8]/90 leading-relaxed border-l-2 border-[#c4a86b] pl-5" 
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
                >
                  To deliver innovative branding and visual communication solutions that empower businesses to communicate with confidence, strengthen their identity, and compete successfully.
                </p>
              </div>

              {/* Vision Card */}
              <div className="group relative bg-[#ede7db] border border-[#c4a86b]/30 rounded-2xl p-8 lg:p-10 text-[#1e3323] shadow-md hover:border-[#c4a86b]/60 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c4a86b]"></span>
                  <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-[0.15em] text-[#c4a86b]" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                    Our Vision
                  </h3>
                </div>
                <p 
                  className="text-base lg:text-lg font-light text-[#1e3323]/90 leading-relaxed border-l-2 border-[#c4a86b] pl-5" 
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
                >
                  To become Africa&apos;s preferred creative branding and visual communications company, recognised for innovation, quality, creativity, and exceptional service.
                </p>
              </div>
            </div>
          </div>

          {/* CREATE Core Values */}
          <div className="pt-12 border-t border-[#ede7db]">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-3 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                CORE VALUES
              </p>
              <h3 className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                CREATE
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((val) => (
                <div key={val.title} className="group bg-[#faf7f2] border border-[#ede7db] rounded-xl p-8 hover:bg-[#1e3323] transition-all duration-300">
                  <span className="text-5xl font-bold text-[#c4a86b] block mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {val.letter}
                  </span>
                  <h4 className="text-xl font-bold text-[#1e3323] group-hover:text-[#f5f0e8] mb-2 uppercase tracking-wide transition-colors" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {val.title}
                  </h4>
                  <p className="text-sm text-[#6b6b5e] group-hover:text-[#f5f0e8]/70 leading-relaxed transition-colors" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. SOLUTIONS SECTION ===== */}
      <section id="solutions" className="bg-[#faf7f2] py-28 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              WHAT WE DO
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              SEVEN SPECIALISMS. <br />
              <span className="text-[#c4a86b]">ONE INTEGRATED PARTNER.</span>
            </h2>
          </div>

          <div className="space-y-8">
            {solutions.map((sol, i) => (
              <div key={sol.id} className="grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-[#ede7db] group">
                <div className="lg:col-span-2 bg-[#1e3323] p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-4xl mb-6 block">{sol.icon}</span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#f5f0e8] uppercase mb-3 tracking-wide" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      {sol.title}
                    </h3>
                    <p className="text-xs text-[#c4a86b] font-semibold uppercase tracking-wider" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      {sol.tagline}
                    </p>
                  </div>
                  <a
                    href="#quote"
                    className="mt-8 inline-block text-xs tracking-wider uppercase font-bold border border-[#c4a86b]/40 text-[#c4a86b] px-5 py-2.5 rounded-full hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all duration-200 self-start"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    GET A QUOTE →
                  </a>
                </div>

                <div className="lg:col-span-3 bg-[#f5f0e8] p-10">
                  <p className="text-[#6b6b5e] leading-relaxed mb-8 text-sm font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {sol.description}
                  </p>
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      INCLUDED SERVICES
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {sol.subServices.map((sub) => (
                        <li key={sub} className="flex items-center gap-2 text-xs font-semibold text-[#1e3323] uppercase" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c4a86b] flex-shrink-0" />
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Industries strip */}
          <div className="mt-24 pt-16 border-t border-[#ede7db] text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              INDUSTRIES WE SERVE
            </p>
            <h3 className="text-3xl lg:text-5xl font-bold text-[#1e3323] uppercase mb-12 tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              TRUSTED ACROSS EVERY SECTOR
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {industries.map((ind) => (
                <div key={ind} className="bg-[#f5f0e8] border border-[#ede7db] rounded-lg px-4 py-3 text-center text-xs font-bold uppercase text-[#1e3323] hover:bg-[#1e3323] hover:text-[#f5f0e8] transition-colors cursor-default" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  {ind}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. PROCESS SECTION ===== */}
      <section id="process" className="bg-[#1e3323] py-28 px-6 lg:px-10 scroll-mt-12 text-[#f5f0e8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              HOW WE WORK
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              A 5-STEP PROCESS FOR <br />
              <span className="text-[#c4a86b]">EXCEPTIONAL DELIVERY.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <div key={step.step} className="bg-[#faf7f2] border border-[#ede7db] rounded-xl p-8 flex flex-col justify-between hover:border-[#c4a86b] transition-all duration-300 shadow-md">
                <div>
                  <span className="text-4xl font-bold text-[#c4a86b] block mb-4" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold uppercase mb-3 text-[#1e3323] tracking-wide" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6b6b5e] leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. PORTFOLIO SECTION (WITH MODAL PREVIEW & NAV BUTTONS) ===== */}
      <section id="portfolio" className="bg-[#faf7f2] pt-20 pb-8 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-3 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              OUR WORK
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              PROJECTS THAT SPEAK FOR THEMSELVES.
            </h2>
          </div>

          {/* Filter Pills — Horizontal swipe on mobile, wrapped flex on desktop */}
          <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none gap-2 pb-2 mb-8 md:flex-wrap md:justify-center md:pb-0 -mx-6 px-6 md:mx-0">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setIsPortfolioExpanded(false);
                }}
                className={`shrink-0 text-xs font-bold uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-200 ${activeCategory === cat
                  ? "bg-[#1e3323] border-[#3d6040] text-[#f5f0e8] shadow-sm"
                  : "bg-transparent border-[#ede7db] text-[#6b6b5e] hover:border-[#3d6040] hover:text-[#1e3323]"
                  }`}
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {visiblePortfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProject(item)}
                className="group relative overflow-hidden rounded-xl bg-[#f5f0e8] border border-[#ede7db] cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3323]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-[#f5f0e8] text-xs sm:text-sm font-bold uppercase truncate" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      {item.title}
                    </p>
                    <p className="text-[#c4a86b] text-[10px] sm:text-xs font-bold uppercase mt-0.5" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      VIEW PROJECT →
                    </p>
                  </div>
                </div>
                <div className="p-2.5 sm:p-4">
                  <p className="text-[9px] sm:text-[10px] text-[#c4a86b] font-bold tracking-wider uppercase mb-0.5 sm:mb-1 truncate" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {item.category}
                  </p>
                  <p className="text-xs sm:text-sm text-[#1e3323] font-bold uppercase leading-snug line-clamp-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View More / Expand Button */}
          {filteredPortfolio.length > 8 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setIsPortfolioExpanded((prev) => !prev)}
                className="inline-flex items-center gap-2 bg-[#1e3323] text-[#f5f0e8] text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-[#2d4a2d] transition-all duration-300 shadow-md"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                {isPortfolioExpanded
                  ? "SHOW LESS ↑"
                  : `VIEW MORE WORK (${filteredPortfolio.length - 8} MORE) ↓`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* PORTFOLIO MODAL PREVIEW WITH PREV / NEXT NAVIGATION */}
      {selectedProject && (() => {
        const currentIndex = filteredPortfolio.findIndex((p) => p.id === selectedProject.id);

        const handlePrev = (e?: React.MouseEvent) => {
          e?.stopPropagation();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPortfolio.length - 1;
          setSelectedProject(filteredPortfolio[prevIndex]);
        };

        const handleNext = (e?: React.MouseEvent) => {
          e?.stopPropagation();
          const nextIndex = currentIndex < filteredPortfolio.length - 1 ? currentIndex + 1 : 0;
          setSelectedProject(filteredPortfolio[nextIndex]);
        };

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="relative bg-[#faf7f2] rounded-2xl max-w-3xl w-full overflow-hidden border border-[#ede7db] shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[#ede7db] bg-[#f5f0e8]/80">
                <span className="text-xs text-[#6b6b5e] font-bold uppercase tracking-wider" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  PROJECT {currentIndex + 1} OF {filteredPortfolio.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full bg-[#1e3323]/10 text-[#1e3323] hover:bg-[#1e3323] hover:text-[#f5f0e8] flex items-center justify-center text-sm transition-colors"
                    title="Previous Project (Left Arrow)"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-[#1e3323]/10 text-[#1e3323] hover:bg-[#1e3323] hover:text-[#f5f0e8] flex items-center justify-center text-sm transition-colors"
                    title="Next Project (Right Arrow)"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-8 h-8 rounded-full bg-[#1e3323] text-[#f5f0e8] flex items-center justify-center text-xs hover:bg-[#2d4a2d] transition-colors ml-2"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Image Container with Floating Prev/Next Arrows */}
              <div className="relative aspect-[16/9] w-full bg-[#1e3323] group">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />

                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center text-xl hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all shadow-lg"
                  aria-label="Previous project"
                >
                  ‹
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center text-xl hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all shadow-lg"
                  aria-label="Next project"
                >
                  ›
                </button>
              </div>

              {/* Content Footer */}
              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {selectedProject.category} · CLIENT: {selectedProject.client}
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase text-[#1e3323] mb-4 tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  {selectedProject.title}
                </h3>

                <p className="text-sm text-[#6b6b5e] leading-relaxed mb-6 font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Comprehensive branding execution delivered for {selectedProject.client}. Designed and produced to exact specification to establish visual authority and lasting market impact.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ede7db]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ede7db] text-xs font-bold uppercase text-[#1e3323] hover:border-[#3d6040] transition-colors"
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    >
                      ← PREVIOUS
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ede7db] text-xs font-bold uppercase text-[#1e3323] hover:border-[#3d6040] transition-colors"
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    >
                      NEXT →
                    </button>
                  </div>

                  <a
                    href="#quote"
                    onClick={() => setSelectedProject(null)}
                    className="bg-[#1e3323] text-[#f5f0e8] text-xs font-bold uppercase px-6 py-2.5 rounded-full hover:bg-[#2d4a2d] transition-colors shadow-sm"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    REQUEST SIMILAR PROJECT
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== 6. PRICING GUIDE SECTION ===== */}
      <section id="pricing" className="bg-[#f5f0e8] py-24 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold"
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              TRANSPARENT PRICING
            </p>
            <h2
              className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase tracking-tight"
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              WEBSITE DEVELOPMENT <span className="text-[#c4a86b]">PRICING GUIDE.</span>
            </h2>
            <p
              className="text-sm lg:text-base text-[#6b6b5e] mt-4 font-medium leading-relaxed"
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              Standard baseline pricing tiers for a full informational website build — covering web development, responsive layout, UI/UX design, contact form integration, and content placement. <span className="text-[#1e3323] font-bold block sm:inline mt-1 sm:mt-0">*Terms & Conditions Apply.</span>
            </p>
          </div>

          {/* Mobile Tab Toggle (< lg) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6 p-1.5 bg-[#faf7f2] border border-[#ede7db] rounded-full max-w-sm mx-auto shadow-sm">
            <button
              onClick={() => {
                setPricingTab("corporate");
                document.getElementById("card-corporate")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-full transition-all duration-300 ${
                pricingTab === "corporate"
                  ? "bg-[#1e3323] text-[#f5f0e8] shadow-md"
                  : "text-[#6b6b5e] hover:text-[#1e3323]"
              }`}
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              Corporate (₦750k)
            </button>
            <button
              onClick={() => {
                setPricingTab("individual");
                document.getElementById("card-individual")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-full transition-all duration-300 ${
                pricingTab === "individual"
                  ? "bg-[#1e3323] text-[#f5f0e8] shadow-md"
                  : "text-[#6b6b5e] hover:text-[#1e3323]"
              }`}
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              Personal (₦500k)
            </button>
          </div>

          {/* Pricing Tiers — Mobile Horizontal Swipe Slider (< lg) */}
          <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 mb-4 -mx-6 px-6">
            {/* 1. Corporate / Company Client Rate (FIRST) */}
            <div
              id="card-corporate"
              className="w-full shrink-0 snap-center bg-[#1e3323] text-[#f5f0e8] border border-[#c4a86b]/40 rounded-3xl p-7 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#c4a86b]" />
              <div>
                <div className="flex items-center justify-between gap-4 mb-4 pt-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full bg-[#c4a86b] text-[#1e3323]"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    CORPORATE / COMPANY
                  </span>
                  <span className="text-xs text-[#c4a86b] font-semibold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    Registered Businesses
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold text-[#f5f0e8] uppercase mb-2"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Corporate Client Rate
                </h3>
                <p
                  className="text-xs text-[#ede7db]/80 leading-relaxed mb-6 font-medium"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Applies when the client is a registered business/company. Reflects higher expectations for reliability, support, and formal invoicing.
                </p>

                {/* Price Header */}
                <div className="bg-[#faf7f2] border border-[#ede7db] p-6 rounded-2xl mb-8">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-4xl font-extrabold text-[#1e3323]"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        ₦750,000
                      </span>
                      <span
                        className="text-xs font-bold text-[#c4a86b] uppercase tracking-wider"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        PACKAGE RATE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#c4a86b] uppercase tracking-widest bg-[#1e3323]/10 px-2.5 py-1 rounded-full border border-[#c4a86b]/30">
                      T&C APPLIES *
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[#6b6b5e] font-medium flex items-center gap-2">
                    <span className="line-through decoration-[#c4a86b] decoration-2">Subtotal: ₦800,000</span>
                    <span className="bg-[#c4a86b] text-[#1e3323] font-bold px-2 py-0.5 rounded text-[11px]">Save ₦50k</span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-4 mb-8">
                  <p
                    className="text-xs font-bold uppercase tracking-wider text-[#c4a86b] border-b border-[#c4a86b]/30 pb-2"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    ITEMIZED BREAKDOWN
                  </p>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Web Development</p>
                      <p className="text-[11px] text-[#ede7db]/70">Next.js build, responsive layout, page structure</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦350,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>UI/UX Design</p>
                      <p className="text-[11px] text-[#ede7db]/70">Template adaptation, brand color & typography integration</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦200,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Contact Form Setup</p>
                      <p className="text-[11px] text-[#ede7db]/70">Nodemailer integration, delivery testing & fix</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦150,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Content & Asset Integration</p>
                      <p className="text-[11px] text-[#ede7db]/70">Logos, partner marquee, copy placement</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦100,000</span>
                  </div>
                </div>
              </div>

              <a
                href="#quote"
                className="w-full bg-[#c4a86b] text-[#1e3323] text-xs font-bold uppercase tracking-wider py-4 rounded-full text-center hover:bg-[#d4bc8b] transition-colors shadow-lg block"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                REQUEST CORPORATE PLAN — ₦750,000
              </a>
            </div>

            {/* 2. Individual / Personal Client Rate (SECOND) */}
            <div
              id="card-individual"
              className="w-full shrink-0 snap-center bg-[#faf7f2] border border-[#ede7db] rounded-3xl p-7 flex flex-col justify-between shadow-lg relative"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full bg-[#1e3323]/10 text-[#1e3323]"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    INDIVIDUAL / PERSONAL
                  </span>
                  <span className="text-xs text-[#6b6b5e] font-semibold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    Solo & Personal Projects
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold text-[#1e3323] uppercase mb-2"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Personal Client Rate
                </h3>
                <p
                  className="text-xs text-[#6b6b5e] leading-relaxed mb-6 font-medium"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Best suited for personal projects, solo entrepreneurs, or early-stage individuals with limited budget flexibility.
                </p>

                {/* Price Header */}
                <div className="bg-[#f5f0e8] border border-[#ede7db] p-6 rounded-2xl mb-8">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-4xl font-extrabold text-[#1e3323]"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        ₦500,000
                      </span>
                      <span
                        className="text-xs font-bold text-[#c4a86b] uppercase tracking-wider"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        STANDARD RATE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1e3323]/70 uppercase tracking-widest bg-[#1e3323]/5 px-2.5 py-1 rounded-full border border-[#ede7db]">
                      T&C APPLIES *
                    </span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-4 mb-8">
                  <p
                    className="text-xs font-bold uppercase tracking-wider text-[#1e3323] border-b border-[#ede7db] pb-2"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    ITEMIZED BREAKDOWN
                  </p>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Web Development</p>
                      <p className="text-[11px] text-[#6b6b5e]">Next.js build, responsive layout, page structure</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦220,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>UI/UX Design</p>
                      <p className="text-[11px] text-[#6b6b5e]">Template adaptation, brand color & typography integration</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦120,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Contact Form Setup</p>
                      <p className="text-[11px] text-[#6b6b5e]">Nodemailer integration, delivery testing & fix</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦90,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Content & Asset Integration</p>
                      <p className="text-[11px] text-[#6b6b5e]">Logos, partner marquee, copy placement</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦70,000</span>
                  </div>
                </div>
              </div>

              <a
                href="#quote"
                className="w-full bg-[#1e3323] text-[#f5f0e8] text-xs font-bold uppercase tracking-wider py-4 rounded-full text-center hover:bg-[#2d4a2d] transition-colors shadow-md block"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                REQUEST PERSONAL PLAN — ₦500,000
              </a>
            </div>
          </div>

          {/* Mobile Swipe Pagination Dots (< lg) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-16">
            <button
              onClick={() => {
                setPricingTab("corporate");
                document.getElementById("card-corporate")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                pricingTab === "corporate" ? "w-8 bg-[#1e3323]" : "w-2.5 bg-[#ede7db]"
              }`}
              aria-label="View Corporate Plan"
            />
            <button
              onClick={() => {
                setPricingTab("individual");
                document.getElementById("card-individual")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                pricingTab === "individual" ? "w-8 bg-[#1e3323]" : "w-2.5 bg-[#ede7db]"
              }`}
              aria-label="View Personal Plan"
            />
          </div>

          {/* Pricing Tiers — Desktop Grid (>= lg) */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-stretch mb-20">
            {/* 1. Corporate / Company Client Rate (LEFT / FIRST) */}
            <div className="bg-[#1e3323] text-[#f5f0e8] border border-[#c4a86b]/40 rounded-3xl p-8 lg:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#c4a86b]" />
              <div>
                <div className="flex items-center justify-between gap-4 mb-4 pt-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full bg-[#c4a86b] text-[#1e3323]"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    CORPORATE / COMPANY
                  </span>
                  <span className="text-xs text-[#c4a86b] font-semibold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    Registered Businesses
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold text-[#f5f0e8] uppercase mb-2"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Corporate Client Rate
                </h3>
                <p
                  className="text-xs text-[#ede7db]/80 leading-relaxed mb-6 font-medium"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Applies when the client is a registered business/company. Reflects higher expectations for reliability, support, and formal invoicing.
                </p>

                {/* Price Header */}
                <div className="bg-[#faf7f2] border border-[#ede7db] p-6 rounded-2xl mb-8">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-4xl lg:text-5xl font-extrabold text-[#1e3323]"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        ₦750,000
                      </span>
                      <span
                        className="text-xs font-bold text-[#c4a86b] uppercase tracking-wider"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        PACKAGE RATE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#c4a86b] uppercase tracking-widest bg-[#1e3323]/10 px-2.5 py-1 rounded-full border border-[#c4a86b]/30">
                      T&C APPLIES *
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[#6b6b5e] font-medium flex items-center gap-2">
                    <span className="line-through decoration-[#c4a86b] decoration-2">Itemized Subtotal: ₦800,000</span>
                    <span className="bg-[#c4a86b] text-[#1e3323] font-bold px-2 py-0.5 rounded text-[11px]">Save ₦50k</span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-4 mb-8">
                  <p
                    className="text-xs font-bold uppercase tracking-wider text-[#c4a86b] border-b border-[#c4a86b]/30 pb-2"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    ITEMIZED BREAKDOWN
                  </p>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Web Development</p>
                      <p className="text-[11px] text-[#ede7db]/70">Next.js build, responsive layout, page structure</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦350,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>UI/UX Design</p>
                      <p className="text-[11px] text-[#ede7db]/70">Template adaptation, brand color & typography integration</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦200,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Contact Form Setup</p>
                      <p className="text-[11px] text-[#ede7db]/70">Nodemailer integration, delivery testing & fix</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦150,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#c4a86b]/30 text-xs">
                    <div>
                      <p className="font-bold text-[#f5f0e8]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Content & Asset Integration</p>
                      <p className="text-[11px] text-[#ede7db]/70">Logos, partner marquee, copy placement</p>
                    </div>
                    <span className="font-bold text-[#c4a86b] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦100,000</span>
                  </div>
                </div>
              </div>

              <a
                href="#quote"
                className="w-full bg-[#c4a86b] text-[#1e3323] text-xs font-bold uppercase tracking-wider py-4 rounded-full text-center hover:bg-[#d4bc8b] transition-colors shadow-lg block"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                REQUEST CORPORATE PLAN — ₦750,000
              </a>
            </div>

            {/* 2. Individual / Personal Client Rate (RIGHT / SECOND) */}
            <div className="bg-[#faf7f2] border border-[#ede7db] rounded-3xl p-8 lg:p-10 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full bg-[#1e3323]/10 text-[#1e3323]"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    INDIVIDUAL / PERSONAL
                  </span>
                  <span className="text-xs text-[#6b6b5e] font-semibold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    Solo & Personal Projects
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold text-[#1e3323] uppercase mb-2"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Personal Client Rate
                </h3>
                <p
                  className="text-xs text-[#6b6b5e] leading-relaxed mb-6 font-medium"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Best suited for personal projects, solo entrepreneurs, or early-stage individuals with limited budget flexibility.
                </p>

                {/* Price Header */}
                <div className="bg-[#f5f0e8] border border-[#ede7db] p-6 rounded-2xl mb-8">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-4xl lg:text-5xl font-extrabold text-[#1e3323]"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        ₦500,000
                      </span>
                      <span
                        className="text-xs font-bold text-[#c4a86b] uppercase tracking-wider"
                        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                      >
                        STANDARD RATE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1e3323]/70 uppercase tracking-widest bg-[#1e3323]/5 px-2.5 py-1 rounded-full border border-[#ede7db]">
                      T&C APPLIES *
                    </span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-4 mb-8">
                  <p
                    className="text-xs font-bold uppercase tracking-wider text-[#1e3323] border-b border-[#ede7db] pb-2"
                    style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  >
                    ITEMIZED BREAKDOWN
                  </p>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Web Development</p>
                      <p className="text-[11px] text-[#6b6b5e]">Next.js build, responsive layout, page structure</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦220,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>UI/UX Design</p>
                      <p className="text-[11px] text-[#6b6b5e]">Template adaptation, brand color & typography integration</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦120,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Contact Form Setup</p>
                      <p className="text-[11px] text-[#6b6b5e]">Nodemailer integration, delivery testing & fix</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦90,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#ede7db]/60 text-xs">
                    <div>
                      <p className="font-bold text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>Content & Asset Integration</p>
                      <p className="text-[11px] text-[#6b6b5e]">Logos, partner marquee, copy placement</p>
                    </div>
                    <span className="font-bold text-[#1e3323] shrink-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>₦70,000</span>
                  </div>
                </div>
              </div>

              <a
                href="#quote"
                className="w-full bg-[#1e3323] text-[#f5f0e8] text-xs font-bold uppercase tracking-wider py-4 rounded-full text-center hover:bg-[#2d4a2d] transition-colors shadow-md block"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                REQUEST PERSONAL PLAN — ₦500,000
              </a>
            </div>
          </div>

          {/* Why The Difference Section */}
          <div className="bg-[#faf7f2] border border-[#ede7db] rounded-3xl p-8 lg:p-12 mb-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p
                className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2 font-bold"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                TRANSPARENCY & VALUE
              </p>
              <h3
                className="text-2xl lg:text-3xl font-bold text-[#1e3323] uppercase"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                WHY THE RATE DIFFERENCE?
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#f5f0e8] p-6 rounded-2xl border border-[#ede7db]">
                <div className="w-10 h-10 rounded-full bg-[#1e3323] text-[#c4a86b] flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="text-sm font-bold text-[#1e3323] uppercase mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Budget Source
                </h4>
                <p className="text-xs text-[#6b6b5e] leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Companies typically draw from a dedicated marketing/development budget rather than personal savings, reducing pressure to under-price.
                </p>
              </div>

              <div className="bg-[#f5f0e8] p-6 rounded-2xl border border-[#ede7db]">
                <div className="w-10 h-10 rounded-full bg-[#1e3323] text-[#c4a86b] flex items-center justify-center font-bold text-sm mb-4 font-sans">
                  02
                </div>
                <h4 className="text-sm font-bold text-[#1e3323] uppercase mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Invoicing Needs
                </h4>
                <p className="text-xs text-[#6b6b5e] leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Corporate clients often require formal invoices, receipts, and tax documentation for accounting and audit compliance.
                </p>
              </div>

              <div className="bg-[#f5f0e8] p-6 rounded-2xl border border-[#ede7db]">
                <div className="w-10 h-10 rounded-full bg-[#1e3323] text-[#c4a86b] flex items-center justify-center font-bold text-sm mb-4 font-sans">
                  03
                </div>
                <h4 className="text-sm font-bold text-[#1e3323] uppercase mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Expectations
                </h4>
                <p className="text-xs text-[#6b6b5e] leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Business sites carry higher expectations for professionalism, uptime reliability, SLA commitments, and ongoing post-launch support.
                </p>
              </div>

              <div className="bg-[#f5f0e8] p-6 rounded-2xl border border-[#ede7db]">
                <div className="w-10 h-10 rounded-full bg-[#1e3323] text-[#c4a86b] flex items-center justify-center font-bold text-sm mb-4 font-sans">
                  04
                </div>
                <h4 className="text-sm font-bold text-[#1e3323] uppercase mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Scope Expansion
                </h4>
                <p className="text-xs text-[#6b6b5e] leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Listed rates serve as baseline starting points. Additional feature requests, custom integrations, or expanded deliverables provide room to negotiate upwards per project scope.
                </p>
              </div>
            </div>
          </div>

          {/* Notes & Terms Callout */}
          <div className="bg-[#1e3323] text-[#f5f0e8] rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#c4a86b]/30">
            <div className="space-y-2">
              <p
                className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] font-bold"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                PROJECT TERMS & CONDITIONS (T&C APPLIES)
              </p>
              <ul className="text-xs text-[#ede7db]/80 space-y-1.5 font-medium list-disc list-inside">
                <li><strong className="text-[#f5f0e8]">Terms & Conditions Apply:</strong> All listed prices represent starting baseline estimates. Custom feature requests, additional pages, complex integrations, or accelerated timelines are subject to individual scope adjustment.</li>
                <li><strong className="text-[#f5f0e8]">Domain & Hosting:</strong> Excluded from prices above (~₦14,000/year for standard .com domain).</li>
                <li><strong className="text-[#f5f0e8]">Payment Schedule:</strong> 50% deposit required to commence project development, with 50% final balance payable upon completion and delivery.</li>
              </ul>
            </div>
            <a
              href="#quote"
              className="shrink-0 bg-[#c4a86b] text-[#1e3323] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#d4bc8b] transition-colors"
              style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
            >
              GET A CUSTOM QUOTE
            </a>
          </div>
        </div>
      </section>

      {/* ===== 7. REQUEST A QUOTE SECTION ===== */}
      <section id="quote" className="bg-[#faf7f2] pt-12 pb-24 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              GET STARTED
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              REQUEST A CUSTOM QUOTE.
            </h2>
            <p className="text-sm text-[#6b6b5e] mt-4 font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              Fill in the project details below and our team will respond within 1 business day.
            </p>
          </div>

          {quoteStatus === "success" ? (
            <div className="text-center py-20 bg-[#f5f0e8] rounded-2xl border border-[#ede7db]">
              <div className="w-16 h-16 rounded-full bg-[#1e3323] flex items-center justify-center mx-auto mb-6">
                <span className="text-[#c4a86b] text-2xl">✓</span>
              </div>
              <h3 className="text-3xl font-bold uppercase text-[#1e3323] mb-3" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                REQUEST RECEIVED
              </h3>
              <p className="text-sm text-[#6b6b5e] max-w-sm mx-auto leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                Thank you! We&apos;ve received your request and sent a confirmation email. Our team will reach out within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} noValidate className="space-y-6">
              {quoteStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">{quoteError}</div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Full Name" name="fullName" required error={quoteErrors.fullName} placeholder="Your full name " />
                <InputField label="Company Name" name="company" required error={quoteErrors.company} placeholder="Your company name " />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Email Address" name="email" type="email" required error={quoteErrors.email} placeholder="mail@company.com" />
                <InputField label="Phone Number" name="phone" type="tel" required error={quoteErrors.phone} placeholder="+234 801 234 5678" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1e3323] tracking-wider mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  SERVICE REQUIRED <span className="text-[#c4a86b]">*</span>
                </label>
                <select
                  name="service"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] font-medium focus:outline-none focus:ring-2 focus:ring-[#c4a86b] ${quoteErrors.service ? "border-red-400" : "border-[#ede7db]"}`}
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a service…</option>
                  {solutions.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
                {quoteErrors.service && <p className="text-red-500 text-xs mt-1 font-medium">{quoteErrors.service}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1e3323] tracking-wider mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  PROJECT DESCRIPTION <span className="text-[#c4a86b]">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe your project, timeline requirements, and deliverables…"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#c4a86b] ${quoteErrors.description ? "border-red-400" : "border-[#ede7db]"}`}
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                />
                {quoteErrors.description && <p className="text-red-500 text-xs mt-1 font-medium">{quoteErrors.description}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Estimated Quantity" name="quantity" placeholder="e.g. 500 units" />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1e3323] tracking-wider mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    BUDGET RANGE
                  </label>
                  <select name="budget" className="w-full bg-[#f5f0e8] border border-[#ede7db] rounded-xl px-4 py-3.5 text-sm text-[#1e3323] font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }} defaultValue="">
                    <option value="" disabled>Select range…</option>
                    {budgetRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1e3323] tracking-wider mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  PREFERRED TIMELINE <span className="text-[#c4a86b]">*</span>
                </label>
                <select name="timeline" className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] font-medium ${quoteErrors.timeline ? "border-red-400" : "border-[#ede7db]"}`} style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }} defaultValue="">
                  <option value="" disabled>Select timeline…</option>
                  {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {quoteErrors.timeline && <p className="text-red-500 text-xs mt-1 font-medium">{quoteErrors.timeline}</p>}
              </div>

              {/* Reference Files */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#1e3323] tracking-wider mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  REFERENCE FILES <span className="text-[#6b6b5e] font-normal font-sans">(OPTIONAL — LOGOS, BRIEFS)</span>
                </label>
                <div className="border-2 border-dashed border-[#ede7db] rounded-xl p-8 text-center bg-[#f5f0e8] hover:border-[#c4a86b] transition-colors cursor-pointer">
                  <input
                    type="file"
                    name="files"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.ai,.eps,.zip"
                    className="hidden"
                    id="single-file-upload"
                    onChange={(e) => {
                      const label = document.getElementById("single-file-label");
                      if (label && e.target.files?.length) {
                        label.textContent = `${e.target.files.length} file(s) selected`;
                      }
                    }}
                  />
                  <label htmlFor="single-file-upload" className="cursor-pointer block">
                    <span className="text-3xl block mb-2">📎</span>
                    <span id="single-file-label" className="text-sm font-bold uppercase text-[#1e3323]" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      CLICK OR DRAG FILES TO UPLOAD
                    </span>
                    <span className="block text-xs text-[#6b6b5e]/70 mt-1 font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      PDF, JPG, PNG, AI, EPS, ZIP — MAX 20MB EACH
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={quoteStatus === "submitting"}
                className="w-full bg-[#1e3323] text-[#f5f0e8] text-xs font-bold uppercase tracking-wider py-4 rounded-full hover:bg-[#2d4a2d] transition-colors disabled:opacity-60 shadow-md"
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                {quoteStatus === "submitting" ? "SENDING REQUEST…" : "SUBMIT QUOTE REQUEST"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ===== 7. CONTACT & MAP SECTION ===== */}
      <section id="contact" className="bg-[#f5f0e8] py-28 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              CONTACT US
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#1e3323] uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
              GET IN TOUCH. <span className="text-[#c4a86b]">LET&apos;S TALK.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>OFFICE</p>
                <p className="text-sm text-[#6b6b5e] leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  <span className="font-bold text-[#1e3323] block mb-0.5">Bogaty Centrum Limited.</span>
                  No. 5 National Supply Road, Trans Amadi Industrial Layout<br />Port Harcourt, Rivers State, Nigeria
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>DIRECT CONTACT</p>
                <p className="text-sm text-[#1e3323] font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  <a href="tel:+2348066079075" className="hover:text-[#c4a86b] transition-colors">+234 (0)806 607 9075</a> · <a href="mailto:info@centzmi.com" className="hover:text-[#c4a86b] transition-colors underline underline-offset-4 decoration-[#c4a86b]/40">info@centzmi.com</a>
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>WHATSAPP</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348066079075"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#25D366] px-5 py-2.5 rounded-full hover:bg-[#1da851] transition-colors shadow-sm"
                  style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                >
                  Chat on WhatsApp
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>BUSINESS HOURS</p>
                <p className="text-sm text-[#6b6b5e] font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  Mon – Fri: 8:00am – 6:00pm · Sat: 10:00am – 2:00pm
                </p>
              </div>
            </div>

            <div>
              {contactStatus === "success" ? (
                <div className="bg-[#faf7f2] p-10 rounded-2xl border border-[#ede7db] text-center">
                  <span className="text-3xl block mb-3">✓</span>
                  <h3 className="text-2xl font-bold uppercase text-[#1e3323] mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>MESSAGE SENT</h3>
                  <p className="text-sm text-[#6b6b5e] font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>We&apos;ll be in touch shortly!</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate className="space-y-8">
                  {/* Honeypot field for bot trapping */}
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ display: "none" }}
                    aria-hidden="true"
                  />

                  {contactStatus === "error" && <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-medium">{contactError}</div>}

                  {/* First Name & Last Name */}
                  <div className="grid sm:grid-cols-2 gap-8">
                    <UnderlineInputField label="First name *" name="firstName" required error={contactErrors.name} />
                    <UnderlineInputField label="Last name *" name="lastName" required />
                  </div>

                  {/* Email */}
                  <UnderlineInputField label="Email *" name="email" type="email" required error={contactErrors.email} />

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#1e3323] mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className={`w-full bg-transparent border-b text-sm text-[#1e3323] font-medium focus:outline-none focus:border-[#3d6040] py-2 resize-none transition-colors ${contactErrors.message ? "border-red-400" : "border-[#3d6040]/30"}`}
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    />
                    {contactErrors.message && <p className="text-red-500 text-xs mt-1 font-medium">{contactErrors.message}</p>}
                  </div>

                  {/* reCAPTCHA Widget */}
                  <RecaptchaWidget
                    onVerify={(token) => setContactRecaptchaToken(token)}
                    onExpire={() => setContactRecaptchaToken("")}
                  />

                  {/* Submit Pill Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={contactStatus === "submitting"}
                      className="px-10 py-3.5 bg-[#1e3323] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#2d4a2d] transition-all duration-200 disabled:opacity-60 shadow-md"
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    >
                      {contactStatus === "submitting" ? "Submitting…" : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=4.805538,7.023238"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-16 rounded-2xl overflow-hidden h-72 border border-[#ede7db] relative group cursor-pointer"
          >
            <iframe
              src="https://maps.google.com/maps?q=4.805538,7.023238&hl=en&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: "none" }}
              title="Office location map"
            />
            {/* Overlay to intercept clicks and show subtle interactive hover state */}
            <div className="absolute inset-0 bg-[#1e3323]/0 group-hover:bg-[#1e3323]/5 transition-colors duration-200 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#1e3323] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                Open in Google Maps ↗
              </span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}

function InputField({ label, name, type = "text", required, error, placeholder }: { label: string; name: string; type?: string; required?: boolean; error?: string; placeholder?: string; }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase text-[#1e3323] tracking-wider mb-1.5" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
        {label} {required && <span className="text-[#c4a86b]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full bg-[#faf7f2] border rounded-xl px-4 py-3 text-sm text-[#1e3323] font-medium focus:outline-none focus:ring-2 focus:ring-[#c4a86b] ${error ? "border-red-400" : "border-[#ede7db]"}`}
        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}

function UnderlineInputField({ label, name, type = "text", required, error }: { label: string; name: string; type?: string; required?: boolean; error?: string; }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1e3323] mb-2" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className={`w-full bg-transparent border-b text-sm text-[#1e3323] font-medium focus:outline-none focus:border-[#3d6040] py-2 transition-colors ${error ? "border-red-400" : "border-[#3d6040]/30"}`}
        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
