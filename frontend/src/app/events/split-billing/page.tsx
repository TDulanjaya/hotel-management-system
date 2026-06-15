"use client";

import { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  Search,
  Bell,
  Wallet,
  MapPin,
  Utensils,
  ConciergeBell,
  Wine,
  AlertTriangle,
  PlusCircle,
  Badge,
} from "lucide-react";

type Rule = {
  id: number;
  title: string;
  description: string;
  route: "Master Bill" | "Guest Folio";
  icon: "venue" | "food" | "room" | "bar";
};

const initialRules: Rule[] = [
  {
    id: 1,
    title: "Venue Rental & Equipment",
    description: "Main ballroom, breakout rooms A-F, and AV setup.",
    route: "Master Bill",
    icon: "venue",
  },
  {
    id: 2,
    title: "Daily Conference Buffet",
    description: "Breakfast, Lunch, and Afternoon Tea for 450 guests.",
    route: "Master Bill",
    icon: "food",
  },
  {
    id: 3,
    title: "Personal Room Service",
    description: "In-room dining and premium minibar selections.",
    route: "Guest Folio",
    icon: "room",
  },
  {
    id: 4,
    title: "Lounge & Bar Consumption",
    description: "All alcohol and lounge service outside scheduled events.",
    route: "Guest Folio",
    icon: "bar",
  },
];

function getRuleIcon(type: Rule["icon"]) {
  if (type === "venue") return MapPin;
  if (type === "food") return Utensils;
  if (type === "room") return ConciergeBell;
  return Wine;
}

export default function SplitBillingPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules);

  const toggleRule = (id: number) => {
    setRules((currentRules) =>
      currentRules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              route: rule.route === "Master Bill" ? "Guest Folio" : "Master Bill",
            }
          : rule
      )
    );
  };

  const masterRules = rules.filter((rule) => rule.route === "Master Bill");
  const guestRules = rules.filter((rule) => rule.route === "Guest Folio");

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
          <div className="flex w-96 items-center gap-3 rounded-full border border-[#d0c5af] bg-[#f5f3ef] px-4 py-2">
            <Search size={20} className="text-[#4d4635]" />
            <input
              type="text"
              placeholder="Search event rules..."
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 transition hover:bg-[#eae8e4]">
              <Bell size={22} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="mx-2 h-8 w-px bg-[#d0c5af]" />

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold">Jameson Vanderbilt</p>
                <p className="text-[10px] uppercase tracking-wider text-[#4d4635]">
                  General Manager
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d0c5af] bg-[#131b2e] font-bold text-[#ffe088]">
                JV
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] p-8">
          <div className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <nav className="mb-2 flex gap-2 text-xs text-[#4d4635]">
                <span>Event Management</span>
                <span>/</span>
                <span className="font-bold text-[#735c00]">
                  Billing Configuration
                </span>
              </nav>

              <h1 className="text-4xl font-bold">Split Billing Rules</h1>

              <p className="mt-2 max-w-2xl text-[#4d4635]">
                Configure how automated charges are routed for the Global Tech
                Summit 2024. Define rules to separate corporate liabilities from
                personal guest expenses.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="rounded-lg border border-[#7f7663] px-6 py-3 text-sm font-bold text-[#565e74] transition hover:bg-[#eae8e4]">
                View Draft Rules
              </button>

              <button className="rounded-lg bg-[#735c00] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90">
                Publish Rules
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-8">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-semibold">
                  <Wallet size={24} className="text-[#735c00]" />
                  Routing Priority Definitions
                </h2>

                <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#554300]">
                  12 Active Rules
                </span>
              </div>

              <RuleGroup
                title="Master Event Bill"
                description="Charges routed here are billed directly to the corporate account."
                cap="$150,000.00"
                rules={masterRules}
                onToggle={toggleRule}
              />

              <RuleGroup
                title="Individual Guest Folios"
                description="Incidental charges routed to personal credit cards on file."
                rules={guestRules}
                onToggle={toggleRule}
              />
            </div>

            <aside className="col-span-12 space-y-6 xl:col-span-4">
              <section className="rounded-xl border border-[#ba1a1a]/20 bg-[#ffdad6]/40 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <AlertTriangle size={24} className="text-[#ba1a1a]" />
                  <h2 className="text-xl font-semibold text-[#ba1a1a]">
                    Unrestricted Access Alert
                  </h2>
                </div>

                <p className="mb-6 text-sm text-[#93000a]">
                  Premium Suite Services are currently defaulting to the{" "}
                  <strong>Master Bill</strong>. Corporate organizers typically
                  restrict this.
                </p>

                <button className="w-full rounded-lg bg-[#ba1a1a] py-3 text-sm font-bold text-white transition hover:bg-[#ba1a1a]/90">
                  Restrict Now
                </button>
              </section>

              <section className="rounded-xl border border-[#d0c5af] bg-[#eae8e4] p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  Billing Distribution
                </h2>

                <div className="mb-6 flex h-4 w-full overflow-hidden rounded-full bg-[#d0c5af]">
                  <div className="h-full w-[72%] bg-[#735c00]" />
                  <div className="h-full w-[28%] bg-[#565e74]" />
                </div>

                <div className="space-y-4">
                  <DistributionRow label="Corporate (Master)" value="72%" color="bg-[#735c00]" />
                  <DistributionRow label="Guest Folios" value="28%" color="bg-[#565e74]" />
                </div>

                <div className="mt-8 border-t border-[#d0c5af] pt-6">
                  <p className="mb-4 text-xs font-bold uppercase text-[#4d4635]">
                    Master Ledger Identity
                  </p>

                  <div className="flex items-center gap-4 rounded-lg bg-white/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#131b2e] text-[#d4af37]">
                      <Badge size={24} />
                    </div>

                    <div>
                      <p className="font-bold">TechCorp Global</p>
                      <p className="text-sm text-[#4d4635]">
                        Tax ID: 88-129302-1
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#d0c5af] bg-[#131b2e] p-6 text-white shadow-md">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                  Elite Concierge
                </p>
                <h2 className="text-xl font-semibold leading-tight">
                  Managing guest expectations through clear billing.
                </h2>
              </section>
            </aside>
          </div>

          <section className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d0c5af] bg-[#f5f3ef]/40 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <PlusCircle size={34} className="text-[#735c00]" />
            </div>

            <h2 className="text-2xl font-semibold">
              Need a custom routing rule?
            </h2>

            <p className="mb-8 mt-2 max-w-lg text-[#4d4635]">
              Create complex logic based on room types, VIP status, or specific
              GL codes for your accounting system integration.
            </p>

            <button className="rounded-xl bg-[#bec6e0] px-8 py-4 font-bold text-[#131b2e] transition hover:bg-[#dae2fd]">
              Add Advanced Rule
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}

