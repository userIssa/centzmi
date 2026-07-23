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

    const errs: Record<string, string> = {};
    if (!data.name) errs.name = "Name is required.";
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
                className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-light text-[#1e3323] leading-[0.92] tracking-tight"
                style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, Georgia, serif" }}
              >
                Creative <br />
                Branding
              </h1>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:pl-8">
              <p
                className="text-lg sm:text-xl lg:text-2xl text-[#1e3323]/85 italic leading-relaxed mb-8 max-w-md"
                style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, Georgia, serif" }}
              >
                Welcome to CentzMi, a creative studio for brand identity, premium packaging, and visual communications built for lasting impressions.
              </p>

              <a
                href="#quote"
                className="inline-flex items-center px-8 py-3.5 rounded-full border border-[#1e3323]/60 text-[#1e3323] text-sm font-medium hover:bg-[#1e3323] hover:text-[#f5f0e8] transition-all duration-300 shadow-sm"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
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
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                Who We Are
              </p>
              <h2
                className="text-4xl lg:text-6xl font-light text-[#1e3323] leading-tight mb-8"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                More Than Design. <em className="text-[#c4a86b] not-italic">More Than Production.</em>
              </h2>
              <p className="text-[#6b6b5e] leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}>
                CentzMi is a creative branding and visual communications company helping businesses communicate with clarity, build stronger brands, and create lasting impressions. We combine strategic thinking with exceptional craft — across every medium, every scale, every industry.
              </p>
              <p className="text-[#6b6b5e] leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}>
                &quot;Every Brand Tells a Story.&quot; We make sure yours is one worth remembering.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1e3323] rounded-2xl p-8 text-[#f5f0e8]">
                <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  Our Mission
                </p>
                <p className="text-xl lg:text-2xl font-light leading-relaxed" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  To deliver innovative branding and visual communication solutions that empower businesses to communicate with confidence, strengthen their identity, and compete successfully.
                </p>
              </div>

              <div className="bg-[#ede7db] rounded-2xl p-8">
                <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  Our Vision
                </p>
                <p className="text-xl lg:text-2xl font-light text-[#1e3323] leading-relaxed" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  To become Africa&apos;s preferred creative branding and visual communications company, recognised for innovation, quality, creativity, and exceptional service.
                </p>
              </div>
            </div>
          </div>

          {/* CREATE Core Values */}
          <div className="pt-12 border-t border-[#ede7db]">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                Core Values
              </p>
              <h3 className="text-4xl lg:text-5xl font-light text-[#1e3323]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                CREATE
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((val) => (
                <div key={val.title} className="group bg-[#faf7f2] border border-[#ede7db] rounded-xl p-8 hover:bg-[#1e3323] transition-all duration-300">
                  <span className="text-5xl font-light text-[#c4a86b] block mb-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {val.letter}
                  </span>
                  <h4 className="text-xl font-medium text-[#1e3323] group-hover:text-[#f5f0e8] mb-2 transition-colors" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {val.title}
                  </h4>
                  <p className="text-sm text-[#6b6b5e] group-hover:text-[#f5f0e8]/70 leading-relaxed transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
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
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              What We Do
            </p>
            <h2 className="text-4xl lg:text-6xl font-light text-[#1e3323]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Seven Specialisms. <em className="text-[#c4a86b] not-italic">One Integrated Partner.</em>
            </h2>
          </div>

          <div className="space-y-8">
            {solutions.map((sol, i) => (
              <div key={sol.id} className="grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-[#ede7db] group">
                <div className="lg:col-span-2 bg-[#1e3323] p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-4xl mb-6 block">{sol.icon}</span>
                    <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      Service {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-3xl font-light text-[#f5f0e8] mb-3" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                      {sol.title}
                    </h3>
                    <p className="text-sm text-[#c4a86b] italic" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "17px" }}>
                      {sol.tagline}
                    </p>
                  </div>
                  <a
                    href="#quote"
                    className="mt-8 inline-block text-xs tracking-wider uppercase border border-[#c4a86b]/40 text-[#c4a86b] px-5 py-2.5 rounded-full hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all duration-200 self-start"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Get a Quote →
                  </a>
                </div>

                <div className="lg:col-span-3 bg-[#f5f0e8] p-10">
                  <p className="text-[#6b6b5e] leading-relaxed mb-8 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    {sol.description}
                  </p>
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      Included Services
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {sol.subServices.map((sub) => (
                        <li key={sub} className="flex items-center gap-2 text-sm text-[#1e3323]" style={{ fontFamily: "Inter, sans-serif" }}>
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
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Industries We Serve
            </p>
            <h3 className="text-3xl lg:text-4xl font-light text-[#1e3323] mb-12" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Trusted Across Every Sector
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {industries.map((ind) => (
                <div key={ind} className="bg-[#f5f0e8] border border-[#ede7db] rounded-lg px-4 py-3 text-center text-sm font-medium text-[#1e3323] hover:bg-[#1e3323] hover:text-[#f5f0e8] transition-colors cursor-default" style={{ fontFamily: "Inter, sans-serif" }}>
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
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              How We Work
            </p>
            <h2 className="text-4xl lg:text-6xl font-light" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              A 5-Step Process for <em className="text-[#c4a86b] not-italic">Exceptional Delivery.</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <div key={step.step} className="bg-[#243824] border border-[#f5f0e8]/10 rounded-xl p-8 flex flex-col justify-between hover:border-[#c4a86b]/40 transition-colors">
                <div>
                  <span className="text-4xl font-light text-[#c4a86b] block mb-4" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {step.step}
                  </span>
                  <h3 className="text-2xl font-light mb-3 text-[#f5f0e8]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#f5f0e8]/65 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
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
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              Our Work
            </p>
            <h2 className="text-4xl lg:text-6xl font-light text-[#1e3323]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Projects That Speak for Themselves.
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
                className={`text-xs font-medium px-5 py-2.5 rounded-full border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#1e3323] border-[#1e3323] text-[#f5f0e8]"
                    : "bg-transparent border-[#ede7db] text-[#6b6b5e] hover:border-[#1e3323] hover:text-[#1e3323]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
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
                    <p className="text-[#f5f0e8] text-sm font-medium" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "16px" }}>
                      {item.title}
                    </p>
                    <p className="text-[#c4a86b] text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      Click to view project →
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-[#c4a86b] tracking-wider uppercase mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {item.category}
                  </p>
                  <p className="text-sm text-[#1e3323] font-medium leading-snug" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "16px" }}>
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
                className="inline-flex items-center gap-2 bg-[#1e3323] text-[#f5f0e8] text-xs font-semibold px-8 py-3.5 rounded-full hover:bg-[#2d4a2d] transition-all duration-300 shadow-md"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {isPortfolioExpanded
                  ? "Show Less ↑"
                  : `View More Work (${filteredPortfolio.length - 8} More) ↓`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* PORTFOLIO MODAL PREVIEW WITH PREV / NEXT NAVIGATION */}
      {selectedProject && (() => {
        const currentIndex = filteredPortfolio.findIndex((p) => p.id === selectedProject.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < filteredPortfolio.length - 1;

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
              {/* Top Bar: Counter & Close */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[#ede7db] bg-[#f5f0e8]/80">
                <span className="text-xs text-[#6b6b5e] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Project {currentIndex + 1} of {filteredPortfolio.length}
                </span>

                <div className="flex items-center gap-2">
                  {/* Prev / Next Header Quick Controls */}
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

                {/* Left Floating Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center text-xl hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all shadow-lg"
                  aria-label="Previous project"
                >
                  ‹
                </button>

                {/* Right Floating Arrow */}
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
                  <span className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {selectedProject.category} · Client: {selectedProject.client}
                  </span>
                </div>

                <h3 className="text-3xl font-light text-[#1e3323] mb-4" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {selectedProject.title}
                </h3>

                <p className="text-sm text-[#6b6b5e] leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                  Comprehensive branding execution delivered for {selectedProject.client}. Designed and produced to exact specification to establish visual authority and lasting market impact.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ede7db]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ede7db] text-xs font-medium text-[#1e3323] hover:border-[#1e3323] transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ede7db] text-xs font-medium text-[#1e3323] hover:border-[#1e3323] transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Next →
                    </button>
                  </div>

                  <a
                    href="#quote"
                    onClick={() => setSelectedProject(null)}
                    className="bg-[#1e3323] text-[#f5f0e8] text-xs font-medium px-6 py-2.5 rounded-full hover:bg-[#2d4a2d] transition-colors shadow-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Request Similar Project
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
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Get Started
            </p>
            <h2 className="text-4xl lg:text-6xl font-light text-[#1e3323]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Request a Custom Quote.
            </h2>
            <p className="text-sm text-[#6b6b5e] mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Fill in the project details below and our team will respond within 1 business day.
            </p>
          </div>

          {quoteStatus === "success" ? (
            <div className="text-center py-20 bg-[#f5f0e8] rounded-2xl border border-[#ede7db]">
              <div className="w-16 h-16 rounded-full bg-[#1e3323] flex items-center justify-center mx-auto mb-6">
                <span className="text-[#c4a86b] text-2xl">✓</span>
              </div>
              <h3 className="text-3xl font-light text-[#1e3323] mb-3" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                Request Received
              </h3>
              <p className="text-sm text-[#6b6b5e] max-w-sm mx-auto leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                Thank you! We&apos;ve received your request and sent a confirmation email. Our team will reach out within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} noValidate className="space-y-6">
              {quoteStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{quoteError}</div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Full Name" name="fullName" required error={quoteErrors.fullName} placeholder="Jane Doe" />
                <InputField label="Company Name" name="company" required error={quoteErrors.company} placeholder="Acme Corp" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Email Address" name="email" type="email" required error={quoteErrors.email} placeholder="jane@company.com" />
                <InputField label="Phone Number" name="phone" type="tel" required error={quoteErrors.phone} placeholder="+234 800 000 0000" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Service Required <span className="text-[#c4a86b]">*</span>
                </label>
                <select
                  name="service"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] focus:outline-none focus:ring-2 focus:ring-[#c4a86b] ${quoteErrors.service ? "border-red-400" : "border-[#ede7db]"}`}
                  defaultValue=""
                >
                  <option value="" disabled>Select a service…</option>
                  {solutions.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
                {quoteErrors.service && <p className="text-red-500 text-xs mt-1">{quoteErrors.service}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Project Description <span className="text-[#c4a86b]">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe your project, timeline requirements, and deliverables…"
                  className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] resize-none focus:outline-none focus:ring-2 focus:ring-[#c4a86b] ${quoteErrors.description ? "border-red-400" : "border-[#ede7db]"}`}
                />
                {quoteErrors.description && <p className="text-red-500 text-xs mt-1">{quoteErrors.description}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <InputField label="Estimated Quantity" name="quantity" placeholder="e.g. 500 units" />
                <div>
                  <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    Budget Range
                  </label>
                  <select name="budget" className="w-full bg-[#f5f0e8] border border-[#ede7db] rounded-xl px-4 py-3.5 text-sm text-[#1e3323]" defaultValue="">
                    <option value="" disabled>Select range…</option>
                    {budgetRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Preferred Timeline <span className="text-[#c4a86b]">*</span>
                </label>
                <select name="timeline" className={`w-full bg-[#f5f0e8] border rounded-xl px-4 py-3.5 text-sm text-[#1e3323] ${quoteErrors.timeline ? "border-red-400" : "border-[#ede7db]"}`} defaultValue="">
                  <option value="" disabled>Select timeline…</option>
                  {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {quoteErrors.timeline && <p className="text-red-500 text-xs mt-1">{quoteErrors.timeline}</p>}
              </div>

              {/* Reference Files */}
              <div>
                <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Reference Files <span className="text-[#6b6b5e] font-normal">(optional — logos, briefs)</span>
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
                    <span id="single-file-label" className="text-sm font-medium text-[#1e3323]">Click or drag files to upload</span>
                    <span className="block text-xs text-[#6b6b5e]/70 mt-1">PDF, JPG, PNG, AI, EPS, ZIP — max 20MB each</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={quoteStatus === "submitting"}
                className="w-full bg-[#1e3323] text-[#f5f0e8] text-sm font-semibold py-4 rounded-full hover:bg-[#2d4a2d] transition-colors disabled:opacity-60"
              >
                {quoteStatus === "submitting" ? "Sending Request…" : "Submit Quote Request"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ===== 8. CONTACT & MAP SECTION ===== */}
      <section id="contact" className="bg-[#f5f0e8] py-28 px-6 lg:px-10 scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Contact Us
            </p>
            <h2 className="text-4xl lg:text-6xl font-light text-[#1e3323]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Get in Touch. <em className="text-[#c4a86b] not-italic">Let&apos;s Talk.</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Office</p>
                <p className="text-sm text-[#6b6b5e] leading-relaxed">5 National Supply Road, Trans Amadi<br />Port Harcourt 500101, Rivers, Nigeria</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Direct Contact</p>
                <p className="text-sm text-[#1e3323]">
                  <a href="tel:+2348037529545" className="hover:text-[#c4a86b] transition-colors">+234 803 752 9545</a> · hello@centzmi.com
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>WhatsApp</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348037529545"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white bg-[#25D366] px-5 py-2.5 rounded-full hover:bg-[#1da851] transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c4a86b] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Business Hours</p>
                <p className="text-sm text-[#6b6b5e]">Mon – Fri: 8:00am – 6:00pm · Sat: 10:00am – 2:00pm</p>
              </div>
            </div>

            <div>
              {contactStatus === "success" ? (
                <div className="bg-[#faf7f2] p-10 rounded-2xl border border-[#ede7db] text-center">
                  <span className="text-3xl block mb-3">✓</span>
                  <h3 className="text-2xl font-light text-[#1e3323] mb-2">Message Sent</h3>
                  <p className="text-sm text-[#6b6b5e]">We&apos;ll be in touch shortly!</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                  {contactStatus === "error" && <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">{contactError}</div>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Name" name="name" required error={contactErrors.name} placeholder="Jane Doe" />
                    <InputField label="Email" name="email" type="email" required error={contactErrors.email} placeholder="jane@company.com" />
                  </div>
                  <InputField label="Phone" name="phone" type="tel" placeholder="+234 803 752 9545" />
                  <div>
                    <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      Message <span className="text-[#c4a86b]">*</span>
                    </label>
                    <textarea name="message" rows={4} className={`w-full bg-[#faf7f2] border rounded-xl px-4 py-3 text-sm text-[#1e3323] resize-none ${contactErrors.message ? "border-red-400" : "border-[#ede7db]"}`} placeholder="How can we help?" />
                    {contactErrors.message && <p className="text-red-500 text-xs mt-1">{contactErrors.message}</p>}
                  </div>
                  <button type="submit" disabled={contactStatus === "submitting"} className="w-full bg-[#1e3323] text-[#f5f0e8] text-sm font-semibold py-3.5 rounded-full hover:bg-[#2d4a2d] transition-colors">
                    {contactStatus === "submitting" ? "Sending…" : "Send Message"}
                  </button>
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
      <label className="block text-xs font-medium text-[#1e3323] tracking-wide mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
        {label} {required && <span className="text-[#c4a86b]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full bg-[#faf7f2] border rounded-xl px-4 py-3 text-sm text-[#1e3323] focus:outline-none focus:ring-2 focus:ring-[#c4a86b] ${error ? "border-red-400" : "border-[#ede7db]"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
