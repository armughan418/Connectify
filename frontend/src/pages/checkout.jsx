import React, { useEffect, useState } from "react";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch cart and user profile
  const fetchCartAndUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch cart
      const cartRes = await axios.get(api().getCart, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cartRes.data?.cart || cartRes.data || { items: [] });

      // Fetch user profile
      const userRes = await axios.get(api().getUserProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRes.data?.status && userRes.data.user) {
        const userData = {
          name: userRes.data.user.name || "Not provided",
          email: userRes.data.user.email || "Not provided",
          phone: userRes.data.user.phone || "Not provided",
          address: userRes.data.user.address || "Not provided",
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // fallback to localStorage
        try {
          const userStr = localStorage.getItem("user");
          const localUser = userStr ? JSON.parse(userStr) : {};
          setUser({
            name: localUser.name || "Not provided",
            email: localUser.email || "Not provided",
            phone: localUser.phone || "Not provided",
            address: localUser.address || "Not provided",
          });
        } catch (parseError) {
          console.error("Error parsing user from localStorage:", parseError);
          setUser({
            name: "Not provided",
            email: "Not provided",
            phone: "Not provided",
            address: "Not provided",
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart or user:", err);
      toast.error("Failed to load cart or user data");

      try {
        const userStr = localStorage.getItem("user");
        const localUser = userStr ? JSON.parse(userStr) : {};
        setUser({
          name: localUser.name || "Not provided",
          email: localUser.email || "Not provided",
          phone: localUser.phone || "Not provided",
          address: localUser.address || "Not provided",
        });
      } catch (parseError) {
        console.error("Error parsing user from localStorage:", parseError);
        setUser({
          name: "Not provided",
          email: "Not provided",
          phone: "Not provided",
          address: "Not provided",
        });
      }
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndUser();
  }, []);

  // Safe subtotal calculation
  const subtotal = (cart.items || []).reduce(
    (sum, it) => sum + (it.product?.price || it.price || 0) * (it.quantity || 1),
    0
  );

  const shipping = 200;
  const tax = 100;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setPlacing(true);

    if ((cart.items || []).length === 0) {
      toast.error("Your cart is empty");
      navigate("/shopping-cart");
      setPlacing(false);
      return;
    }

    if (!user || !user.address || user.address === "Not provided" || user.address.trim() === "") {
      toast.error("Please update your address in profile before placing order");
      navigate("/user-profile");
      setPlacing(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Ensure address is not empty
      const address = user.address.trim();
      if (!address || address === "Not provided") {
        toast.error("Please provide a valid address");
        setPlacing(false);
        return;
      }

      const res = await axios.post(
        api().createOrder,
        {
          shippingAddress: {
            address: address,
            city: "City",
            postalCode: "00000",
            country: "Pakistan",
          },
          paymentMethod: "COD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.order?._id) {
        toast.success("Order placed successfully");
        navigate(`/order-summary/${res.data.order._id}`);
      } else {
        toast.error(res.data?.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading)
    return <p className="p-8 text-center text-gray-500">Loading...</p>;

  if (!user)
    return (
      <p className="p-8 text-center text-gray-500">Loading user details...</p>
    );

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Customer Details */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-gray-600">{user.name}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">{user.phone}</p>
            </div>
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-gray-600">{user.address}</p>
            </div>
          </div>

          {(user.phone === "Not provided" ||
            user.address === "Not provided") && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700 mb-2">
                ⚠️ Please update your phone number and address in your profile
                before placing the order.
              </p>
              <button
                onClick={() => navigate("/user-profile")}
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Order Details
          </h2>
          <div className="space-y-3">
            {(cart.items || []).map((it, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-semibold">
                    {it.product?.name || "Product"}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                </div>
                <p className="font-semibold">
                  Rs{" "}
                  {(
                    (it.product?.price || it.price || 0) * it.quantity
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-300 pt-4 space-y-2 text-gray-800">
            <div className="flex justify-between">
              Subtotal: Rs {subtotal.toLocaleString()}
            </div>
            <div className="flex justify-between">
              Shipping: Rs {shipping.toLocaleString()}
            </div>
            <div className="flex justify-between">
              Tax: Rs {tax.toLocaleString()}
            </div>
            <div className="flex justify-between font-bold text-lg">
              Total: Rs {total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Place Order */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-200 text-center">
          <p className="text-gray-700 mb-4">
            Review your order carefully. Click the button below to place your
            order.
          </p>
          <button
            onClick={handlePlaceOrder}
            disabled={
              placing || !user.address || user.address === "Not provided"
            }
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
