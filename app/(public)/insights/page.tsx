"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { insights, insightTopics, type InsightTopic } from "@/lib/data";

export default function InsightsPage() {
  const [active, setActive] = useState<InsightTopic>("All");

  const filtered =
    active === "All" ? insights : insights.filter((a) => a.topic === active);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3323] pt-40 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            Insights
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] max-w-4xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Thinking on Branding,{" "}
            <em className="text-[#c4a86b] not-italic">Design & Growth.</em>
          </h1>
        </div>
      </section>

      {/* Filter + Articles */}
      <section className="bg-[#faf7f2] py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Topic filters */}
          <div className="flex flex-wrap gap-2 mb-12">
            {insightTopics.map((topic) => (
              <button
                key={topic}
                id={`topic-${topic.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActive(topic)}
                className={`text-xs font-medium px-5 py-2.5 rounded-full border transition-all duration-200 ${
                  active === topic
                    ? "bg-[#1e3323] border-[#1e3323] text-[#f5f0e8]"
                    : "bg-transparent border-[#ede7db] text-[#6b6b5e] hover:border-[#1e3323] hover:text-[#1e3323]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="group bg-[#f5f0e8] border border-[#ede7db] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-xs text-[#c4a86b] font-medium tracking-wide"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {article.topic}
                    </span>
                    <span className="text-[#ede7db]">·</span>
                    <span
                      className="text-xs text-[#6b6b5e]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {article.readTime}
                    </span>
                  </div>
                  <h2
                    className="text-xl font-medium text-[#1e3323] mb-3 leading-snug group-hover:text-[#2d4a2d] transition-colors"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "22px" }}
                  >
                    {article.title}
                  </h2>
                  <p
                    className="text-sm text-[#6b6b5e] leading-relaxed mb-5"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs text-[#6b6b5e]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {article.date}
                    </span>
                    <Link
                      href={`/insights/${article.id}`}
                      className="text-xs font-medium text-[#1e3323] border-b border-[#c4a86b] pb-0.5 hover:text-[#c4a86b] transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[#6b6b5e]" style={{ fontFamily: "Inter, sans-serif" }}>
                No articles in this topic area yet — check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
