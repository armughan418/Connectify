import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import StarRating from "../components/StarRating";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(api().getSingleProduct(id));
        if (res.data?.product) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.image); // default image
        }
      } catch (err) {
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(api().getReviews(id));
        setReviews(res.data.reviews || []);
      } catch {
        setReviews([]);
      }
    };

    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        api().addToCart,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Added ${quantity} item(s) to cart`);
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText.trim()) {
      toast.error("Please provide a rating and review");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${api().addReview}/${product._id}`,
        { rating, comment: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted");
      setReviewText("");
      setRating(0);

      const res = await axios.get(api().getReviews(product._id));
      setReviews(res.data.reviews || []);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-orange-500 font-bold">
        Loading...
      </div>
    );

  if (!product)
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-6xl mx-auto mt-6 space-y-10">
        {/* MAIN PRODUCT CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10 border-l-4 border-orange-500 transition">
          {/* PRODUCT IMAGES */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 shadow-inner flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="object-contain h-96 w-full rounded-xl"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 mt-2 overflow-x-auto">
              {[product.image].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`h-20 w-20 rounded-lg cursor-pointer border ${
                    selectedImage === img
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-orange-600">
                {product.name}
              </h1>

              <div className="flex items-center gap-2">
                <StarRating rating={product.avgRating ?? 0} size={18} />
                <span className="text-gray-500 text-sm">
                  {(product.avgRating ?? 0).toFixed(1)} / 5
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              <div className="text-4xl font-extrabold text-orange-600 mt-2 flex items-baseline gap-3">
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    Rs{" "}
                    {Number(product.oldPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
                <span>
                  Rs{" "}
                  {Number(product.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mt-4">
                <span className="font-semibold text-orange-600">Quantity:</span>
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 transition text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="w-16 text-center border-l border-r outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 transition text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-orange-600 hover:bg-orange-700 transition text-white font-semibold py-3 px-8 rounded-2xl shadow-md"
            >
              Add {quantity} to Cart
            </button>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-l-4 border-orange-500 transition space-y-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Ratings & Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b pb-5 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-orange-500">
                      {review.user?.name || "User"}
                    </span>
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 bg-orange-50 rounded-xl p-6 space-y-4"
          >
            <h3 className="font-bold text-lg text-orange-600">
              Submit Your Review
            </h3>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`text-3xl transition ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-300 outline-none"
              rows={3}
              placeholder="Write your review..."
              disabled={submitting}
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-2xl shadow-md font-semibold transition disabled:opacity-50"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
