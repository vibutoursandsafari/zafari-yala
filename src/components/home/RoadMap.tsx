'use client';

import { FiPhone, FiCalendar, FiCheckSquare, FiCamera } from 'react-icons/fi';

const roadmapSteps = [
  {
    id: 1,
    title: 'Contact',
    description: 'Reach out via call, email, or WhatsApp',
    icon: FiPhone,
    color: 'from-emerald-400 to-teal-500',
    lightBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 2,
    title: 'Discuss & Plan',
    description: 'We create your perfect safari itinerary',
    icon: FiCalendar,
    color: 'from-amber-400 to-orange-500',
    lightBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 3,
    title: 'Arrange',
    description: 'We handle logistics, permits & accommodations',
    icon: FiCheckSquare,
    color: 'from-blue-400 to-cyan-500',
    lightBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 4,
    title: 'Go Safari',
    description: 'Experience the wild adventure of a lifetime',
    icon: FiCamera,
    color: 'from-rose-400 to-pink-500',
    lightBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

export default function RoadMap() {
  return (
    <section className="relative bg-[#034d27] py-16 overflow-hidden font-sans">
      {/* Background Lines Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Your Safari <span className="text-yellow-400">Journey</span>
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl">
            From first contact to unforgettable adventure - we make it simple
          </p>
        </div>

        {/* Roadmap Steps - Horizontal Zigzag */}
        <div className="relative">
          {/* Mobile: Vertical Stack */}
          <div className="lg:hidden space-y-8">
            {roadmapSteps.map((step, index) => {
              const isLast = index === roadmapSteps.length - 1;
              return (
                <div key={step.id} className="relative">
                  {/* Mobile Vertical Dotted Line */}
                  {!isLast && (
                    <div className="absolute left-1/2 top-full w-0.5 h-8 z-0 transform -translate-x-1/2" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 6px, transparent 6px, transparent 10px)'
                    }} />
                  )}
                  
                  <div className="relative group max-w-xs mx-auto">
                    <div className={`absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <span className="text-white font-bold text-base">{step.id}</span>
                    </div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:scale-105">
                      <div className={`w-12 h-12 ${step.lightBg} rounded-xl flex items-center justify-center mb-3 transform group-hover:rotate-6 transition-transform duration-300`}>
                        <step.icon className={`${step.iconColor} group-hover:scale-110 transition-transform duration-300`} size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#034d27] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br ${step.color} opacity-10 rounded-tl-full transition-opacity duration-300 group-hover:opacity-20`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Horizontal Zigzag */}
          <div className="hidden lg:grid grid-cols-4 gap-8 relative">
            {roadmapSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === roadmapSteps.length - 1;
              
              return (
                <div key={step.id} className={`relative ${isEven ? 'mt-0' : 'mt-20'}`}>
                  {/* Horizontal Connecting Dotted Line */}
                  {!isLast && (
                    <div className={`absolute ${isEven ? 'top-1/2' : 'top-1/2'} left-full w-8 h-20 z-0`}>
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d={isEven ? "M 0 30 Q 50 30 100 70" : "M 0 70 Q 50 70 100 30"}
                          stroke="rgba(255,255,255,0.5)"
                          strokeWidth="3"
                          strokeDasharray="8,6"
                          fill="none"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Step Card */}
                  <div className="relative group">
                    {/* Floating Step Number Badge */}
                    <div className={`absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <span className="text-white font-bold text-base">{step.id}</span>
                    </div>

                    {/* Main Card */}
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:scale-105">
                      {/* Icon Circle */}
                      <div className={`w-12 h-12 ${step.lightBg} rounded-xl flex items-center justify-center mb-3 transform group-hover:rotate-6 transition-transform duration-300`}>
                        <step.icon className={`${step.iconColor} group-hover:scale-110 transition-transform duration-300`} size={24} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#034d27] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>

                      {/* Decorative Corner Accent */}
                      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br ${step.color} opacity-10 rounded-tl-full transition-opacity duration-300 group-hover:opacity-20`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const contactSection = document.getElementById('contact');
              if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-2 bg-white text-[#034d27] font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>Start Your Journey</span>
            <FiPhone size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}