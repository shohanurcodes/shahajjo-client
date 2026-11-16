import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";

interface AuthShellProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  image: string;
  imageAlt: string;
  quote: string;
  quoteBy: string;
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  image,
  imageAlt,
  quote,
  quoteBy,
}: AuthShellProps) {
  return (
    <section className="site-container py-10 lg:py-16">
      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to home
        </Link>
      </div>

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-[0_30px_90px_-60px_rgba(20,50,35,0.6)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-md mt-4">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          <div className="mt-7 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>

        <aside className="relative hidden min-h-[36rem] overflow-hidden lg:block">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.03_160/0.95)] via-[oklch(0.2_0.03_160/0.35)] to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-6 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/80">
            <Sparkles className="size-3.5 text-[var(--terracotta)]" />
            Sahajjo community
          </div>

          <figure className="absolute inset-x-0 bottom-0 p-7">
            <blockquote className="font-heading text-2xl font-medium leading-snug text-white">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-medium text-white/65">
              {quoteBy}
            </figcaption>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <Heart className="size-4 text-[var(--terracotta)]" />
                <p className="mt-2 text-xs font-semibold text-white">Built around care</p>
                <p className="mt-0.5 text-[0.68rem] leading-relaxed text-white/60">
                  Every event is created by a real neighbour.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <ShieldCheck className="size-4 text-[var(--terracotta)]" />
                <p className="mt-2 text-xs font-semibold text-white">Safe & simple</p>
                <p className="mt-0.5 text-[0.68rem] leading-relaxed text-white/60">
                  Your details are only used to organise events.
                </p>
              </div>
            </div>
          </figure>
        </aside>
      </div>
    </section>
  );
}
