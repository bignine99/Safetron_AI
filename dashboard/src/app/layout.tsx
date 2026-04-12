import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SAFETY AI | Construction Safety Dashboard",
  description: "Advanced Construction Safety Data Intelligence & Risk Analysis Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-root)' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'hidden', background: 'var(--bg-root)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
