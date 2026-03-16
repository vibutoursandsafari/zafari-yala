'use client';

import { FiCheck, FiStar, FiArrowRight, FiCamera, FiMapPin, FiUsers } from 'react-icons/fi';
import { MdLocalDining, MdLocalFireDepartment } from 'react-icons/md';
import Image from 'next/image';

interface PackageFeature {
  icon: React.ReactNode;
  text: string;
}

interface PackageProps {
  name: string;
  description: string;
  features: PackageFeature[];
  isPopular?: boolean;
  accent?: string;
}

const PackageCard: React.FC<PackageProps> = ({ name, description, features, isPopular, accent }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-101 ring-2 ring-green-700 shadow-lg">
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <FiStar size={14} fill="currentColor" />
          Popular
        </div>
      )}

      <div className="bg-white">
        {/* Green Header Section (darker) */}
        <div className="relative p-8 overflow-hidden bg-gradient-to-r from-green-800 to-emerald-900">
          {/* Decorative Dots Background (kept) */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(134, 239, 172, 0.35) 1.5px, transparent 1.5px)`,
                backgroundSize: '25px 25px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ?? 'bg-green-200/30 ring-1 ring-white/10'}`}>
                <Image src="/assets/icons/jeep_icon_white_01.png" alt="jeep" width={28} height={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">{name}</h3>
            </div>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">{description}</p>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 bg-white text-green-600 hover:bg-gray-100 hover:scale-105">
              Get Started
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="p-8 space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1 text-green-600">
                {feature.icon}
              </div>
              <span className="text-gray-700 text-sm leading-relaxed">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Packages() {
  const packages: PackageProps[] = [
    {
      name: 'Safari Trail',
      description: 'Half day guided safari experience',
      accent: 'bg-blue-400 ring-1 ring-white/20',
      features: [
        { icon: <FiMapPin size={20} />, text: 'Visit one main safari area' },
        { icon: <FiUsers size={20} />, text: 'Shared safari jeep with driver' },
        { icon: <MdLocalDining size={20} />, text: 'Complimentary bottled drinking water' },
        { icon: <FiCheck size={20} />, text: 'Basic wildlife briefing before tour' },
        { icon: <FiCheck size={20} />, text: 'National park entry permit included' },
        { icon: <FiCamera size={20} />, text: 'Short stops for wildlife photography' },
      ],
    },
    {
      name: 'Wildlife Explorer',
      description: 'Extended safari covering multiple park zones',
      isPopular: true,
      accent: 'bg-amber-400 ring-1 ring-white/20',
      features: [
        { icon: <FiUsers size={20} />, text: 'Small group safari jeep experience' },
        { icon: <MdLocalDining size={20} />, text: 'Light meal or packed breakfast included' },
        { icon: <MdLocalDining size={20} />, text: 'Complimentary water and light refreshments' },
        { icon: <FiCheck size={20} />, text: 'Experienced wildlife guide during safari' },
        { icon: <FiCamera size={20} />, text: 'Scenic wildlife observation and photo stops' },
        { icon: <FiCheck size={20} />, text: 'Hotel pickup and drop off service' },
      ],
    },
    {
      name: 'Wild Expedition',
      description: 'Full day premium safari adventure',
      accent: 'bg-purple-600 ring-1 ring-white/20',
      features: [
        { icon: <FiMapPin size={20} />, text: 'Explore multiple wildlife rich safari areas' },
        { icon: <MdLocalFireDepartment size={20} />, text: 'Private luxury safari jeep experience' },
        { icon: <MdLocalDining size={20} />, text: 'Breakfast, lunch, snacks and drinks included' },
        { icon: <FiCheck size={20} />, text: 'Professional wildlife guide and naturalist' },
        { icon: <FiCamera size={20} />, text: 'Premium wildlife photography stop locations' },
        { icon: <FiCheck size={20} />, text: 'Comfortable hotel pickup and return service' },
      ],
    },
  ];

  return (
    <section className="py-6 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gray-800">Our Exclusive</span> <span className="text-green-800">Safari Plans</span>
          </h2>
          <p className="text-sm text-gray-600">Choose a plan that fits your adventure.</p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <PackageCard key={idx} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
