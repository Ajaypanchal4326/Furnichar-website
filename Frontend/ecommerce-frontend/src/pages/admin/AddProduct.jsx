import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetAdminProduct,
} from "../../features/admin/adminProductSlice";
import { Package, DollarSign, Archive, Tag, Upload, X, Image } from "lucide-react";

export default function AddProduct() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.adminProduct
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }

      setImage(file);
      setErrors({ ...errors, image: null });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!form.stock || Number(form.stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!image) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("category", form.category);
    formData.append("image", image);

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (success) {
      alert("Product created successfully");
      dispatch(resetAdminProduct());

      setForm({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
      setImage(null);
      setImagePreview(null);
      setErrors({});
    }
  }, [success, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8" />
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new product listing for your store</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg flex items-start gap-3">
            <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error creating product</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div>
            {/* Product Image Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Image</h2>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload product image</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    {image?.name}
                  </p>
                </div>
              )}
              
              {errors.image && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Product Details
                </h2>

                <div className="space-y-5">
                  {/* Product Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition-all ${
                          errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter product title"
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value });
                          setErrors({ ...errors, title: null });
                        }}
                      />
                    </div>
                    {errors.title && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Product Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg h-32 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition-all ${
                        errors.description ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Describe your product in detail..."
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                        setErrors({ ...errors, description: null });
                      }}
                    />
                    {errors.description && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="number"
                          step="0.01"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition-all ${
                            errors.price ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder="0.00"
                          value={form.price}
                          onChange={(e) => {
                            setForm({ ...form, price: e.target.value });
                            setErrors({ ...errors, price: null });
                          }}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="number"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition-all ${
                            errors.stock ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder="0"
                          value={form.stock}
                          onChange={(e) => {
                            setForm({ ...form, stock: e.target.value });
                            setErrors({ ...errors, stock: null });
                          }}
                        />
                      </div>
                      {errors.stock && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.stock}</p>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition-all ${
                          errors.category ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="e.g., Electronics, Clothing, Books"
                        value={form.category}
                        onChange={(e) => {
                          setForm({ ...form, category: e.target.value });
                          setErrors({ ...errors, category: null });
                        }}
                      />
                    </div>
                    {errors.category && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={submitHandler}
                  disabled={loading}
                  className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}