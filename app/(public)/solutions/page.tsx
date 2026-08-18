import type { Metadata } from "next";
import { solutions } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "CentzMi full-service catalogue: Brand Identity, Corporate Branding, Packaging Solutions, Signage & Environmental Branding, Marketing & Promotional, Creative Design, and Brand Production.",
};

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3323] pt-40 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            What We Do
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] max-w-4xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Seven Specialisms.{" "}
            <em className="text-[#c4a86b] not-italic">One Integrated Partner.</em>
          </h1>
          <p
            className="text-[#f5f0e8]/60 mt-8 max-w-2xl text-base leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            From your first brand mark to a full environmental signage rollout — every
            CentzMi solution is designed to work together as part of a cohesive brand
            system.
          </p>
        </div>
      </section>

      {/* Solutions */}
      <section className="bg-[#faf7f2] py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {solutions.map((sol, i) => (
            <div
              key={sol.id}
              id={sol.id}
              className={`grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-[#ede7db] group scroll-mt-24 ${
                i % 2 === 0 ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Left — label + title */}
              <div className="lg:col-span-2 bg-[#1e3323] p-10 flex flex-col justify-between">
                <div>
                  <span className="text-4xl mb-6 block">{sol.icon}</span>
                  <h2
                    className="text-3xl lg:text-4xl font-light text-[#f5f0e8] mb-4 leading-tight"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {sol.title}
                  </h2>
                  <p
                    className="text-sm text-[#c4a86b] italic"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "17px" }}
                  >
                    {sol.tagline}
                  </p>
                </div>
                <Link
                  href="/quote"
                  className="mt-8 inline-block text-xs tracking-wider uppercase border border-[#c4a86b]/40 text-[#c4a86b] px-5 py-3 rounded-full hover:bg-[#c4a86b] hover:text-[#1e3323] transition-all duration-200 self-start"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Get a Quote →
                </Link>
              </div>

              {/* Right — description + sub-services */}
              <div className="lg:col-span-3 bg-[#f5f0e8] p-10">
                <p
                  className="text-[#6b6b5e] leading-relaxed mb-8 text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {sol.description}
                </p>
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase text-[#c4a86b] mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Included Services
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {sol.subServices.map((sub) => (
                      <li
                        key={sub}
                        className="flex items-center gap-2 text-sm text-[#1e3323]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
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
      </section>

      {/* CTA */}
      <section className="bg-[#1e3323] py-24 px-6 lg:px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl lg:text-5xl font-light text-[#f5f0e8] mb-6"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Not sure which solution fits?
          </h2>
          <p
            className="text-[#f5f0e8]/60 mb-8 text-sm"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Tell us about your project and we&apos;ll recommend the right approach.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#c4a86b] text-[#1e3323] font-semibold text-sm px-8 py-4 rounded-full hover:bg-[#d4bc8b] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
