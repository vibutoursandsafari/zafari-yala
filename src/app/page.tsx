import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import Packages from "@/components/home/Packages";
import Reviews from "@/components/home/Reviews";
import RoadMap from "@/components/home/RoadMap";

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Yala Wild Spirit - Yala Safari & Tours',
    description: 'Safari tours in Yala National Park, Sri Lanka - Yala Wild Spirit',
    image: 'https://yalawildspirit.com/assets/images/about1.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Yala National Park',
      addressLocality: 'Kataragama',
      addressRegion: 'Southern Province',
      postalCode: '91400',
      addressCountry: 'LK',
    },
    telephone: '+94763272593',
    url: 'https://yalawildspirit.com',
    priceRange: '$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '27',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <About />
        <RoadMap />
        <Packages />
        <Reviews />
        <Gallery />
        <Contact />
      </main>
    </>
  );
}