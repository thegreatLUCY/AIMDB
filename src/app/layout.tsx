import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "AIMDb — The AI Movie Database",
  description: "A browsable database of movies that don't exist.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-border text-fg-muted text-xs text-center py-6">
          Every movie, person, and review on this site is AI-generated. None of them are real.
        </footer>
      </body>
    </html>
  );
}
