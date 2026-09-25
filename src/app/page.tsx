import { CompassNav } from "@/components/navigation/CompassNav";
import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/intro/Intro";
import { Countdown } from "@/components/countdown/Countdown";
import { EventWorld } from "@/components/event-world/EventWorld";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";
import { events } from "@/content/events";

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:bg-black focus:p-3">Skip to content</a>
      <CompassNav />
      <main id="main">
        <Hero />
        <Intro />
        <Countdown />
        <EventWorld events={events} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
