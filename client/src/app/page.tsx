import type { ReactNode } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b0d] text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/landing-bg.webp')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full border border-[#c99a32]/10 opacity-40" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full border border-[#c99a32]/10 opacity-40" />

      <section className="relative z-10 flex min-h-screen flex-col px-6 py-6 md:px-10 lg:px-14 xl:px-16">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d3a13b]/60 bg-black/20 md:h-14 md:w-14">
              <Sparkles className="h-7 w-7 text-[#d3a13b] md:h-8 md:w-8" />
            </div>

            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-wide text-[#d3a13b] md:text-4xl">
                The Camellia
              </h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.4em] text-white md:text-sm">
                Reserve
              </p>
            </div>
          </div>

          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-white lg:text-base">
              Staff Portal
            </p>
            <div className="ml-auto mt-3 h-[2px] w-16 bg-[#d3a13b]" />
          </div>
        </header>

        {/* Main content */}
        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1fr_0.9fr]">
          {/* Left content */}
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#d3a13b] md:text-base">
              Welcome to Camellia Reserve
            </p>

            <div className="mb-5 h-[2px] w-14 bg-[#d3a13b]" />

            <h2 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl xl:text-6xl">
              Welcome Back,
              <span className="block text-[#d3a13b]">Valued Team</span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
              This is your hub to manage, serve and create memorable experiences
              for our guests.
            </p>

            {/* Feature box */}
            <div className="mt-8 max-w-lg rounded-3xl border border-[#d3a13b]/40 bg-black/45 p-5 shadow-2xl backdrop-blur-md md:p-6">
              <FeatureItem
                icon={<ShieldCheck />}
                title="Secure Access"
                description="Your secure gateway to internal systems"
              />

              <FeatureItem
                icon={<Users />}
                title="Team Collaboration"
                description="Work together. Serve better."
              />

              <FeatureItem
                icon={<Bell />}
                title="Stay Updated"
                description="Important updates and announcements"
              />

              <FeatureItem
                icon={<Star />}
                title="Excellence in Service"
                description="Deliver luxury. Every time."
                last
              />
            </div>
          </div>

          {/* Right login call */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto mb-6 flex items-center justify-center gap-6">
                <div className="h-[2px] w-20 bg-[#d3a13b]/50" />
                <Sparkles className="h-9 w-9 text-[#d3a13b]" />
                <div className="h-[2px] w-20 bg-[#d3a13b]/50" />
              </div>

              <h3 className="font-serif text-3xl font-semibold leading-tight text-white md:text-4xl">
                We&apos;re glad to have you here!
              </h3>

              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/90">
                Let&apos;s continue delivering exceptional hospitality and
                making every stay unforgettable.
              </p>

              <p className="mt-8 text-base font-semibold text-[#d3a13b]">
                Ready to get started?
              </p>

              <Link
                href="/login"
                className="group mx-auto mt-5 flex w-full max-w-sm items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#b88727] to-[#e3b84f] px-7 py-4 text-xl font-bold text-white shadow-[0_18px_40px_rgba(211,161,59,0.25)] transition hover:scale-[1.02] hover:shadow-[0_22px_55px_rgba(211,161,59,0.35)]"
              >
                Staff Login
                <ChevronRight className="h-6 w-6 transition group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#d3a13b]/30 pt-5">
          <div className="grid gap-5 text-white md:grid-cols-3">
            <FooterItem
              icon={<Clock />}
              title="Need Help?"
              description="Contact IT Support"
            />

            <FooterItem
              icon={<Mail />}
              title="Email Support"
              description="it.support@camelliareserve.com"
            />

            <FooterItem
              icon={<Phone />}
              title="Call Support"
              description="+94 11 234 5678"
            />
          </div>
        </footer>
      </section>
    </main>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  last = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 py-3 ${
        last ? "" : "border-b border-[#d3a13b]/20"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#d3a13b]">
        <div className="[&>svg]:h-7 [&>svg]:w-7">{icon}</div>
      </div>

      <div>
        <h4 className="text-base font-bold text-white md:text-lg">{title}</h4>
        <p className="mt-1 text-sm text-white/80">{description}</p>
      </div>
    </div>
  );
}

function FooterItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 md:justify-start">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d3a13b]/40 text-[#d3a13b]">
        <div className="[&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#d3a13b]">{title}</p>
        <p className="mt-1 text-sm text-white/85">{description}</p>
      </div>
    </div>
  );
}