import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { CopyrightYear } from "@/components/layout/CopyrightYear";
import { Logo } from "@/components/layout/Logo";
import { FOOTER_LINKS } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            LifeLink connects patients in urgent need with verified, eligible
            blood donors across Bangladesh. Every drop counts.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" aria-hidden />
              Emergency Helpline: 16263
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" aria-hidden />
              help@lifelink.org
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {FOOTER_LINKS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider">
              {group.title}
            </h2>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © <CopyrightYear /> LifeLink Blood Donation Platform. Donate blood,
          save lives.
        </p>
      </div>
    </footer>
  );
}
