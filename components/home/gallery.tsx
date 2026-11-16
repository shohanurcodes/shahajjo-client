import Image from "next/image";
import { Camera } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const gallery = [
  {
    src: "/gallery/cleanup.jpg",
    title: "Buriganga bank clean-up",
    place: "Old Dhaka",
    span: "lg:col-span-2",
  },
  {
    src: "/gallery/clothes-drive.jpg",
    title: "Winter clothes sorting",
    place: "Mirpur 10",
    span: "",
  },
  {
    src: "/gallery/plantation.jpg",
    title: "Monsoon plantation day",
    place: "Dhanmondi",
    span: "",
  },
  {
    src: "/gallery/food-drive.jpg",
    title: "Friday food packs",
    place: "Mohammadpur",
    span: "",
  },
  {
    src: "/gallery/volunteers.jpg",
    title: "Volunteer orientation",
    place: "Uttara",
    span: "",
  },
  {
    src: "/gallery/winter-relief.jpg",
    title: "Blanket distribution",
    place: "Old Dhaka",
    span: "lg:col-span-2",
  },
];

export function Gallery() {
  return (
    <section className="section-pad">
      <div className="site-container">
        <SectionHeading
          eyebrow="From the field"
          title={
            <>
              Moments from the{" "}
              <span className="italic text-primary">work we share.</span>
            </>
          }
          description="A few frames from cleanups, plantation drives and donation days around Dhaka. The next one could use your hands."
          action={{ href: "/events", label: "Find your next event" }}
        />

        <div className="grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <figure
              key={item.title}
              className={`hover-zoom group relative overflow-hidden rounded-[1.5rem] border border-border/70 ${item.span}`}
            >
              <Image
                src={item.src}
                alt={`${item.title} — ${item.place}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {item.place}
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold leading-tight">
                    {item.title}
                  </p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur">
                  <Camera className="size-3.5" />
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
