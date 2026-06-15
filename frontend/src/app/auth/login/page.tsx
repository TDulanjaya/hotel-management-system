"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle,
  ChevronDown,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  LogIn,
  Mail,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState("staff");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState(false);
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success">(
    "idle"
  );
  const [bgMove, setBgMove] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    setBgMove({ x, y });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.includes("error")) {
      setError(true);
      setLoginState("idle");
      return;
    }

    setError(false);
    setLoginState("loading");

    setTimeout(() => {
      setLoginState("success");
    }, 1500);

    console.log({
      role,
      email,
      password,
      rememberDevice,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf9f5]"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury hotel lobby"
          className="h-full w-full object-cover opacity-40 blur-[2px] grayscale-[20%] transition-transform duration-300"
          style={{
            transform: `translateX(${bgMove.x}px) translateY(${bgMove.y}px) scale(1.05)`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-[#fbf9f5] via-[#fbf9f5]/60 to-transparent" />
      </div>

      {/* Main Content */}
      <main className="z-10 grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-2">
        {/* Left Side */}
        <section className="hidden flex-col space-y-6 lg:flex">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d4af37] text-[#554300]">
              <Building2 size={32} />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#1b1c1a]">
              LuxeStay
            </h1>
          </div>

          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-[#735c00]">
              Operations Suite
            </h2>

            <p className="text-base leading-relaxed text-[#4d4635]">
              Experience institutional luxury through seamless property
              management. Access the global dashboard to oversee reservations,
              guest services, and back-of-house operations.
            </p>
          </div>

          <div className="flex w-fit items-center gap-8 border-t border-[#d0c5af] pt-6">
            <div>
              <p className="text-sm font-semibold text-[#735c00]">99.9%</p>
              <p className="text-xs font-medium uppercase tracking-widest text-[#4d4635]">
                Uptime Rate
              </p>
            </div>

            <div className="h-8 w-px bg-[#d0c5af]" />

            <div>
              <p className="text-sm font-semibold text-[#735c00]">Global</p>
              <p className="text-xs font-medium uppercase tracking-widest text-[#4d4635]">
                Standard
              </p>
            </div>
          </div>
        </section>

        {/* Login Card */}
        <section className="flex justify-center lg:justify-end">
          <div className="login-card glass-effect relative w-full max-w-[480px] rounded-xl border border-[#d0c5af]/30 p-10 shadow-2xl">
            <div className="absolute bottom-12 left-0 top-12 w-1 rounded-r-full bg-[#d4af37]" />

            <div className="mb-8">
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <Building2 size={32} className="text-[#735c00]" />
                <span className="text-xl font-bold text-[#1b1c1a]">
                  LuxeStay
                </span>
              </div>

              <h3 className="mb-2 text-2xl font-semibold text-[#1b1c1a]">
                Staff Login
              </h3>

              <p className="text-sm leading-relaxed text-[#4d4635]">
                Please enter your credentials to access the suite.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex animate-bounce items-center gap-3 rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6] p-4 text-[#93000a]">
                <ShieldAlert size={20} />
                <p className="text-sm font-semibold">
                  Invalid credentials. Please try again.
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role */}
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="ml-1 text-sm font-semibold text-[#4d4635]"
                >
                  Account Role
                </label>

                <div className="relative">
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-[#d0c5af] bg-white px-4 pr-10 text-sm text-[#1b1c1a] transition-all focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  >
                    <option value="staff">Staff Member</option>
                    <option value="manager">Property Manager</option>
                    <option value="owner">Property Owner</option>
                  </select>

                  <ChevronDown
                    size={20}
                    className="pointer-events-none absolute right-3 top-3.5 text-[#4d4635]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="ml-1 text-sm font-semibold text-[#4d4635]"
                >
                  Professional Email
                </label>

                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@luxestay.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-lg border border-[#d0c5af] bg-white pl-11 pr-4 text-sm text-[#1b1c1a] transition-all focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  />

                  <Mail
                    size={20}
                    className="absolute left-3 top-3.5 text-[#4d4635]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="ml-1 text-sm font-semibold text-[#4d4635]"
                >
                  Security Key
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-lg border border-[#d0c5af] bg-white pl-11 pr-12 text-sm text-[#1b1c1a] transition-all focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  />

                  <Lock
                    size={20}
                    className="absolute left-3 top-3.5 text-[#4d4635]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#4d4635] transition hover:text-[#735c00]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between py-2">
                <label className="group flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="h-4 w-4 rounded border-[#d0c5af] text-[#735c00] focus:ring-[#d4af37]"
                  />

                  <span className="text-xs font-medium text-[#4d4635] transition group-hover:text-[#1b1c1a]">
                    Remember device
                  </span>
                </label>

                <a
                  href="#"
                  className="text-xs font-medium text-[#735c00] underline-offset-4 hover:underline"
                >
                  Forgot key?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loginState === "loading"}
                className={`btn-primary-hover flex h-14 w-full items-center justify-center gap-2 rounded-lg font-semibold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-80 ${
                  loginState === "success"
                    ? "bg-[#a8b3ca] text-[#3a4559]"
                    : "bg-[#d4af37] text-[#554300]"
                }`}
              >
                {loginState === "idle" && (
                  <>
                    Secure Login
                    <LogIn size={20} />
                  </>
                )}

                {loginState === "loading" && (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Validating...
                  </>
                )}

                {loginState === "success" && (
                  <>
                    <CheckCircle size={20} />
                    Access Granted
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#d0c5af]/30 pt-8 sm:flex-row">
              <p className="text-xs font-medium text-[#4d4635]">
                © 2024 LuxeStay Operations
              </p>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs font-medium text-[#4d4635] transition hover:text-[#735c00]"
                >
                  <HelpCircle size={14} />
                  Support
                </a>

                <a
                  href="#"
                  className="text-xs font-medium text-[#4d4635] transition hover:text-[#735c00]"
                >
                  Legal
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}