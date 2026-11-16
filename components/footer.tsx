import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M14.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.62A22 22 0 0 0 15.29 3.5c-2.4 0-4.04 1.46-4.04 4.15V9.9H8.5V13h2.75v8h3.25Z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Upcoming events", href: "/events" },
      { label: "Create an event", href: "/create-event" },
      { label: "Joined events", href: "/joined-events" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Become a volunteer", href: "/register" },
      { label: "Manage your events", href: "/manage-events" },
      { label: "My profile", href: "/profile" },
      { label: "Host a drive", href: "/create-event" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[oklch(0.235_0.03_160)] text-[oklch(0.93_0.012_145)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[oklch(0.64_0.138_47/0.22)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full bg-[oklch(0.55_0.08_160/0.28)] blur-3xl"
      />

      <div className="site-container relative py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Logo className="[&_span.text-muted-foreground]:text-[oklch(0.75_0.02_150)] [&_span.font-heading]:text-[oklch(0.97_0.01_90)]" />
            <p className="mt-5 text-sm leading-relaxed text-[oklch(0.78_0.015_150)]">
              A neighbourhood-first platform for the people who show up. Find a
              cleanup, start a winter drive, and turn a free Saturday into
              something that lasts.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Sahajjo on X"
                className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <XLogo className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Sahajjo on Instagram"
                className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <InstagramLogo className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Sahajjo on Facebook"
                className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <FacebookLogo className="size-4" />
              </a>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[oklch(0.72_0.02_150)]">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-[oklch(0.84_0.012_150)] transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[oklch(0.72_0.02_150)]">
              Say hello
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[oklch(0.84_0.012_150)]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--terracotta)]" />
                Mirpur 10, Dhaka 1216
              </li>
              <li>
                <a
                  href="mailto:hello@sahajjo.org"
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-[var(--terracotta)]" />
                  hello@sahajjo.org
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="size-4 shrink-0 text-[var(--terracotta)]" />
                  +880 1700 000 000
                </a>
              </li>
            </ul>
            <Link
              href="/register"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--terracotta)] underline-offset-4 hover:underline"
            >
              Join the next drive
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[oklch(0.7_0.015_150)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sahajjo. Built by neighbours, for neighbours.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-[var(--terracotta)]" />
            Community-led · Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
