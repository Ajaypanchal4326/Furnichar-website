import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const companyLinks = [
    { name: "About", path: "/about" },
    { name: "Shop", path: "/products" },
    { name: "Careers", path: "/careers" },
    { name: "FAQ", path: "/faq" },
  ];

  const categoryLinks = [
    { name: "Living Room", path: "/products?category=living-room" },
    { name: "Dining Room", path: "/products?category=dining-room" },
    { name: "Home Office", path: "/products?category=home-office" },
    { name: "Bedroom", path: "/products?category=bedroom" },
    { name: "Outdoor", path: "/products?category=outdoor" },
  ];

  // Email validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    setStatus("");

    // Empty email
    if (!email) {
      setStatus("Please enter a valid email");
      return;
    }

    // Invalid email
    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/newsletter/subscribe",
        { email }
      );

      setStatus(res.data.message || "Subscribed successfully 🎉");
      setEmail("");
    } catch (err) {
      setStatus(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 sm:mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
            >
              ShopEase
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Discover elegant and affordable furniture for every room.
              Transform your home with style.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Category
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Join our newsletter
            </h3>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors text-sm"
              />

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>

              {status && (
                <p
                  className={`text-xs ${
                    status.includes("valid")
                      ? "text-red-500"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {status}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} ShopEase. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                to="/terms"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms of Condition
              </Link>
              <Link
                to="/privacy"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
