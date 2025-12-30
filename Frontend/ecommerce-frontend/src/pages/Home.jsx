import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeroReviewCard from '../components/review/HeroReviewCard';
import { API_URL } from "../utils/api";


const categories = [
  { name: "Living Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80" },
  { name: "Bedroom", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=80" },
  { name: "Dining Room", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&q=80" },
  { name: "Home Office", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80" },
];

export default function Home() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();

        setFeaturedProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-13 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div
              id="hero-content"
              className="
                space-y-6 sm:space-y-8
                animate-on-scroll transition-all duration-1000
                order-2 lg:order-1
                mt-20 sm:mt-0
                "
              style={{
                opacity: isVisible("hero-content") ? 1 : 0,
                transform: isVisible("hero-content")
                  ? "translateY(0)"
                  : "translateY(40px)",
                transitionDelay: "0.2s",
              }}>

              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Create a home you{" "}
                  <span className="text-red-600 decoration-red-400">Love</span>
                </h1>


                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                  Transform your home with sophisticated and stylish pieces, and create a serene and inviting home.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-none hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Shop now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/products"
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-medium rounded-none hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Explore deals
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Free delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Always on-time</span>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div
              id="hero-cards"
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] animate-on-scroll order-1 lg:order-2"
              style={{
                opacity: isVisible('hero-cards') ? 1 : 0,
                transform: isVisible('hero-cards') ? 'translateX(0)' : 'translateX(40px)',
                transition: 'all 1s ease-out 0.2s'
              }}
            >
              {/* Main Product Card */}
              <div
                className="absolute top-0 right-0 sm:right-4 lg:right-20 bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 lg:p-6 w-48 sm:w-56 lg:w-64 shadow-xl z-10 group hover:shadow-2xl transition-all duration-500"
                style={{
                  transform: isVisible('hero-cards') ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                  transition: 'all 0.8s ease-out 0.4s'
                }}
              >
                <div className="bg-white dark:bg-gray-700 aspect-square mb-3 sm:mb-4 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80"
                    alt="Single comfort chair"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">$320.00</div>
                <div className="text-xs sm:text-sm text-gray-900 dark:text-white">Single comfort chair</div>
              </div>

              {/*Designer Card */}

              <HeroReviewCard isVisible={isVisible('hero-cards')} />


              {/* Small Decoration Card */}
              <div
                className="absolute bottom-24 sm:bottom-32 left-0 sm:left-4 lg:left-10 bg-white dark:bg-gray-800 p-3 sm:p-4 w-40 sm:w-48 shadow-lg"
                style={{
                  opacity: isVisible('hero-cards') ? 1 : 0,
                  transform: isVisible('hero-cards') ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                  transition: 'all 0.8s ease-out 0.8s'
                }}
              >
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Modern & stylish</div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Furniture</div>
                <div className="mt-2 sm:mt-3 bg-gray-200 dark:bg-gray-700 aspect-video overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80"
                    alt="Modern furniture"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="category-header"
            className="mb-12 animate-on-scroll transition-all duration-1000"
            style={{
              opacity: isVisible('category-header') ? 1 : 0,
              transform: isVisible('category-header') ? 'translateY(0)' : 'translateY(30px)'
            }}
          >
            <div className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">CATEGORY</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Design your perfect home
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to="/products"
                id={`category-${index}`}
                className="group relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[4/5] animate-on-scroll transition-all duration-1000"
                style={{
                  opacity: isVisible(`category-${index}`) ? 1 : 0,
                  transform: isVisible(`category-${index}`) ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AMBITIONS SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div
              id="ambition-image"
              className="relative h-[500px] overflow-hidden animate-on-scroll transition-all duration-1000"
              style={{
                opacity: isVisible('ambition-image') ? 1 : 0,
                transform: isVisible('ambition-image') ? 'translateX(0) scale(1)' : 'translateX(-40px) scale(0.95)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                alt="Modern living room"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div
              id="ambition-content"
              className="space-y-6 animate-on-scroll transition-all duration-1000"
              style={{
                opacity: isVisible('ambition-content') ? 1 : 0,
                transform: isVisible('ambition-content') ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: '0.2s'
              }}
            >
              <div className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                OUR AMBITIONS
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Pioneering innovation and excellence in furniture
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Striving for excellence in every detail, we are committed to revolutionizing the online shopping experience. Our ambition is to set new standards in quality, customer satisfaction, and sustainability, ensuring that every purchase from our platform is a step towards a brighter, more innovative future.
              </p>

              <Link to="/about">
                <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-none hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 group">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Fast Delivery",
                description: "Get your furniture delivered quickly and safely to your doorstep with our reliable shipping partners."
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Secure Payments",
                description: "Shop with confidence using our 100% secure checkout with trusted payment gateways."
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Quality Products",
                description: "Every piece is carefully curated and crafted from premium materials by trusted brands."
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                id={`feature-${index}`}
                className="group p-8 border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-all duration-500 animate-on-scroll"
                style={{
                  opacity: isVisible(`feature-${index}`) ? 1 : 0,
                  transform: isVisible(`feature-${index}`) ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="mb-4 text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div
            id="products-header"
            className="flex justify-between items-end mb-12 animate-on-scroll transition-all duration-1000"
            style={{
              opacity: isVisible("products-header") ? 1 : 0,
              transform: isVisible("products-header")
                ? "translateY(0)"
                : "translateY(30px)",
            }}
          >
            <div>
              <div className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                FEATURED COLLECTION
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Best sellers
              </h2>
            </div>

            <Link
              to="/products"
              className="text-gray-900 dark:text-white font-medium hover:gap-3 flex items-center gap-2 transition-all group"
            >
              View all
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* LOADING STATE (UNCHANGED) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 aspect-square mb-4 rounded-lg"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => {
                const productId = product._id || product.id;

                const imageUrl = product.image?.startsWith("http")
                  ? product.image
                  : `${API_URL}${product.image}`;

                return (
                  <Link
                    key={productId}
                    to={`/product/${productId}`}
                    className="group transition-all duration-1000"
                    style={{
                      opacity: 1,                   
                      transform: "translateY(0)",  
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="bg-gray-200 dark:bg-gray-700 aspect-square mb-4 overflow-hidden rounded-lg">
                      <img
                        src={imageUrl}
                        alt={product.title || "Product image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1555041469?w=500&q=80";
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.category || "General"}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                        {product.title || "Unnamed product"}
                      </h3>

                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}


