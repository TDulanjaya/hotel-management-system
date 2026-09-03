"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Sparkles } from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/auth`;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!token.trim()) {
      setMessage("Reset token is required.");
      return;
    }

    if (!newPassword.trim()) {
      setMessage("New password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setMessage(data.message || "Password reset successfully.");
      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (error: any) {
      setMessage(error.message || "Something went wrong.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b0d] px-6 py-10 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.webp')",
        }}
      />

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/70" />

      <section className="relative z-10 w-full max-w-xl rounded-[2rem] border border-[#d3a13b]/30 bg-white/95 px-8 py-10 text-[#29241c] shadow-2xl backdrop-blur-md md:px-12">
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-[#9b7600]" />

          <h1 className="mt-5 font-serif text-4xl font-semibold tracking-[0.15em] text-[#5d4613]">
            The Camellia
          </h1>

          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-[0.18em] text-[#5d4613]">
            Reserve
          </h2>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.45em] text-[#3f3a31]">
            Reset Password
          </p>

          <div className="mx-auto mt-5 h-[2px] w-16 bg-[#9b7600]" />
        </div>

        <p className="mt-8 text-center text-sm leading-relaxed text-[#4b4438]">
          Enter your reset token and create a new password.
        </p>

        {message && (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-5 rounded-xl border px-4 py-3 text-center text-sm font-bold ${
              success
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold">Reset Token</label>

            <div className="flex items-center gap-3 rounded-xl border border-[#d8c8a8] bg-white px-4 py-4 shadow-sm">
              <Lock className="h-5 w-5 text-[#9b7600]" />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste reset token"
                className="w-full bg-transparent text-base outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              New Password
            </label>

            <div className="relative flex items-center gap-3 rounded-xl border border-[#d8c8a8] bg-white px-4 py-4 shadow-sm">
              <Lock className="h-5 w-5 text-[#9b7600]" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-transparent pr-10 text-base outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-4 text-[#9b7600]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Confirm Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#d8c8a8] bg-white px-4 py-4 shadow-sm">
              <Lock className="h-5 w-5 text-[#9b7600]" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-transparent text-base outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#9b7600] px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#7f6100] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-[#9b7600] transition hover:text-[#5d4613]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </section>
    </main>
  );
}