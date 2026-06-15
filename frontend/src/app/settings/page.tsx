"use client";

import { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  Search,
  Bell,
  Hotel,
  DoorOpen,
  Percent,
  Wallet,
  BellRing,
  Shield,
  CloudSync,
  Palette,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

const categories = [
  { name: "Hotel Profile", icon: Hotel, active: true },
  { name: "Room Types", icon: DoorOpen },
  { name: "Tax Settings", icon: Percent },
  { name: "Payment Gateways", icon: Wallet },
  { name: "Notifications", icon: BellRing },
  { name: "Security", icon: Shield },
  { name: "Backup", icon: CloudSync },
  { name: "Theme Customization", icon: Palette },
];

const preferences = [
  {
    title: "Auto-Nights Audit",
    description: "Automatically close the day at 2:00 AM",
    enabled: true,
  },
  {
    title: "Smart Overbooking",
    description: "Allow 2% variance on standard rooms",
    enabled: false,
  },
  {
    title: "Guest Self Check-in",
    description: "Enable digital keys via the mobile app",
    enabled: true,
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState(preferences);
  const [toastOpen, setToastOpen] = useState(false);

  const handleSave = () => {
    setToastOpen(true);

    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };

  const togglePreference = (index: number) => {
    setToggles((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#fbf9f5] px-8">
          <div className="relative w-full max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
            />

            <input
              type="text"
              placeholder="Search settings or tools..."
              className="w-full rounded-lg border-none bg-[#f5f3ef] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative rounded-full p-2 transition hover:bg-[#eae8e4]">
              <Bell size={22} className="text-[#4d4635]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="flex items-center gap-3 border-l border-[#d0c5af] pl-4">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold">Julian Voss</p>
                <p className="text-xs text-[#4d4635]">General Manager</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
                JV
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] px-8 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">System Settings</h1>

            <p className="mt-2 max-w-2xl text-[#4d4635]">
              Configure global operational parameters, regional compliance, and
              system-wide aesthetics for the LuxeStay platform.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 lg:col-span-3">
              <div className="settings-card sticky top-24 p-2">
                <nav className="flex flex-col space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <button
                        key={category.name}
                        className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold transition ${
                          category.active
                            ? "bg-[#d4af37]/20 text-[#735c00]"
                            : "text-[#4d4635] hover:bg-[#eae8e4]"
                        }`}
                      >
                        <Icon size={20} />
                        {category.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="col-span-12 space-y-6 lg:col-span-9">
              <section className="settings-card border-l-4 border-l-[#735c00]">
                <div className="flex items-center justify-between border-b border-[#d0c5af] px-8 py-6">
                  <div>
                    <h2 className="text-xl font-semibold">Hotel Profile</h2>
                    <p className="text-sm text-[#4d4635]">
                      Basic identification and contact details for the property.
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-[#735c00] px-6 py-2 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormInput
                      label="Property Name"
                      defaultValue="LuxeStay Elite Paris"
                    />

                    <FormInput
                      label="Official Website"
                      type="url"
                      defaultValue="https://luxestay.com/paris"
                    />

                    <div className="space-y-2 md:col-span-2">
                      <label className="ml-1 text-sm font-bold">
                        Physical Address
                      </label>

                      <textarea
                        rows={3}
                        defaultValue="15 Avenue Montaigne, 75008 Paris, France"
                        className="w-full rounded-lg border border-[#d0c5af] bg-[#f5f3ef] p-3 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                      />
                    </div>

                    <FormInput
                      label="Property Tax ID (VAT)"
                      defaultValue="FR 99 123456789"
                    />

                    <FormInput
                      label="Business Registration"
                      defaultValue="RCS Paris B 123 456 789"
                    />
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="settings-card border-l-4 border-l-[#131b2e] p-8">
                  <h2 className="mb-2 text-xl font-semibold">
                    System Preferences
                  </h2>

                  <p className="mb-6 text-sm text-[#4d4635]">
                    Automated triggers and operational behaviors.
                  </p>

                  <div className="space-y-6">
                    {toggles.map((preference, index) => (
                      <div
                        key={preference.title}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-bold">
                            {preference.title}
                          </p>
                          <p className="text-xs text-[#4d4635]">
                            {preference.description}
                          </p>
                        </div>

                        <button
                          onClick={() => togglePreference(index)}
                          className={`relative h-6 w-11 rounded-full transition ${
                            preference.enabled
                              ? "bg-[#735c00]"
                              : "bg-[#e4e2de]"
                          }`}
                        >
                          <span
                            className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition ${
                              preference.enabled ? "left-[22px]" : "left-[2px]"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-card p-8">
                  <h2 className="mb-2 text-xl font-semibold">
                    Regional Controls
                  </h2>

                  <p className="mb-6 text-sm text-[#4d4635]">
                    Localization for billing and reporting.
                  </p>

                  <div className="space-y-4">
                    <SelectInput
                      label="System Currency"
                      options={[
                        "Euro (EUR) - €",
                        "US Dollar (USD) - $",
                        "British Pound (GBP) - £",
                      ]}
                    />

                    <SelectInput
                      label="Time Zone"
                      options={[
                        "(GMT+01:00) Central European Time",
                        "(GMT+00:00) Western European Time",
                      ]}
                    />

                    <SelectInput
                      label="Primary Language"
                      options={["English (UK)", "French (FR)", "German (DE)"]}
                    />
                  </div>
                </div>
              </section>

              <section className="settings-card bg-[#131b2e] p-8 text-white">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-[#735c00]/20 p-3">
                      <ShieldCheck size={34} className="text-[#d4af37]" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        Security Infrastructure
                      </h2>
                      <p className="text-sm text-white/60">
                        Manage API access tokens and enterprise-grade encryption
                        settings.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button className="rounded-lg border border-white/20 px-6 py-2 text-sm font-bold transition hover:bg-white/5">
                      Audit Logs
                    </button>

                    <button className="rounded-lg bg-[#735c00] px-6 py-2 text-sm font-bold text-white transition hover:opacity-90">
                      Configure IAM
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <div
        className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 ${
          toastOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-[#d4af37]/30 bg-[#131b2e] px-6 py-4 text-white shadow-2xl">
          <CheckCircle size={24} className="text-[#d4af37]" />

          <div>
            <p className="text-sm font-bold">Settings updated</p>
            <p className="text-xs opacity-70">
              Property profile synchronized successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  defaultValue,
}: {
  label: string;
  type?: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-sm font-bold">{label}</label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-[#d0c5af] bg-[#f5f3ef] p-3 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
      />
    </div>
  );
}

function SelectInput({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-[#4d4635]">{label}</label>

      <select className="w-full rounded-lg border border-[#d0c5af] bg-[#f5f3ef] p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}