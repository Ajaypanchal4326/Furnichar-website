import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../features/admin/adminProductSlice";
import { X, Upload, Image } from "lucide-react";

export default function EditProduct({ product, onClose }) {
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);

  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
  });

  const [imagePreview, setImagePreview] = useState(product.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Detect browser theme preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches);

    const handleChange = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener("change", handleChange);

    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: null });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.price || form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!form.stock || form.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    dispatch(updateProduct({ id: product._id, data: formData }));
    onClose();
  };

  // Theme-aware styles
  const bgPrimary = isDark ? "bg-gray-900" : "bg-white";
  const bgSecondary = isDark ? "bg-gray-800" : "bg-gray-50";
  const textPrimary = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const hoverBg = isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const buttonPrimary = isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800";
  const buttonSecondary = isDark ? "border-white text-white hover:bg-gray-800" : "border-black text-black hover:bg-gray-100";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className={`${bgPrimary} rounded-lg shadow-2xl max-w-2xl w-full my-4 max-h-[95vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? "bg-white text-black" : "bg-black text-white"} px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg z-10`}>
          <h2 className="text-xl sm:text-2xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className={`${isDark ? "text-gray-600 hover:text-black" : "text-gray-300 hover:text-white"} transition-colors`}
            type="button"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Product Image
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {imagePreview ? (
                <div className={`relative w-full sm:w-32 h-32 sm:flex-shrink-0 rounded-lg overflow-hidden border-2 ${isDark ? "border-white" : "border-black"}`}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={`absolute top-1 right-1 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} rounded-full p-1 transition-colors`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className={`w-full sm:w-32 h-32 sm:flex-shrink-0 border-2 border-dashed ${isDark ? "border-gray-600 bg-gray-800" : "border-gray-400 bg-gray-50"} rounded-lg flex items-center justify-center`}>
                  <Image size={32} className={isDark ? "text-gray-500" : "text-gray-400"} />
                </div>
              )}

              <label className="flex-1 w-full cursor-pointer">
                <div className={`border-2 border-dashed ${isDark ? "border-gray-600 hover:border-white bg-gray-800" : "border-gray-400 hover:border-black bg-gray-50"} rounded-lg p-4 sm:p-6 text-center transition-colors`}>
                  <Upload size={28} className={`mx-auto ${isDark ? "text-gray-400" : "text-gray-600"} mb-2 sm:w-8 sm:h-8`} />
                  <p className={`text-xs sm:text-sm ${textSecondary} mb-1`}>
                    <span className={`${textPrimary} font-semibold`}>Click to upload</span> or drag and drop
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Title */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Product Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full px-4 py-2 border-2 ${
                errors.title ? "border-red-600" : borderColor
              } ${bgPrimary} ${textPrimary} rounded-lg focus:ring-2 ${isDark ? "focus:ring-white focus:border-white" : "focus:ring-black focus:border-black"} outline-none transition-all`}
              placeholder="Enter product title"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={`w-full px-4 py-2 border-2 ${
                  errors.price ? "border-red-600" : borderColor
                } ${bgPrimary} ${textPrimary} rounded-lg focus:ring-2 ${isDark ? "focus:ring-white focus:border-white" : "focus:ring-black focus:border-black"} outline-none transition-all`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
                Stock Quantity *
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={`w-full px-4 py-2 border-2 ${
                  errors.stock ? "border-red-600" : borderColor
                } ${bgPrimary} ${textPrimary} rounded-lg focus:ring-2 ${isDark ? "focus:ring-white focus:border-white" : "focus:ring-black focus:border-black"} outline-none transition-all`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Category *
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`w-full px-4 py-2 border-2 ${
                errors.category ? "border-red-600" : borderColor
              } ${bgPrimary} ${textPrimary} rounded-lg focus:ring-2 ${isDark ? "focus:ring-white focus:border-white" : "focus:ring-black focus:border-black"} outline-none transition-all`}
              placeholder="Enter product category"
            />
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className={`w-full px-4 py-2 border-2 ${
                errors.description ? "border-red-600" : borderColor
              } ${bgPrimary} ${textPrimary} rounded-lg focus:ring-2 ${isDark ? "focus:ring-white focus:border-white" : "focus:ring-black focus:border-black"} outline-none transition-all resize-none`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t-2 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <button
              type="button"
              onClick={onClose}
              className={`w-full sm:flex-1 px-6 py-3 border-2 ${buttonSecondary} rounded-lg font-semibold transition-colors`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitHandler}
              className={`w-full sm:flex-1 px-6 py-3 ${buttonPrimary} rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl`}
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}