import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchProducts } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import RelatedProducts from "../components/product/RelatedProducts";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details");

  const { product, products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProducts());
  }, [dispatch, id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  // Mock reviews data (you can replace with real data from your backend)
  const reviews = [
    {
      id: 1,
      name: "Aarav Sharma",
      date: "May 17, 2025",
      rating: 4.9,
      comment: "Exceptional quality and design. The attention to detail is remarkable. Highly recommend for anyone looking to elevate their space.",
    },
    {
      id: 2,
      name: "Priya Patel",
      date: "May 15, 2025",
      rating: 4.9,
      comment: "Absolutely love this product! The craftsmanship is outstanding and it fits perfectly with my modern aesthetic.",
    },
  ];

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "packaging", label: "Packaging" },
    { id: "shipping", label: "Shipping Information" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Catalogue
            </Link>
            <span className="text-gray-400">›</span>
            <Link to={`/category/${product.category}`} className="text-gray-500 hover:text-gray-900 transition-colors">
              {product.category}
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-start">
          {/* Product Image */}
          <div>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl">
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 sm:p-8 transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category Badge */}
            <div className="inline-block">
              <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">4.9</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">(250+ Reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              {product.description || "Elevate your experience with this exceptional product. Crafted with sophistication and comfort in mind, this piece seamlessly blends style with functionality. Its sleek silhouette and luxurious design create elegant spaces, while the sturdy frame and ergonomic design ensure support and durability."}
            </p>

            {/* Price Section */}
            <div className="flex items-baseline gap-3 sm:gap-4 pt-3 sm:pt-4 pb-4 sm:pb-6 border-b border-gray-200">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">₹{Math.round(product.price * 1.3)}</span>
              <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                23% Off
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      _id: product._id,
                      title: product.title,
                      price: product.price,
                      image: product.image,
                      quantity: 1,
                    })
                  )
                }
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add to Cart
              </button>
              
              <button className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-900 rounded-xl sm:rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-200 group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Tabs Section */}
            <div className="pt-6 sm:pt-8">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="py-4 sm:py-6">
                {activeTab === "details" && (
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Indulge in the epitome of our seating luxury with the {product.title}. 
                      Crafted with meticulous attention to detail and a focus on both style 
                      and comfort, this exquisite piece is designed to elevate your space 
                      or kitchen island to new heights of sophistication.
                    </p>
                    
                    {/* Specifications */}
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Size</p>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">Standard</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Material</p>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">Premium Quality</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "packaging" && (
                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    <p>Your product will arrive in premium packaging designed to protect your purchase during shipping. We use eco-friendly materials whenever possible.</p>
                  </div>
                )}
                
                {activeTab === "shipping" && (
                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-2 sm:space-y-3">
                    <p>• Free shipping on orders over ₹999</p>
                    <p>• Standard delivery: 5-7 business days</p>
                    <p>• Express delivery available at checkout</p>
                    <p>• Easy 30-day returns</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews & Rating</h2>
                <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                  View All
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 sm:space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-20">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}



// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProductById, fetchProducts } from "../features/product/productSlice";
// import { addToCart } from "../features/cart/cartSlice";
// import RelatedProducts from "../components/product/RelatedProducts";

// export default function ProductDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { product, products } = useSelector((state) => state.product);

//   useEffect(() => {
//     dispatch(fetchProductById(id));
//     dispatch(fetchProducts());
//   }, [dispatch, id]);

//   if (!product) return <p>Loading...</p>;

//   const relatedProducts = products.filter(
//     (p) => p.category === product.category && p._id !== product._id
//   );

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* IMAGE */}
//         <img
//           src={product.image}
//           alt={product.title}
//           className="w-full h-96 object-cover rounded-xl"
//         />

//         {/* DETAILS */}
//         <div>
//           <h1 className="text-3xl font-bold">{product.title}</h1>
//           <p className="text-xl text-green-600 mt-2">₹{product.price}</p>

//           <p className="mt-4 text-gray-700">{product.description}</p>

//           <p className="mt-3">
//             Stock:{" "}
//             <span className="font-semibold">
//               {product.stock > 0 ? "Available" : "Out of stock"}
//             </span>
//           </p>

//           <button
//             onClick={() =>
//               dispatch(
//                 addToCart({
//                   _id: product._id,
//                   title: product.title,
//                   price: product.price,
//                   image: product.image,
//                   quantity: 1,
//                 })
//               )
//             }
//             className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>

//       {/* RELATED PRODUCTS */}
//       <RelatedProducts products={relatedProducts} />
//     </div>
//   );
// }
