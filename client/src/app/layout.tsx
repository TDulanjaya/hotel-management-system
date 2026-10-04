import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "The Camellia Reserve — Operations Suite",
  description: "The Camellia Reserve Hotel & Resort — Staff Operations Portal",
  icons: {
    icon: "/camellia-logo.png",
    apple: "/camellia-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}