import { CalendarPlus, HeartHandshake, MapPinned, UsersRound } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const features = [
  {
    number: "01",
    icon: CalendarPlus,
    title: "Start something in minutes",
    description:
      "Give your drive a name, a place and a date. Share the link and let the neighbourhood do what it does best.",
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Join without the paperwork",
    description:
      "One tap puts your name on the list. See who else is coming, and show up knowing exactly where to be.",
  },
  {
    number: "03",
    icon: UsersRound,
    title: "Keep everyone in the loop",
    description:
      "Track sign-ups, update the details, or move the date. Your attendees always see the latest plan.",
  },
  {
    number: "04",
    icon: MapPinned,
    title: "Built for your own street",
    description:
      "From Mirpur to Mohammadpur, Dhanmondi to Old Dhaka — organise around the places you actually live in.",
  },
];

export function Features() {
  return (
    <section className="section-pad">
      <div className="site-container">
        <SectionHeading
          eyebrow="Why Sahajjo"
          title={
            <>
              Good intentions deserve{" "}
              <span className="italic text-primary">better tools.</span>
            </>
          }
          description="No group chats lost in the scroll, no spreadsheets to chase. Just a clear place to organise the work your community already wants to do."
          action={{ href: "/events", label: "See what's coming up" }}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`card-lift relative flex h-full flex-col rounded-[1.5rem] border p-6 ${
                index === 0
                  ? "border-primary/25 bg-primary text-primary-foreground"
                  : "border-border/80 bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid size-11 place-items-center rounded-2xl ${
                    index === 0
                      ? "bg-white/12 text-[var(--terracotta)]"
                      : "bg-brand-soft text-primary"
                  }`}
                >
                  <feature.icon className="size-5" />
                </span>
                <span
                  className={`font-heading text-xs font-semibold tracking-[0.14em] ${
                    index === 0 ? "text-white/45" : "text-muted-foreground/55"
                  }`}
                >
                  {feature.number}
                </span>
              </div>

              <h3
                className={`mt-8 font-heading text-xl font-semibold leading-snug ${
                  index === 0 ? "text-white" : ""
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`mt-2.5 text-sm leading-relaxed ${
                  index === 0 ? "text-white/75" : "text-muted-foreground"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
