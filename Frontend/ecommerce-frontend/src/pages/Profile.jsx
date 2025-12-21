import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { logout } from "../features/auth/authSlice";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Package, LogOut } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || user?.address?.phone || "",
    address: user?.address?.address || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });

  const validatePhone = (phone) => {
    // Remove all non-digit characters for validation
    const cleaned = phone.replace(/\D/g, "");
    
    // Check if it's a valid phone number (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return "Phone number must be between 10-15 digits";
    }
    
    // Check for valid formats
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid phone number";
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.phone.trim()) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const address = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      };
      
      await axiosInstance.put("/auth/profile", { 
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address 
      });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || user?.address?.phone || "",
      address: user?.address?.address || "",
      city: user?.address?.city || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-gray-900" strokeWidth={2} />
              </div>
              <div className="text-center sm:text-left text-white flex-1">
                <h2 className="text-2xl font-bold">{formData.name || "User Name"}</h2>
                <p className="text-gray-300 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {formData.email || "email@example.com"}
                </p>
                {formData.city && formData.country && (
                  <p className="text-gray-300 text-sm mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    {formData.city}, {formData.country}
                  </p>
                )}
              </div>
              <button
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setErrors({ ...errors, name: null });
                      }}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors({ ...errors, email: null });
                        }}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setErrors({ ...errors, phone: null });
                        }}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    {!errors.phone && isEditing && (
                      <p className="text-gray-500 text-xs mt-1">
                        Enter phone number with country code (10-15 digits)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        rows="3"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all resize-none"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all"
                      placeholder="10001"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 transition-all"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <a
            href="/my-orders"
            className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-lg font-medium transition-all shadow-sm border border-gray-200"
          >
            <Package className="w-5 h-5" />
            View My Orders
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-lg font-medium transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axiosInstance from "../services/axiosInstance";
// import { logout } from "../features/auth/authSlice";

// export default function Profile() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const [address, setAddress] = useState({
//     address: user?.address?.address || "",
//     city: user?.address?.city || "",
//     postalCode: user?.address?.postalCode || "",
//     country: user?.address?.country || "",
//     phone: user?.address?.phone || "",
//   });

//   const saveProfile = async () => {
//     await axiosInstance.put("/auth/profile", { address });
//     alert("Profile updated");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">My Profile</h1>

//       <div className="bg-white p-6 rounded shadow space-y-4">
//         <input placeholder="Address" value={address.address}
//           onChange={(e) => setAddress({ ...address, address: e.target.value })} />

//         <input placeholder="City" value={address.city}
//           onChange={(e) => setAddress({ ...address, city: e.target.value })} />

//         <input placeholder="Postal Code" value={address.postalCode}
//           onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />

//         <input placeholder="Country" value={address.country}
//           onChange={(e) => setAddress({ ...address, country: e.target.value })} />

//         <input placeholder="Phone" value={address.phone}
//           onChange={(e) => setAddress({ ...address, phone: e.target.value })} />

//         <button onClick={saveProfile}
//           className="bg-black text-white px-4 py-2 rounded">
//           Save Address
//         </button>

//         <button onClick={() => dispatch(logout())}
//           className="bg-red-500 text-white px-4 py-2 rounded">
//           Logout
//         </button>
//       </div>
//       <a
//   href="/my-orders"
//   className="inline-block mt-4 bg-black text-white px-4 py-2 rounded"
// >
//   View My Orders
// </a>

//     </div>
//   );
// }
