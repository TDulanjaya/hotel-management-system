"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboardByRole, saveAuth } from "@/utils/auth";
import { login } from "@/lib/api/authApi";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("owner@luxestay.com");
  const [password, setPassword] = useState("Owner12345");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] px-6 text-[#1b1c1a]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-[#d0c5af] bg-white p-8 shadow-xl"
      >
        <h1 className="text-4xl font-extrabold text-[#735c00]">LuxeStay</h1>

        <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#4d4635]">
          Staff Login
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-[#ffdad6] p-3 text-sm font-bold text-[#ba1a1a]">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold text-[#4d4635]">Email</label>
            <input
              type="email"
              value={email}
              className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4d4635]">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8a8175] transition-colors hover:text-[#4d4635]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>


        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-[#735c00] py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
        >
          Login
        </button>
      </form>
    </main>
  );
}