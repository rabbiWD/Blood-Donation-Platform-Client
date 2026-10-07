import type { ReactNode } from "react";
import { CopyrightYear } from "@/components/layout/CopyrightYear";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b bg-background/80 px-4 py-4 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        {children}
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © <CopyrightYear /> LifeLink Blood Donation Platform.
      </footer>
    </div>
  );
}
