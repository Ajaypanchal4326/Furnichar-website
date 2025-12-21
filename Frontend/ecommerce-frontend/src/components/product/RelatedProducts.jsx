import ProductCard from "./ProductCard";

export default function RelatedProducts({ products }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
