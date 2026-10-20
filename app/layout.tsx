import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sagar Singh Thapa - Data Science & Web Portfolio",
  description: "Portfolio of Sagar Singh Thapa, a Computer Science undergraduate specializing in Data Science, Machine Learning, and Web Development.",
  keywords: ["Data Science", "Machine Learning", "Web Development", "Python", "React", "Next.js", "Portfolio", "Sagar Singh Thapa"],
  authors: [{ name: "Sagar Singh Thapa" }],
  openGraph: {
    title: "Sagar Singh Thapa - Data Science & Web Portfolio",
    description: "Portfolio of Sagar Singh Thapa, a Computer Science undergraduate specializing in Data Science, Machine Learning, and Web Development.",
    url: "https://sagarsinghthapa.com", // Placeholder domain
    siteName: "Sagar Singh Thapa Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagar Singh Thapa - Portfolio",
    description: "Data Science, Machine Learning, and Web Development Portfolio.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-gray-950 text-gray-100 transition-colors duration-300"
      >
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
        <AIChatBot />
      </body>
    </html>
  );
}
