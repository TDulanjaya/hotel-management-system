import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "LuxeStay Operations Suite",
  description: "Hotel Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}