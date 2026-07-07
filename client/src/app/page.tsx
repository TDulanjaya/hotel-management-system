import Link from "next/link";
import { 
  Building2, 
  CalendarDays, 
  Utensils, 
  PackageSearch,
  Car,
  CreditCard,
  Users
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Building2 className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Rooms & Reservations",
      description: "Manage bookings, room status, and guest folios in real-time."
    },
    {
      icon: <Utensils className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Restaurant & Kitchen",
      description: "Seamlessly connect front-of-house orders with kitchen operations and recipes."
    },
    {
      icon: <CalendarDays className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Events & Venues",
      description: "Coordinate large-scale events, venue scheduling, and bespoke packages."
    },
    {
      icon: <PackageSearch className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Inventory",
      description: "Track supplies across all departments with automated alerts."
    },
    {
      icon: <Car className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Parking & Transport",
      description: "Valet management, parking reservations, and transport scheduling."
    },
    {
      icon: <CreditCard className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Payments & Pricing",
      description: "Dynamic pricing algorithms and comprehensive payment tracking."
    },
    {
      icon: <Users className="mb-4 h-8 w-8 text-[#d4af37]" />,
      title: "Staff Roles",
      description: "Role-based access control for operations, management, and owners."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3 text-white">
          <Building2 size={32} className="text-[#d4af37]" />
          <span className="text-xl font-bold tracking-widest uppercase">LuxeStay</span>
        </div>

      </header>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center pt-48 pb-32 px-6 text-center lg:pt-64">
        {/* Glow effects */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-[120px]" />
        
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
          Institutional Luxury Management
        </p>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
          The Global Standard for <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f6d36b]">
            Hotel Operations
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
          A full-stack, unified operations suite designed exclusively for the LuxeStay network. Oversee reservations, restaurant workflows, back-of-house inventory, and guest services from a single institutional dashboard.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link 
            href="/login"
            className="rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-slate-200"
          >
            Access Dashboard
          </Link>
        </div>
      </main>

      {/* Modules Section */}
      <section className="border-t border-slate-800/50 bg-slate-900/50 py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Integrated Modules</h2>
            <p className="mt-4 text-slate-400">Everything you need to run a world-class property.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group rounded-3xl border border-slate-800 bg-slate-950/50 p-8 transition-all hover:border-[#d4af37]/50 hover:bg-slate-900"
              >
                {feature.icon}
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} LuxeStay Hotels & Resorts. Internal Operations Suite.</p>
      </footer>
    </div>
  );
}
