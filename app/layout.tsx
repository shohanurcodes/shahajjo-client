import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Sahajjo — Show up for your neighbourhood",
    template: "%s | Sahajjo",
  },
  description:
    "Sahajjo is a community-driven platform for creating, joining and managing social service events across Dhaka — cleanups, plantation drives, donations and winter relief.",
  keywords: [
    "social service events",
    "volunteer Dhaka",
    "community service",
    "cleanup drive",
    "plantation",
    "winter clothes distribution",
  ],
  openGraph: {
    title: "Sahajjo — Show up for your neighbourhood",
    description:
      "Find a cleanup, start a winter drive, and turn a free Saturday into something that lasts.",
    url: appUrl,
    siteName: "Sahajjo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahajjo — Show up for your neighbourhood",
    description:
      "Community-led cleanups, plantation drives and donation events across Dhaka.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
