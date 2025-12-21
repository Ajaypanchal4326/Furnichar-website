import React, { useEffect, useRef, useState } from 'react';

const About = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section) => {
      observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"
            alt="Furniture"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-6 animate-section" id="hero">
            <h1
              className={`text-6xl md:text-8xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${
                isVisible('hero')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              We Craft Your
              <br />
              Dream Furniture
            </h1>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-900 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 animate-section" id="story">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 delay-100 ${
              isVisible('story')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              We understand that every piece in your home is a reflection of your style, and that's why we're here to guide you every step of the way. From modern minimalism to classic elegance, our team of skilled craftsmen is ready to create furniture that brings your vision to life.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              What sets us apart is our commitment to quality and customer satisfaction. We believe that furniture should not only look beautiful but also stand the test of time, which is why we use only premium materials and time-honored techniques.
            </p>
          </div>
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible('story')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-20'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800"
              alt="Craftsmanship"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-24 animate-section" id="stats">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { number: '500', label: 'Projects Done', delay: 'delay-100' },
              { number: '120', label: 'Happy Clients', delay: 'delay-300' },
              { number: '450', label: 'Furniture Built', delay: 'delay-500' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${stat.delay} ${
                  isVisible('stats')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
              >
                <div className="text-7xl md:text-8xl font-bold text-gray-900 mb-4">
                  {stat.number}
                  <span className="text-amber-600">+</span>
                </div>
                <div className="text-xl text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative h-96 overflow-hidden animate-section" id="video">
        <img
          src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200"
          alt="Workshop"
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isVisible('video') ? 'scale-100' : 'scale-110'
          }`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`text-center transition-all duration-1000 delay-300 ${
              isVisible('video')
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-90'
            }`}
          >
            <h3 className="text-5xl font-bold text-white mb-4">
              Explore more
              <br />
              about us
            </h3>
            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 mx-auto mt-8">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-900 border-b-8 border-b-transparent ml-1"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Our Process Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 animate-section" id="process">
        <h2
          className={`text-5xl md:text-6xl font-bold text-gray-900 mb-24 transition-all duration-1000 ${
            isVisible('process')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          Our Process
        </h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-20">
          {[
            {
              num: '01',
              title: 'Dream & Discover',
              desc: 'Share your vision and style preferences with us. We listen carefully to understand your needs and desired aesthetic for your space.'
            },
            {
              num: '02',
              title: 'Design Consultation',
              desc: 'Our designers create detailed sketches and 3D models. We collaborate with you to refine every detail until it matches your vision perfectly.'
            },
            {
              num: '03',
              title: 'Material Selection',
              desc: 'Choose from our premium collection of woods, fabrics, and finishes. We guide you through options that balance beauty with durability.'
            },
            {
              num: '04',
              title: 'Expert Crafting',
              desc: 'Our skilled artisans bring your furniture to life using traditional techniques and modern precision tools for flawless execution.'
            },
            {
              num: '05',
              title: 'Quality Assurance',
              desc: 'Every piece undergoes rigorous inspection to ensure it meets our high standards for quality, finish, and structural integrity.'
            },
            {
              num: '06',
              title: 'Delivery & Setup',
              desc: 'We deliver your custom furniture and professionally install it in your home, ensuring perfect placement and your complete satisfaction.'
            }
          ].map((step, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                isVisible('process')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-6xl font-bold text-gray-200 mb-4">{step.num}</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-32 animate-section" id="team">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className={`text-5xl md:text-6xl font-bold text-white mb-24 transition-all duration-1000 ${
              isVisible('team')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            Meet The
            <br />
            Master Craftsmen
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'David Miller', role: 'Master Carpenter', img: 'photo-1507003211169-0a1dd7228f2d' },
              { name: 'Sarah Chen', role: 'Design Director', img: 'photo-1494790108377-be9c29b29330' },
              { name: 'Marcus Lee', role: 'Finishing Expert', img: 'photo-1500648767791-00dcc994a43e' },
              { name: 'Emma Wilson', role: 'Quality Manager', img: 'photo-1438761681033-6461ffad8d80' }
            ].map((member, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl h-96 transition-all duration-1000 ${
                  isVisible('team')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img
                  src={`https://images.unsplash.com/${member.img}?w=400`}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-amber-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-white animate-section" id="cta">
        <div
          className={`max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${
            isVisible('cta')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Ready to Create Your Dream Furniture?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Let's bring your vision to life with our expert craftsmanship
          </p>
          <button className="bg-gray-900 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 transition-colors duration-300 transform hover:scale-105">
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;