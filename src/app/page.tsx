import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Modalities } from "@/components/sections/Modalities";
import { Health } from "@/components/sections/Health";
import { Gallery } from "@/components/sections/Gallery";
import { EventsPreview } from "@/components/sections/EventsPreview";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { Supporters } from "@/components/sections/Supporters";
import { Location } from "@/components/sections/Location";
import { Contact } from "@/components/sections/Contact";
import { CTABanner } from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Modalities />
      <Health />
      <Gallery />
      <EventsPreview />
      <Supporters />
      <NewsPreview />
      <Location />
      <Contact />
      <CTABanner />
    </>
  );
}
