import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-12",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-lg mt-4">{title}</h2>
        {description && <p className="lede mt-4">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[var(--terracotta)]"
        >
          {action.label}
          <span className="grid size-8 place-items-center rounded-full border border-border transition-all group-hover:border-[var(--terracotta)] group-hover:bg-[var(--terracotta)] group-hover:text-white">
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      )}
    </div>
  );
}
