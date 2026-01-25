import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecommendedProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("RECOMMEND productId:", productId);

    if (!productId) return;

    axios
      .get(
        `https://ecommerce-ai-rzrj.onrender.com/recommend/${productId}`
      )
      .then((res) => {
        console.log("AI RECOMMEND RESPONSE:", res.data);
        setProducts(res.data.products || []);
      })
      .catch((err) => console.error("Recommendation error:", err))
      .finally(() => setLoading(false));
  }, [productId]);


  if (loading) {
    return (
      <p className="text-gray-400 mt-4">
        Loading recommendations...
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-gray-500 mt-4">
        No recommendations available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {products.map((p) => (
        <Link
          key={p._id}
          to={`/product/${p._id}`}
          className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={p.image}
            alt={p.title}
            className="h-40 w-full object-cover"
          />
          <div className="p-4">
            <h3 className="text-white font-medium line-clamp-1">
              {p.title}
            </h3>
            <p className="text-amber-400 font-bold mt-1">
              ₹{p.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
