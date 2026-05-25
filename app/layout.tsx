import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/app/actions/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Watchlist",
  description: "Track and discover your favorite movies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-gray-50/50">
          <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-xl tracking-tight">
                Movie<span className="text-blue-600">Sync</span>
              </Link>
              <nav className="hidden sm:flex gap-4 text-sm font-medium text-gray-600">
                <Link href="/" className="hover:text-black">Home</Link>
                <Link href="/movies" className="hover:text-black">Movies</Link>
                <Link href="/about" className="hover:text-black">About</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="hover:text-black">My Watchlist</Link>
                  <Link href="/profile" className="hover:text-black">Profile</Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-black">Login</Link>
                  <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>

        <footer className="border-t py-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Movie Watchlist. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
