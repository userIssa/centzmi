import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <>
      {siteKey && (
        <Script
          id="google-recaptcha-script"
          src="https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoaded&render=explicit"
          strategy="afterInteractive"
        />
      )}
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

