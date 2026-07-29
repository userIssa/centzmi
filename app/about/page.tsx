import type { Metadata } from "next";
import { whyChoose } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "CentzMi is Africa's creative branding and visual communications partner. Discover our mission, vision, and core values.",
};

const coreValues = [
  { letter: "C", title: "Creativity", desc: "We transform ideas into compelling brand experiences." },
  { letter: "R", title: "Reliability", desc: "We deliver consistently on our promises." },
  { letter: "E", title: "Excellence", desc: "We pursue the highest standards in every project." },
  { letter: "A", title: "Accountability", desc: "We take ownership from concept to completion." },
  { letter: "T", title: "Teamwork", desc: "We collaborate to achieve exceptional outcomes." },
  { letter: "E", title: "Evolution", desc: "We continuously innovate and improve." },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-[#1e3323] pt-40 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            About CentzMi
          </p>
          <h1
            className="text-5xl lg:text-8xl font-light text-[#f5f0e8] leading-tight max-w-4xl"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            We Build Brands That Leave Lasting{" "}
            <em className="text-[#c4a86b] not-italic">Impressions.</em>
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-[#f5f0e8] py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Who We Are
            </p>
            <h2
              className="text-4xl lg:text-5xl font-light text-[#1e3323] mb-8 leading-tight"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              More Than a Branding Agency.
            </h2>
            <div className="space-y-5 text-[#6b6b5e] leading-relaxed" style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}>
              <p>
                CentzMi is a creative branding and visual communications company
                specialising in brand identity, corporate branding, premium packaging,
                signage, environmental branding, and creative production solutions.
              </p>
              <p>
                We help businesses communicate with clarity, build stronger brands, and
                create lasting impressions — across every touchpoint, at every scale, in
                every industry.
              </p>
              <p>
                Our approach goes beyond aesthetics. We combine strategic brand thinking
                with exceptional craft and rigorous production management — delivering
                complete brand experiences from initial concept through to final
                installation.
              </p>
              <p className="italic text-[#1e3323] border-l-2 border-[#c4a86b] pl-5">
                "Every Brand Tells a Story." At CentzMi, we believe every interaction
                with a brand shapes perception — and we&apos;re here to make sure yours
                shapes the right one.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="space-y-8">
            <div className="bg-[#1e3323] rounded-2xl p-8 text-[#f5f0e8]">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                Our Mission
              </p>
              <p
                className="text-xl lg:text-2xl font-light leading-relaxed"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                To deliver innovative branding and visual communication solutions that
                empower businesses to communicate with confidence, strengthen their
                identity, and compete successfully.
              </p>
            </div>
            <div className="bg-[#ede7db] rounded-2xl p-8">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                Our Vision
              </p>
              <p
                className="text-xl lg:text-2xl font-light text-[#1e3323] leading-relaxed"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                To become Africa&apos;s preferred creative branding and visual
                communications company, recognised for innovation, quality, creativity,
                and exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values — CREATE */}
      <section className="bg-[#faf7f2] py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a86b] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Core Values
            </p>
            <h2
              className="text-4xl lg:text-6xl font-light text-[#1e3323] tracking-wide"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              CREATE
            </h2>
            <p className="text-[#6b6b5e] mt-4 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              Six principles that guide everything we do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val) => (
              <div
                key={val.title}
                className="group bg-[#f5f0e8] border border-[#ede7db] rounded-xl p-8 hover:bg-[#1e3323] transition-all duration-300"
              >
                <span
                  className="text-6xl font-light text-[#c4a86b] group-hover:text-[#c4a86b] block mb-2"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif", lineHeight: 1 }}
                >
                  {val.letter}
                </span>
                <h3
                  className="text-xl font-medium text-[#1e3323] group-hover:text-[#f5f0e8] mb-3 transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  {val.title}
                </h3>
                <p
                  className="text-sm text-[#6b6b5e] group-hover:text-[#f5f0e8]/70 leading-relaxed transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CentzMi quick strip */}
      <section className="bg-[#1e3323] py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChoose.map((item) => (
            <div key={item.title} className="pl-5 border-l border-[#c4a86b]/40">
              <h3
                className="text-lg text-[#f5f0e8] mb-2"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {item.title}
              </h3>
              <p
                className="text-xs text-[#f5f0e8]/55 leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
