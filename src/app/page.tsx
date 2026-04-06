import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import Packages from "@/components/home/Packages";
import Reviews from "@/components/home/Reviews";
import RoadMap from "@/components/home/RoadMap";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <Packages />
      <RoadMap />
      <Contact />
      <Reviews />
      <Gallery />
      <About />
    </main>
  );
}