function RuleGroup({
  title,
  description,
  cap,
  rules,
  onToggle,
}: {
  title: string;
  description: string;
  cap?: string;
  rules: Rule[];
  onToggle: (id: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d0c5af] bg-[#f5f3ef]/60 p-6">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-[#4d4635]">{description}</p>
        </div>

        {cap && (
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-[#4d4635]">
              Current Cap
            </p>
            <p className="font-bold text-[#735c00]">{cap}</p>
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}

function RuleCard({
  rule,
  onToggle,
}: {
  rule: Rule;
  onToggle: (id: number) => void;
}) {
  const Icon = getRuleIcon(rule.icon);
  const isMaster = rule.route === "Master Bill";

  return (
    <article className="rule-card-hover flex items-center gap-6 rounded-lg border border-[#d0c5af] bg-white p-5">
      <div
        className={`h-12 w-1 rounded-full ${
          isMaster ? "bg-[#735c00]" : "bg-[#565e74] opacity-30"
        }`}
      />

      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Icon size={18} className="text-[#4d4635]" />
          <h4 className="text-sm font-bold">{rule.title}</h4>
        </div>

        <p className="text-sm text-[#4d4635]">{rule.description}</p>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase text-[#4d4635]">
            Routing
          </span>
          <span
            className={`font-bold ${
              isMaster ? "text-[#735c00]" : "text-[#565e74]"
            }`}
          >
            {rule.route}
          </span>
        </div>

        <button
          onClick={() => onToggle(rule.id)}
          className={`relative h-6 w-11 rounded-full transition ${
            isMaster ? "bg-[#735c00]" : "bg-[#e4e2de]"
          }`}
        >
          <span
            className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition ${
              isMaster ? "left-[22px]" : "left-[2px]"
            }`}
          />
        </button>
      </div>
    </article>
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm font-bold">{label}</span>
      </div>

      <span className="font-bold">{value}</span>
    </div>
  );
}