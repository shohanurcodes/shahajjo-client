import type { Metadata } from "next";
import { Features } from "@/components/home/features";
import { Gallery } from "@/components/home/gallery";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { RecentEvents } from "@/components/home/recent-events";

export const metadata: Metadata = {
  title: "Sahajjo — Show up for your neighbourhood",
  description:
    "Find community cleanups, plantation drives, donation events and winter relief programmes across Dhaka. Create your own event and bring neighbours together.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <RecentEvents />
      <Gallery />
      <Newsletter />
    </>
  );
}
