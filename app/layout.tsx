import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: {
    default: "CentzMi — Creative Branding & Visual Communications",
    template: "%s | CentzMi",
  },
  description:
    "CentzMi is a creative branding and visual communications company specialising in brand identity, corporate branding, premium packaging, signage, environmental branding, and creative production solutions.",
  keywords: [
    "Creative Branding",
    "Corporate Branding",
    "Brand Identity",
    "Premium Packaging",
    "Visual Communications",
    "Signage Solutions",
    "Environmental Branding",
    "Promotional Merchandise",
    "Brand Production",
    "Office Branding",
    "Event Branding",
    "Marketing Collateral",
  ],
  openGraph: {
    type: "website",
    title: "CentzMi — Creative Branding & Visual Communications",
    description:
      "Creative branding. Premium packaging. Lasting impressions. Helping businesses communicate with clarity and build stronger brands.",
    siteName: "CentzMi",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-[#faf7f2] text-[#1e3323] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
