"use client";

import { useState } from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    // The brief only asks for the design; this is a friendly local confirmation.
    window.setTimeout(() => {
      toast.success("You're on the list. One good thing, every other Friday.");
      setEmail("");
      setSubmitting(false);
    }, 450);
  }

  return (
    <section id="newsletter" className="section-pad pt-0">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] bg-[oklch(0.29_0.045_160)] px-6 py-12 text-[oklch(0.96_0.01_90)] shadow-[0_30px_80px_-50px_rgba(20,50,35,0.8)] sm:px-10 md:px-14 lg:py-16">
          <div aria-hidden="true" className="paper-grid absolute inset-0 opacity-[0.09]" />
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 size-64 rounded-full bg-[var(--terracotta)]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/3 size-56 rounded-full bg-[oklch(0.7_0.08_160)]/20 blur-3xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                <Sparkles className="size-3.5 text-[var(--terracotta)]" />
                The Sahajjo letter
              </p>
              <h2 className="display-lg mt-5 max-w-xl text-white">
                One good thing in your inbox,{" "}
                <span className="italic text-[var(--terracotta)]">
                  every other Friday.
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
                New events, small stories from the field, and a nudge when
                something nearby needs an extra pair of hands. No noise, no
                guilt trips.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 focus-within:border-[var(--terracotta)]">
                  <Mail className="size-4 shrink-0 text-white/50" />
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--terracotta)] px-5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? "Adding you..." : "Subscribe to the letter"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-center text-[0.68rem] text-white/45">
                  Design preview — no spam, and you can leave any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
