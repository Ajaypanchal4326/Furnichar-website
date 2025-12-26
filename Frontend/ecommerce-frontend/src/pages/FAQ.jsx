import React, { useState, useEffect } from 'react';
import { ChevronDown, Mail, Phone, MessageCircle } from 'lucide-react';

export default function faq() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of furniture do you sell?",
      answer: "We offer a wide range of furniture including sofas, beds, dining tables, chairs, wardrobes, office furniture, and home décor items, designed for both modern and classic interiors."
    },
    {
      question: "Do you provide home delivery?",
      answer: "Yes, we provide safe and secure home delivery across multiple locations. Delivery timelines may vary depending on your city and product availability."
    },
    {
      question: "Are assembly services included?",
      answer: "Yes, free or low-cost assembly service is provided for most furniture items. Our delivery team will inform you if assembly is required."
    },
    {
      question: "What materials are used in your furniture?",
      answer: "Our furniture is made using high-quality materials such as solid wood, engineered wood, metal, premium fabrics, and durable foams to ensure long-lasting comfort and strength."
    },
    {
      question: "Can I customize furniture?",
      answer: "Customization is available for selected products such as sofas, beds, and wardrobes. You can choose size, color, fabric, and finish where applicable."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept:",
      list: ["UPI", "Credit & Debit Cards", "Net Banking", "Cash on Delivery (selected locations)"]
    },
    {
      question: "Is Cash on Delivery (COD) available?",
      answer: "Yes, COD is available on selected products and locations. Availability will be shown at checkout."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive an order tracking link via email or SMS to monitor delivery status."
    },
    {
      question: "What is your return policy?",
      answer: "We offer easy returns on eligible products within the specified return period if the item is damaged, defective, or incorrect."
    },
    {
      question: "What if I receive a damaged product?",
      answer: "If you receive a damaged product, please contact us within 48 hours with images. We will arrange a replacement or refund as per our policy."
    },
    {
      question: "Do your products come with a warranty?",
      answer: "Yes, most products come with a manufacturer warranty. Warranty details are mentioned on the product page."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery usually takes 5–10 business days, depending on your location and the product type."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be canceled before shipment. Once shipped, cancellation may not be possible."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us through:",
      list: ["Email support", "Contact form on the website", "Customer support phone number"]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-black text-white' 
        : 'bg-white text-black'
    }`}>
      

      {/* Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header */}
        <header className="text-center mb-12 md:mb-20">
          <div className="text-6xl md:text-7xl mb-6 animate-bounce-slow">🪑</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className={`text-lg md:text-xl ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need to know about our furniture and services
          </p>
          <div className={`w-20 h-1 mx-auto mt-6 rounded ${
            theme === 'dark' ? 'bg-white' : 'bg-black'
          }`}></div>
        </header>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16 md:mb-24">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              } ${activeIndex === index ? 'shadow-lg' : 'hover:shadow-md'}`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 md:px-7 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-200 hover:bg-opacity-80"
              >
                <span className="flex-1 text-base md:text-lg font-semibold leading-tight">
                  ❓ {faq.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`px-5 md:px-7 pb-5 md:pb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{faq.answer}</p>
                  {faq.list && (
                    <ul className="mt-3 space-y-2">
                      {faq.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                          <span className="mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className={`rounded-2xl border-2 p-8 md:p-12 text-center ${
          theme === 'dark'
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Still have questions?</h2>
          <p className={`text-base md:text-lg mb-8 md:mb-10 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Our customer support team is here to help you with any queries
          </p>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {/* Email */}
            <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-black border border-zinc-800 hover:border-zinc-700'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}>
              <Mail className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                support@furniture.com
              </p>
            </div>

            {/* Phone */}
            <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-black border border-zinc-800 hover:border-zinc-700'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}>
              <Phone className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                +1 (555) 123-4567
              </p>
            </div>

            {/* Live Chat */}
            <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-black border border-zinc-800 hover:border-zinc-700'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}>
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Live Chat</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}