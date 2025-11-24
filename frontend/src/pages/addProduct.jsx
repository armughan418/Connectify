import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import AdminSidebar from "../components/adminSidebar";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../utils/api";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    image: null,
    inStock: true,
    stockCount: 0,
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Grocery",
  ];

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // <-- ADDED
  const fileInputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const editId = query.get("id");

  useEffect(() => {
    if (!editId) return;

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please login to continue");
          navigate("/login");
          return;
        }
        const res = await axios.get(api().getSingleProduct(editId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data?.product;
        if (!p) {
          toast.error("Product not found");
          return;
        }
        setProduct({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          oldPrice: p.oldPrice ?? "",
          category: p.category || "",
          image: p.image || null,
          inStock: p.inStock ?? true,
          stockCount: p.stockCount ?? 0,
        });
        setPreview(p.image || null);
      } catch (err) {
        console.error("Fetch product error:", err.response || err);
        toast.error("Failed to load product for editing");
      }
    };

    fetchProduct();
  }, [editId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file) => {
    setProduct((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- ADDED

    if (!product.image) {
      setLoading(false);
      return toast.error("Please upload an image");
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("description", product.description);
      fd.append("price", product.price);
      fd.append("oldPrice", product.oldPrice);
      fd.append("category", product.category);
      fd.append("stockCount", product.stockCount);
      fd.append("inStock", product.inStock);

      if (product.image && product.image instanceof File) {
        fd.append("image", product.image);
      } else if (product.image) {
        fd.append("image", product.image);
      }

      let productRes;
      if (editId) {
        productRes = await axios.put(api().updateProduct(editId), fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        productRes = await axios.post(api().addProduct, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (productRes.data.status) {
        toast.success(
          editId
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        setProduct({
          name: "",
          description: "",
          price: "",
          oldPrice: "",
          category: "",
          image: null,
          inStock: true,
          stockCount: 0,
        });
        setPreview(null);
        if (editId) navigate("/manage-products");
      } else {
        toast.error(productRes.data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add product");
    }

    setLoading(false); // <-- ADDED
  };

  return (
    <AdminSidebar>
      <div className="p-8 bg-orange-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-3">
            <PlusCircle size={28} />{" "}
            {editId ? "Edit Product" : "Add New Product"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-3xl p-8 space-y-6 border-l-4 border-orange-500"
          >
            {/* Image Upload */}
            <div
              className="border-2 border-dashed border-orange-400 rounded-xl p-6 py-10 text-center cursor-pointer hover:border-orange-600 transition"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-60 object-contain rounded-md"
                />
              ) : (
                <p className="text-orange-500 font-medium">
                  Drag & Drop Image here or Click to Upload
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
                placeholder="Enter product description"
                rows={4}
                required
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Stock Count
                </label>
                <input
                  type="number"
                  name="stockCount"
                  value={product.stockCount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Old Price ($)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={product.oldPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
                  placeholder="Optional previous price"
                />
              </div>
            </div>

            {/* Category & In Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={product.inStock}
                  onChange={handleChange}
                  className="h-5 w-5 text-orange-600 accent-orange-500"
                />
                <label className="text-gray-700 font-medium">In Stock</label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-3 bg-orange-600 text-white p-4 rounded-2xl font-semibold transition shadow-md 
              ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-orange-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>{editId ? "Update Product" : "Add Product"}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminSidebar>
  );
}

export default AddProduct;
