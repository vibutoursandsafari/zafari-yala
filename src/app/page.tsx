import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import RoadMap from "@/components/home/RoadMap";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <Contact />
      <RoadMap />
      <About />
      <Gallery />
    </main>
  );
}