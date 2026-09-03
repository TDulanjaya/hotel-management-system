import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b0d] text-white flex flex-col justify-between">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/landing-bg.webp')",
        }}
      />

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50" />

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-16 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />

      <section className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-[#d3a13b]/60 bg-black/40 shadow-lg backdrop-blur-md">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-[#d3a13b]" />
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide text-[#d3a13b]">
                The Camellia
              </h1>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-white">
                Reserve
              </p>
            </div>
          </div>

          <div className="hidden text-right md:block">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.45em] text-white/90">
              Staff Portal
            </p>
            <div className="ml-auto mt-2 h-[2px] w-14 bg-[#d3a13b]" />
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1fr_0.9fr]">
          {/* Left Hero Text */}
          <div className="max-w-xl">
            <p className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-[#d3a13b]">
              Welcome to Camellia Reserve
            </p>

            <div className="mb-4 h-[2px] w-12 bg-[#d3a13b]" />

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Welcome Back,
              <span className="block text-[#d3a13b]">Valued Team</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed text-white/85">
              This is your central operational hub to manage reservations, serve guests, and create memorable luxury experiences.
            </p>
          </div>

          {/* Right Login Call-to-Action */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl border border-[#d3a13b]/30 bg-black/50 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto mb-4 flex items-center justify-center gap-4">
                <div className="h-[1.5px] w-14 bg-[#d3a13b]/60" />
                <Sparkles className="h-7 w-7 text-[#d3a13b]" />
                <div className="h-[1.5px] w-14 bg-[#d3a13b]/60" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-white">
                Glad to have you back!
              </h3>

              <p className="mx-auto mt-2.5 max-w-sm text-xs sm:text-sm leading-relaxed text-white/80">
                Let&apos;s continue delivering exceptional Sri Lankan hospitality across all departments.
              </p>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="group mx-auto flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#b88727] via-[#d3a13b] to-[#e3b84f] px-7 py-4 text-lg font-bold text-white shadow-[0_12px_35px_rgba(211,161,59,0.35)] transition hover:scale-[1.02] hover:shadow-[0_16px_45px_rgba(211,161,59,0.45)] active:scale-95"
                >
                  Staff Portal Login
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support Info (Properly Aligned & Responsive) */}
        <footer className="border-t border-[#d3a13b]/25 pt-5 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
            <FooterItem
              icon={<Clock />}
              title="Need Help?"
              description="Contact IT Support"
            />

            <FooterItem
              icon={<Mail />}
              title="Email Support"
              description="it.support@camelliareserve.com"
              href="mailto:it.support@camelliareserve.com"
            />

            <FooterItem
              icon={<Phone />}
              title="Call Support"
              description="+94 11 234 5678"
              href="tel:+94112345678"
            />
          </div>
        </footer>
      </section>
    </main>
  );
}

function FooterItem({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3.5 rounded-2xl border border-[#d3a13b]/20 bg-black/40 px-4 py-3 backdrop-blur-md transition hover:border-[#d3a13b]/50 hover:bg-black/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d3a13b]/40 bg-[#d3a13b]/10 text-[#d3a13b]">
        <div className="[&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      </div>

      <div className="min-w-0 flex-1 text-left">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#d3a13b]">
          {title}
        </p>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-white/90 truncate">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition active:scale-95">
        {content}
      </a>
    );
  }

  return content;
}