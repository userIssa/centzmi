import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | CentzMi",
  description: "CentzMi admin portal for managing invoices and quotes.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal min-h-screen bg-[#0f1a12]">
      {children}
    </div>
  );
}
