import React, { useEffect, useState } from "react";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items safely
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(api().getCart, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: res.data?.cart?.items || [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        api().updateCartItem,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(api().removeFromCart(productId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item removed from cart");
      fetchCart();
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const subtotal = (cart.items || []).reduce(
    (sum, it) => sum + (it.product?.price || it.price || 0) * it.quantity,
    0
  );

  const shipping = 200;
  const tax = 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 space-y-6 border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Shopping Cart
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading cart...</p>
          ) : (cart.items || []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {(cart.items || []).map((it) => (
                <div
                  key={it.product?._id || it._id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-28 h-28 bg-white rounded-lg p-2 flex items-center justify-center border border-gray-200">
                    <img
                      src={it.product?.image}
                      alt={it.product?.name}
                      className="object-contain h-full w-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 w-full">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {it.product?.name || "Unknown Product"}
                      </h4>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              it.product?._id,
                              it.quantity - 1
                            )
                          }
                          className="px-2 py-1 bg-orange-100 rounded text-orange-600 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              it.product?._id,
                              Math.max(1, Number(e.target.value))
                            )
                          }
                          className="w-12 text-center border rounded"
                        />
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              it.product?._id,
                              it.quantity + 1
                            )
                          }
                          className="px-2 py-1 bg-orange-100 rounded text-orange-600 font-bold"
                        >
                          +
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(it.product?._id)}
                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-lg font-semibold text-orange-600">
                      Rs{" "}
                      {(
                        (it.product?.price || it.price || 0) * it.quantity
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500 h-max sticky top-24">
          <h3 className="text-xl font-semibold text-orange-600 mb-4">
            Order Summary
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                Rs{" "}
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Rs {shipping.toLocaleString()}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span>Tax</span>
              <span>Rs {tax.toLocaleString()}</span>
            </li>
            <li className="flex justify-between font-semibold text-gray-900 text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>
                Rs{" "}
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
          </ul>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition"
            >
              Continue to Checkout
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 border border-gray-300 text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
