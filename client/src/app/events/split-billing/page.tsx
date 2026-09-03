"use client";
import { useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type RuleRoute = "Master Bill" | "Guest Folio";

type Rule = {
  id: number;
  title: string;
  description: string;
  route: RuleRoute;
  icon: string;
};

const initialRules: Rule[] = [
  {
    id: 1,
    title: "Venue Rental & Equipment",
    description: "Main ballroom, breakout rooms, stage, and AV setup.",
    route: "Master Bill",
    icon: "📍",
  },
  {
    id: 2,
    title: "Daily Conference Buffet",
    description: "Breakfast, lunch, and afternoon tea for event guests.",
    route: "Master Bill",
    icon: "🍽",
  },
  {
    id: 3,
    title: "Personal Room Service",
    description: "In-room dining and minibar charges.",
    route: "Guest Folio",
    icon: "🛎",
  },
  {
    id: 4,
    title: "Lounge & Bar Consumption",
    description: "Alcohol and lounge services outside scheduled event menu.",
    route: "Guest Folio",
    icon: "🍷",
  },
];

export default function SplitBillingPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules);

  const toggleRule = (id: number) => {
    setRules((currentRules) =>
      currentRules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              route:
                rule.route === "Master Bill" ? "Guest Folio" : "Master Bill",
            }
          : rule
      )
    );
  };

  const masterRules = rules.filter((rule) => rule.route === "Master Bill");
  const guestRules = rules.filter((rule) => rule.route === "Guest Folio");

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
          <header className="mb-6 sm:mb-10 flex flex-col justify-between gap-4 sm:gap-6 xl:flex-row xl:items-end">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Events Module
              </p>

              <h1 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-extrabold text-[#735c00]">
                Split Billing Rules
              </h1>

              <p className="mt-1 sm:mt-2 max-w-3xl text-xs sm:text-sm text-[#4d4635]">
                Configure how automated event charges are routed between the
                master event bill and individual guest folios.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-xl border border-[#735c00] px-5 py-3 text-sm sm:text-base font-bold text-[#735c00] transition hover:bg-[#735c00]/5 text-center">
                View Draft Rules
              </button>

              <button className="w-full sm:w-auto rounded-xl bg-[#735c00] px-5 py-3 text-sm sm:text-base font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] text-center">
                Publish Rules
              </button>
            </div>
          </header>

          <section className="grid grid-cols-12 gap-6">
            <section className="col-span-12 space-y-6 xl:col-span-8">
              <div className="flex flex-col justify-between gap-2 sm:gap-4 sm:flex-row sm:items-center">
                <h2 className="text-xl sm:text-2xl font-bold">Routing Priority</h2>

                <span className="w-fit rounded-full bg-[#d4af37]/20 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#735c00]">
                  {rules.length} Active Rules
                </span>
              </div>

              <RuleGroup
                title="Master Event Bill"
                description="Charges routed here are billed directly to the event organizer or corporate account."
                rules={masterRules}
                onToggle={toggleRule}
              />

              <RuleGroup
                title="Individual Guest Folios"
                description="Charges routed here are billed to personal guest folios or guest payment cards."
                rules={guestRules}
                onToggle={toggleRule}
              />
            </section>

            <aside className="col-span-12 space-y-6 xl:col-span-4">
              <section className="rounded-2xl border border-[#ba1a1a]/20 bg-[#ffdad6]/40 p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">⚠</span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#ba1a1a]">
                    Billing Warning
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#93000a]">
                  Premium Suite Services are currently defaulting to the{" "}
                  <strong>Master Bill</strong>. Corporate organizers usually
                  restrict this.
                </p>

                <button className="mt-5 sm:mt-6 w-full rounded-xl bg-[#ba1a1a] py-3 text-sm sm:text-base font-bold text-white transition hover:bg-[#93000a]">
                  Restrict Now
                </button>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold">Billing Distribution</h2>

                <div className="mt-5 sm:mt-6 flex h-4 w-full overflow-hidden rounded-full bg-[#d0c5af]">
                  <div className="h-full w-[72%] bg-[#735c00]" />
                  <div className="h-full w-[28%] bg-[#565e74]" />
                </div>

                <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
                  <DistributionRow
                    label="Corporate Master Bill"
                    value="72%"
                    color="bg-[#735c00]"
                  />

                  <DistributionRow
                    label="Guest Folios"
                    value="28%"
                    color="bg-[#565e74]"
                  />
                </div>

                <div className="mt-6 sm:mt-8 border-t border-[#d0c5af] pt-5 sm:pt-6">
                  <p className="mb-3 sm:mb-4 text-xs font-bold uppercase tracking-widest text-[#4d4635]">
                    Master Ledger Identity
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-[#f5f3ef] p-3.5 sm:p-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#101827] text-lg sm:text-xl text-[#d4af37]">
                      ▣
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">TechCorp Global</p>
                      <p className="text-xs sm:text-sm text-[#4d4635] truncate">
                        Tax ID: 88-129302-1
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-[#101827] p-5 sm:p-6 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                  Elite Concierge
                </p>

                <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold">
                  Need approval for custom billing?
                </h2>

                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/70">
                  Send this billing configuration to the finance manager for
                  review before publishing.
                </p>

                <button className="mt-5 sm:mt-6 w-full rounded-xl bg-[#d4af37] py-3 text-sm sm:text-base font-bold text-[#241a00] transition hover:bg-[#f2c426]">
                  Request Approval
                </button>
              </section>
            </aside>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function RuleGroup({
  title,
  description,
  rules,
  onToggle,
}: {
  title: string;
  description: string;
  rules: Rule[];
  onToggle: (id: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
      <div className="border-b border-[#d0c5af] p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
        <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">{description}</p>
      </div>

      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {rules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d0c5af] p-6 text-center text-sm text-[#4d4635]">
            No rules assigned here.
          </div>
        ) : (
          rules.map((rule) => (
            <article
              key={rule.id}
              className="flex flex-col justify-between gap-3 sm:gap-4 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4 sm:p-5 transition hover:border-[#735c00]/50 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl sm:text-2xl shadow-sm">
                  {rule.icon}
                </div>

                <div>
                  <h4 className="font-bold text-sm sm:text-base">{rule.title}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">
                    {rule.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d0c5af]/40">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    rule.route === "Master Bill"
                      ? "bg-[#735c00]/10 text-[#735c00]"
                      : "bg-[#565e74]/10 text-[#565e74]"
                  }`}
                >
                  {rule.route}
                </span>

                <button
                  onClick={() => onToggle(rule.id)}
                  className="rounded-xl border border-[#d0c5af] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#4d4635] transition hover:bg-[#d0c5af]/30"
                >
                  Switch Route
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function DistributionRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs sm:text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="font-medium text-[#4d4635]">{label}</span>
      </div>

      <strong className="text-[#1b1c1a]">{value}</strong>
    </div>
  );
}
