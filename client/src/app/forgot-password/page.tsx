"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setSent(true);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b0d] px-6 py-10 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
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
            Password Recovery
          </p>

          <div className="mx-auto mt-5 h-[2px] w-16 bg-[#9b7600]" />
        </div>

        {!sent ? (
          <>
            <p className="mt-8 text-center text-sm leading-relaxed text-[#4b4438]">
              Enter your staff email address. The IT support team will help you
              reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">Email</label>

                <div className="flex items-center gap-3 rounded-xl border border-[#d8c8a8] bg-white px-4 py-4 shadow-sm">
                  <Mail className="h-5 w-5 text-[#9b7600]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-base outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#9b7600] px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#7f6100]"
              >
                Request Password Reset
              </button>
            </form>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#d3a13b]/40 bg-[#fff8e8] p-6 text-center">
            <h3 className="text-xl font-bold text-[#5d4613]">
              Request Sent
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#4b4438]">
              Password reset request has been noted for:
            </p>

            <p className="mt-2 font-bold text-[#9b7600]">{email}</p>

            <p className="mt-4 text-sm leading-relaxed text-[#4b4438]">
              Please contact IT Support if you need urgent access.
            </p>

            <div className="mt-5 rounded-xl bg-white p-4 text-sm text-[#4b4438]">
              <p>
                Email:{" "}
                <span className="font-bold text-[#9b7600]">
                  it.support@camelliareserve.com
                </span>
              </p>
              <p className="mt-1">
                Phone:{" "}
                <span className="font-bold text-[#9b7600]">
                  +94 11 234 5678
                </span>
              </p>
            </div>
          </div>
        )}

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