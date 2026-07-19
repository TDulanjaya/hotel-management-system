"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDashboardByRole, saveAuth } from "@/utils/auth";
import { login } from "@/lib/api/authApi";
import { Eye, EyeOff, Lock, Sparkles, UserRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("owner@luxestay.com");
  const [password, setPassword] = useState("Owner12345");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const data = await login(email, password);
      saveAuth(data.token, data.user);
      router.push(getDashboardByRole(data.user.role));
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 text-[#241a00]">
      {/* Background Image */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat animate-[slowZoom_18s_ease-in-out_infinite_alternate]"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
        }}
      />

      {/* Luxury dark layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/20 to-black/55" />

      {/* Soft golden glow decorations */}
      <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-[#d4af37]/20 blur-3xl animate-[floatGlow_7s_ease-in-out_infinite]" />
      <div className="absolute bottom-[10%] right-[10%] h-52 w-52 rounded-full bg-[#f6d36b]/20 blur-3xl animate-[floatGlow_9s_ease-in-out_infinite_reverse]" />

      {/* Floating small particles */}
      <span className="absolute left-[18%] top-[22%] h-2 w-2 rounded-full bg-[#f7d66b]/70 shadow-[0_0_18px_#f7d66b] animate-[particleFloat_6s_ease-in-out_infinite]" />
      <span className="absolute right-[22%] top-[18%] h-2 w-2 rounded-full bg-[#f7d66b]/70 shadow-[0_0_18px_#f7d66b] animate-[particleFloat_7s_ease-in-out_infinite_1s]" />
      <span className="absolute bottom-[22%] left-[26%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_16px_white] animate-[particleFloat_8s_ease-in-out_infinite_0.5s]" />
      <span className="absolute bottom-[18%] right-[28%] h-1.5 w-1.5 rounded-full bg-[#f7d66b]/80 shadow-[0_0_18px_#f7d66b] animate-[particleFloat_6.5s_ease-in-out_infinite_1.5s]" />

      {/* Decorative glass ring */}
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-[1px] animate-[spinSlow_28s_linear_infinite]" />
      <div className="absolute -right-20 top-16 h-64 w-64 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 blur-[1px] animate-[spinSlow_32s_linear_infinite_reverse]" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[30px] border border-white/70 bg-white/90 px-10 py-9 shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-[cardEntrance_0.9s_ease-out_both] md:px-12"
      >
        {/* Card shine */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 to-transparent" />
        <div className="pointer-events-none absolute -left-28 top-0 h-full w-24 rotate-12 bg-white/35 blur-xl animate-[shineMove_5s_ease-in-out_infinite]" />

        {/* Top corner flower decoration */}
        <div className="pointer-events-none absolute right-5 top-3 text-[110px] leading-none text-[#d8cdbb]/45 animate-[flowerPulse_4s_ease-in-out_infinite]">
          ✽
        </div>

        {/* Small sparkle */}
        <div className="absolute left-8 top-8 text-[#b18a08]/40 animate-[sparklePulse_2.8s_ease-in-out_infinite]">
          <Sparkles size={26} />
        </div>

        {/* Logo / Brand */}
        <div className="relative text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center text-[#806300] animate-[logoFloat_4s_ease-in-out_infinite]">
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full drop-shadow-[0_8px_14px_rgba(128,99,0,0.25)]"
            >
              <path
                d="M60 12C68 31 68 49 60 60C52 49 52 31 60 12Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M60 108C52 89 52 71 60 60C68 71 68 89 60 108Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M12 60C31 52 49 52 60 60C49 68 31 68 12 60Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M108 60C89 68 71 68 60 60C71 52 89 52 108 60Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M26 26C45 33 56 46 60 60C46 56 33 45 26 26Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M94 94C75 87 64 74 60 60C74 64 87 75 94 94Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M94 26C87 45 74 56 60 60C64 46 75 33 94 26Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M26 94C33 75 46 64 60 60C56 74 45 87 26 94Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <circle
                cx="60"
                cy="60"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>

          <h1 className="font-serif text-4xl tracking-[0.14em] text-[#5d4613] animate-[fadeUp_0.8s_ease-out_0.15s_both]">
            The Camellia
          </h1>

          <h2 className="mt-1 font-serif text-4xl tracking-[0.18em] text-[#5d4613] animate-[fadeUp_0.8s_ease-out_0.2s_both]">
            Reserve
          </h2>

          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.45em] text-[#3f3a31] animate-[fadeUp_0.8s_ease-out_0.25s_both]">
            Hotel & Resort
          </p>

          <div className="mx-auto mt-5 h-[2px] w-12 bg-[#9b7a12] animate-[lineGrow_0.9s_ease-out_0.35s_both]" />

          <p className="mt-6 text-lg font-semibold uppercase tracking-[0.45em] text-[#2f2f2f] animate-[fadeUp_0.8s_ease-out_0.45s_both]">
            Staff Login
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700 animate-[shake_0.35s_ease-in-out]"
          >
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="mt-7 space-y-5">
          <div className="animate-[fadeUp_0.8s_ease-out_0.55s_both]">
            <label className="text-sm font-semibold text-[#1f1f1f]">
              Email
            </label>

            <div className="group relative mt-2">
              <UserRound
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a6a08] transition group-focus-within:scale-110 group-focus-within:text-[#5d4613]"
              />

              <input
                type="email"
                value={email}
                className="h-14 w-full rounded-xl border border-[#d6c8b4] bg-white/75 pl-14 pr-4 text-base text-[#1f1f1f] shadow-sm outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[#9b7a12] focus:bg-white focus:shadow-lg focus:shadow-[#d4af37]/10 focus:ring-4 focus:ring-[#d4af37]/20"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="animate-[fadeUp_0.8s_ease-out_0.65s_both]">
            <label className="text-sm font-semibold text-[#1f1f1f]">
              Password
            </label>

            <div className="group relative mt-2">
              <Lock
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a6a08] transition group-focus-within:scale-110 group-focus-within:text-[#5d4613]"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="h-14 w-full rounded-xl border border-[#d6c8b4] bg-white/75 pl-14 pr-14 text-base text-[#1f1f1f] shadow-sm outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[#9b7a12] focus:bg-white focus:shadow-lg focus:shadow-[#d4af37]/10 focus:ring-4 focus:ring-[#d4af37]/20"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8a6a08] transition hover:scale-110 hover:text-[#4d3900]"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="relative mt-7 h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7a5b00] via-[#9b7a12] to-[#7a5b00] text-lg font-bold text-white shadow-lg shadow-[#7a5b00]/25 transition duration-300 animate-[fadeUp_0.8s_ease-out_0.75s_both] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7a5b00]/35 active:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 hover:translate-x-full" />
          <span className="relative">Login</span>
        </button>

        {/* Remember / Forgot */}
        <div className="mt-5 flex items-center justify-between text-sm animate-[fadeUp_0.8s_ease-out_0.85s_both]">
          <label className="flex cursor-pointer items-center gap-3 text-[#2f2f2f]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 rounded border-[#c9b99e] text-[#8d6b00] focus:ring-[#d4af37]"
            />
            Remember me
          </label>

          <button
  type="button"
  onClick={() => router.push("/forgot-password")}
  className="font-medium text-[#806300] transition hover:text-[#4d3900] hover:underline"
>
  Forgot Password?
</button>
        </div>

        {/* Bottom hotel line art */}
        <div className="pointer-events-none mt-8 opacity-25 animate-[fadeUp_0.9s_ease-out_0.95s_both]">
          <svg
            viewBox="0 0 520 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full text-[#b89b72]"
          >
            <path
              d="M15 75H505"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M70 75V35H140V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M95 75V55H115V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M165 75V25H255V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M190 75V52H230V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M280 75V38H390V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M315 75V55H355V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M410 75V45H465V75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M40 75C42 55 48 43 60 34"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M60 34C50 36 43 39 36 48"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M60 34C63 45 64 58 62 75"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M485 75C483 55 477 43 465 34"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M465 34C475 36 482 39 489 48"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M465 34C462 45 461 58 463 75"
              stroke="currentColor"
              strokeWidth="2"
            />
            {[90, 120, 185, 220, 305, 340, 430].map((x) => (
              <rect
                key={x}
                x={x}
                y="42"
                width="12"
                height="12"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </form>

      <style jsx global>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.12);
          }
        }

        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(34px) scale(0.96);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lineGrow {
          0% {
            opacity: 0;
            width: 0;
          }
          100% {
            opacity: 1;
            width: 3rem;
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) rotate(2deg);
          }
        }

        @keyframes flowerPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.08) rotate(8deg);
          }
        }

        @keyframes sparklePulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.15) rotate(15deg);
          }
        }

        @keyframes floatGlow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.55;
          }
          50% {
            transform: translateY(-24px) translateX(14px);
            opacity: 0.85;
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-34px) scale(1.25);
            opacity: 0.95;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shineMove {
          0% {
            transform: translateX(-120px) rotate(12deg);
            opacity: 0;
          }
          35% {
            opacity: 0.45;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: translateX(760px) rotate(12deg);
            opacity: 0;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          50% {
            transform: translateX(6px);
          }
          75% {
            transform: translateX(-4px);
          }
        }
      `}</style>
    </main>
  );
}