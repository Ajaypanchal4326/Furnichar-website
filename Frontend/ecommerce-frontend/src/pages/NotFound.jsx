import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 dark:bg-gray-900 transition-colors duration-300 px-4">
      {/* 404 Text with Chair Icon */}
      <div className="flex items-center justify-center mb-8">
        <span className="text-8xl md:text-9xl font-bold text-amber-900 dark:text-amber-100 transition-colors duration-300">
          4
        </span>
        
        {/* Chair Icon - 3D style */}
        <div className="mx-2 md:mx-4 relative">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 dark:from-gray-600 dark:via-gray-500 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-12 transition-all duration-300 hover:rotate-0">
            {/* Armchair Icon */}
            <div className="relative w-12 h-12 md:w-14 md:h-14">
              {/* Seat */}
              <div className="absolute bottom-3 left-2 right-2 h-4 bg-gradient-to-b from-orange-400 to-orange-500 dark:from-orange-300 dark:to-orange-400 rounded-lg shadow-inner"></div>
              
              {/* Backrest */}
              <div className="absolute top-0 left-1 right-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-t-xl shadow-inner"></div>
              
              {/* Armrests */}
              <div className="absolute top-6 left-0 w-2 h-4 bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400 rounded-l"></div>
              <div className="absolute top-6 right-0 w-2 h-4 bg-gradient-to-l from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400 rounded-r"></div>
            </div>
          </div>
        </div>
        
        <span className="text-8xl md:text-9xl font-bold text-amber-900 dark:text-amber-100 transition-colors duration-300">
          4
        </span>
      </div>

      {/* Page Not Found Text */}
      <p className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 mb-8 transition-colors duration-300">
        Page Not Found
      </p>

      {/* Go Home Button */}
      <Link
        to="/"
        className="px-8 py-3 bg-amber-900 dark:bg-amber-700 text-white rounded-full font-medium hover:bg-amber-800 dark:hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Go Home
      </Link>
    </div>
  );
}