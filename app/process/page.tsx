import type { Metadata } from "next";
import { processSteps } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How CentzMi works: a 5-step engagement model from discovery to delivery — Discover, Strategy, Create, Produce, Deliver.",
};

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3323] pt-40 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            How We Work
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] max-w-4xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            A Process Built for{" "}
            <em className="text-[#c4a86b] not-italic">Exceptional Outcomes.</em>
          </h1>
          <p
            className="text-[#f5f0e8]/60 mt-8 max-w-2xl text-base leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Every CentzMi engagement follows a structured five-stage process — designed
            to ensure creative precision, production quality, and on-time delivery every
            time.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#faf7f2] py-28 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Horizontal progress line (desktop) */}
          <div className="hidden lg:flex items-center mb-16 relative">
            <div className="absolute left-0 right-0 h-px bg-[#ede7db] top-1/2" />
            {processSteps.map((step, i) => (
              <div key={step.step} className="flex-1 flex flex-col items-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#1e3323] border-4 border-[#faf7f2] flex items-center justify-center mb-3">
                  <span
                    className="text-[#c4a86b] text-xs font-bold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {step.step}
                  </span>
                </div>
                <p
                  className="text-sm font-medium text-[#1e3323]"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "18px" }}
                >
                  {step.title}
                </p>
                {i < processSteps.length - 1 && (
                  <div className="absolute right-0 top-6 w-px h-0" />
                )}
              </div>
            ))}
          </div>

          {/* Step detail cards */}
          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <div
                key={step.step}
                className={`flex flex-col lg:flex-row gap-8 p-8 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                  i % 2 === 0
                    ? "bg-[#f5f0e8] border-[#ede7db]"
                    : "bg-[#1e3323] border-[#1e3323]"
                }`}
              >
                <div className="flex-shrink-0">
                  <span
                    className={`text-5xl font-light ${i % 2 === 0 ? "text-[#c4a86b]" : "text-[#c4a86b]"}`}
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {step.step}
                  </span>
                </div>
                <div>
                  <h2
                    className={`text-3xl font-light mb-4 ${i % 2 === 0 ? "text-[#1e3323]" : "text-[#f5f0e8]"}`}
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {step.title}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed ${i % 2 === 0 ? "text-[#6b6b5e]" : "text-[#f5f0e8]/70"}`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f0e8] py-24 px-6 lg:px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl lg:text-5xl font-light text-[#1e3323] mb-6"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Ready to Start the Process?
          </h2>
          <p
            className="text-[#6b6b5e] mb-8 text-sm leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Tell us about your project and we&apos;ll get the discovery phase underway.
          </p>
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
