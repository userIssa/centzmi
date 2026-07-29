"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems, portfolioCategories, type PortfolioCategory } from "@/lib/data";

export default function PortfolioPage() {
  const [active, setActive] = useState<PortfolioCategory>("All");

  const filtered =
    active === "All"
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === active);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3323] pt-40 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            Our Work
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] max-w-4xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Projects That Speak for{" "}
            <em className="text-[#c4a86b] not-italic">Themselves.</em>
          </h1>
          <p
            className="text-[#f5f0e8]/60 mt-8 max-w-xl text-base leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            A curated selection of work across brand identity, packaging, signage,
            office branding, events, and more.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-[#faf7f2] py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Filter tabs — Horizontal swipe on mobile, wrapped flex on desktop */}
          <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none gap-2 pb-2 mb-8 md:flex-wrap md:pb-0 -mx-6 px-6 md:mx-0">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActive(cat)}
                className={`shrink-0 text-xs font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-200 ${
                  active === cat
                    ? "bg-[#1e3323] border-[#1e3323] text-[#f5f0e8] shadow-sm"
                    : "bg-transparent border-[#ede7db] text-[#6b6b5e] hover:border-[#1e3323] hover:text-[#1e3323]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count */}
          <p
            className="text-xs text-[#6b6b5e] mb-8"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Showing {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            {active !== "All" ? ` in ${active}` : ""}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-[#f5f0e8] border border-[#ede7db]"
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
                    <p
                      className="text-[#f5f0e8] text-xs sm:text-sm font-medium truncate"
                      style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-[#c4a86b] text-[10px] sm:text-xs mt-0.5"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {item.client}
                    </p>
                  </div>
                </div>
                <div className="p-2.5 sm:p-4">
                  <p
                    className="text-[9px] sm:text-xs text-[#c4a86b] tracking-wider uppercase mb-0.5 sm:mb-1 truncate"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.category}
                  </p>
                  <p
                    className="text-xs sm:text-sm text-[#1e3323] font-medium leading-snug line-clamp-2"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[#6b6b5e]" style={{ fontFamily: "Inter, sans-serif" }}>
                No projects in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f0e8] py-20 px-6 lg:px-10 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl lg:text-4xl font-light text-[#1e3323] mb-6"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Ready to add your project to the portfolio?
          </h2>
          <Link
            href="/quote"
            className="inline-block bg-[#1e3323] text-[#f5f0e8] text-sm font-medium px-8 py-4 rounded-full hover:bg-[#2d4a2d] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
