"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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

  // Quote form state
  const [quoteStatus, setQuoteStatus] = useState<FormStatus>("idle");
  const [quoteError, setQuoteError] = useState("");
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});

  // Contact form state
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [contactError, setContactError] = useState("");
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

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
              <div className="bg-[#1e3323] rounded-2xl p-8 text-[#f5f0e8]">
                <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  OUR MISSION
                </p>
                <p className="text-xl lg:text-2xl font-medium leading-relaxed uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  To deliver innovative branding and visual communication solutions that empower businesses to communicate with confidence, strengthen their identity, and compete successfully.
                </p>
              </div>

              <div className="bg-[#ede7db] rounded-2xl p-8">
                <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  OUR VISION
                </p>
                <p className="text-xl lg:text-2xl font-medium text-[#1e3323] leading-relaxed uppercase tracking-tight" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
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
                    <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      SERVICE {String(i + 1).padStart(2, "0")}
                    </p>
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
              <div key={step.step} className="bg-[#243824] border border-[#f5f0e8]/10 rounded-xl p-8 flex flex-col justify-between hover:border-[#c4a86b]/40 transition-colors">
                <div>
                  <span className="text-4xl font-bold text-[#c4a86b] block mb-4" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold uppercase mb-3 text-[#f5f0e8] tracking-wide" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#f5f0e8]/75 leading-relaxed font-medium" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
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

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setIsPortfolioExpanded(false);
                }}
                className={`text-xs font-bold uppercase px-5 py-2.5 rounded-full border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#1e3323] border-[#1e3323] text-[#f5f0e8]"
                    : "bg-transparent border-[#ede7db] text-[#6b6b5e] hover:border-[#1e3323] hover:text-[#1e3323]"
                }`}
                style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-[#f5f0e8] text-sm font-bold uppercase" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      {item.title}
                    </p>
                    <p className="text-[#c4a86b] text-xs font-bold uppercase mt-0.5" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                      VIEW PROJECT →
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[10px] text-[#c4a86b] font-bold tracking-wider uppercase mb-1" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                    {item.category}
                  </p>
                  <p className="text-sm text-[#1e3323] font-bold uppercase leading-snug" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ede7db] text-xs font-bold uppercase text-[#1e3323] hover:border-[#1e3323] transition-colors"
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    >
                      ← PREVIOUS
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ede7db] text-xs font-bold uppercase text-[#1e3323] hover:border-[#1e3323] transition-colors"
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

      {/* ===== 6. REQUEST A QUOTE SECTION ===== */}
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
                <InputField label="Full Name" name="fullName" required error={quoteErrors.fullName} placeholder="Jane Doe" />
                <InputField label="Company Name" name="company" required error={quoteErrors.company} placeholder="Acme Corp" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Email Address" name="email" type="email" required error={quoteErrors.email} placeholder="jane@company.com" />
                <InputField label="Phone Number" name="phone" type="tel" required error={quoteErrors.phone} placeholder="+234 803 752 9545" />
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
                  5 National Supply Road, Trans Amadi<br />Port Harcourt 500101, Rivers, Nigeria
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>DIRECT CONTACT</p>
                <p className="text-sm text-[#1e3323] font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>
                  <a href="tel:+2348037529545" className="hover:text-[#c4a86b] transition-colors">+234 803 752 9545</a> · hello@centzmi.com
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3 font-bold" style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}>WHATSAPP</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348037529545"}`}
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
                      className={`w-full bg-transparent border-b text-sm text-[#1e3323] font-medium focus:outline-none focus:border-[#1e3323] py-2 resize-none transition-colors ${contactErrors.message ? "border-red-400" : "border-[#1e3323]/30"}`}
                      style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
                    />
                    {contactErrors.message && <p className="text-red-500 text-xs mt-1 font-medium">{contactErrors.message}</p>}
                  </div>

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

          <div className="mt-16 rounded-2xl overflow-hidden h-72 border border-[#ede7db]">
            <iframe
              src="https://maps.google.com/maps?q=4.805538,7.023238&hl=en&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Office location map"
            />
          </div>
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
        className={`w-full bg-transparent border-b text-sm text-[#1e3323] font-medium focus:outline-none focus:border-[#1e3323] py-2 transition-colors ${error ? "border-red-400" : "border-[#1e3323]/30"}`}
        style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
