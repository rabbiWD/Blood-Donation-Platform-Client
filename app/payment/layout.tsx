import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-muted/30 via-background to-muted/20">
        {children}
      </main>
      <Footer />
    </>
  );
}
