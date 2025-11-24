import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Carousel from "../components/caroseul";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import StarRating from "../components/StarRating";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products and their ratings
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api().getProducts);
      if (res.data?.status) {
        const productsList = res.data.products || [];

        // Fetch reviews for each product to calculate avgRating
        const productsWithRating = await Promise.all(
          productsList.map(async (product) => {
            try {
              const reviewsRes = await axios.get(api().getReviews(product._id));
              const reviews = reviewsRes.data?.reviews || [];
              const avgRating =
                reviews.length > 0
                  ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  : 0;
              return { ...product, avgRating };
            } catch {
              return { ...product, avgRating: 0 };
            }
          })
        );

        setProducts(productsWithRating);
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      await axios.post(
        api().addToCart,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMsg);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-orange-500 font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Carousel />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-orange-600 mb-6">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition relative flex flex-col"
              >
                {/* Clickable image and title to navigate */}
                <div
                  onClick={() => handleProductClick(product._id)}
                  className="cursor-pointer"
                >
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 object-contain"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mt-3 text-gray-800">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={product.avgRating ?? 0} size={16} />
                    <span className="text-gray-600 text-sm">
                      {(product.avgRating ?? 0).toFixed(1)}
                    </span>
                  </div>

                  {/* Old Price (if exists) */}
                  {product.oldPrice && product.oldPrice > product.price && (
                    <p className="text-gray-400 text-sm line-through">
                      Rs{" "}
                      {Number(product.oldPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  )}

                  {/* Current Price */}
                  <p className="text-orange-600 font-bold text-xl mt-1">
                    Rs{" "}
                    {Number(product.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-xl shadow-md font-semibold transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
