import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";

function OrderHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get(api().getOrder(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data?.order || res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order");
        toast.error(err.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    const fetchCartAsOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get(api().getCart, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cart = res.data?.cart || res.data || { items: [] };
        const items = (cart.items || []).map((it) => ({
          product: it.product,
          quantity: it.quantity,
          price: it.product?.price || it.price || 0,
        }));
        const subtotal = items.reduce(
          (s, it) => s + (it.price || 0) * (it.quantity || 1),
          0
        );
        const shippingPrice = 2.0;
        const taxPrice = 4.0;
        const totalPrice = subtotal + shippingPrice + taxPrice;

        setOrder({ items, subtotal, shippingPrice, taxPrice, totalPrice });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart");
        toast.error(err.response?.data?.message || "Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
    else fetchCartAsOrder();
  }, [id]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading order...</div>
    );
  if (error || !order)
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Order not found"}
      </div>
    );

  const user = order.user || {};
  const address = order.shippingAddress || {};
  const items = order.items || [];

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white p-6 rounded-2xl shadow-xl border border-orange-200">
        {/* Header */}
        <div className="pb-5 border-b border-gray-200 flex justify-between items-start flex-col md:flex-row gap-4">
          <div>
            <h3 className="text-2xl font-bold text-orange-600">
              Order Summary
            </h3>
            {order._id && (
              <p className="text-slate-500 text-xs mt-1 font-medium">
                Order ID:{" "}
                <span className="text-orange-700 font-bold">{order._id}</span>
              </p>
            )}
          </div>
          <div className="bg-orange-50 p-4 rounded-xl shadow-sm w-full md:w-auto">
            <h4 className="text-orange-600 font-semibold mb-1">
              Customer Info
            </h4>
            <p className="text-sm text-slate-700">
              <span className="font-medium">Name:</span> {user.name || "-"}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium">Email:</span> {user.email || "-"}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium">Phone:</span> {user.phone || "-"}
            </p>
            <p className="text-sm text-slate-700 mt-2">
              <span className="font-medium">Address:</span>{" "}
              {address.street || address.address || "-"}, {address.city || "-"},{" "}
              {address.state || "-"}, {address.postalCode || "-"},{" "}
              {address.country || "-"}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="divide-y divide-gray-200 mt-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">No items in this order.</p>
          ) : (
            items.map((item, idx) => (
              <ItemCard
                key={item._id || idx}
                img={
                  item.product?.image ||
                  item.productImage ||
                  "https://via.placeholder.com/80"
                }
                name={item.product?.name || item.productName || "Product"}
                size={item.size || "-"}
                qty={item.quantity || 1}
                price={`Rs ${(item.price || item.product?.price || 0).toFixed(2)}`}
                status={order.status || "Processing"}
              />
            ))
          )}
        </div>

        {/* Price Summary */}
        <div className="mt-8 pt-4 border-t border-gray-300 max-w-md ml-auto">
          <div className="flex justify-between text-slate-600 text-sm font-medium py-3">
            <span>Subtotal</span>
            <span>
              Rs {order.subtotal?.toFixed(2) || order.totalPrice?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 text-sm font-medium py-3">
            <span>Shipping</span>
            <span>Rs {order.shippingPrice?.toFixed(2) || order.shippingFee?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between text-slate-600 text-sm font-medium py-3">
            <span>Tax</span>
            <span>Rs {order.taxPrice?.toFixed(2) || order.tax?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 py-3">
            <span>Total</span>
            <span>Rs {order.totalPrice?.toFixed(2) || "0.00"}</span>
          </div>

          {!id && (
            <>
              <button
                disabled={!localStorage.getItem("authToken")}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("authToken");
                    if (!token) {
                      toast.error("Please login to place an order");
                      return;
                    }
                    // Get user profile for shipping address
                    const userRes = await axios.get(api().getUserProfile, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    const user = userRes.data?.user;
                    if (!user || !user.address || user.address === "Not provided") {
                      toast.error("Please update your address in profile before placing order");
                      navigate("/user-profile");
                      return;
                    }

                    const res = await axios.post(
                      api().createOrder,
                      {
                        shippingAddress: {
                          address: user.address,
                          city: "City",
                          postalCode: "00000",
                          country: "Pakistan",
                        },
                        paymentMethod: "COD",
                      },
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (res.status === 201 && res.data && res.data.order && res.data.order._id) {
                      toast.success("Order placed successfully");
                      navigate(`/order-summary/${res.data.order._id}`);
                    } else {
                      toast.error(res.data?.message || "Failed to place order");
                    }
                  } catch (err) {
                    toast.error(
                      err.response?.data?.message || "Failed to place order"
                    );
                  }
                }}
                className={`w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl text-center font-semibold shadow-md transition ${
                  !localStorage.getItem("authToken")
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                Place Order
              </button>
              {!localStorage.getItem("authToken") && (
                <p className="text-center text-red-500 mt-2 text-sm">
                  You must be logged in to place an order.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemCard({ img, name, size, qty, price, status }) {
  return (
    <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-6 py-5 items-start">
      {/* Image + Details */}
      <div className="col-span-2 flex items-center gap-5 max-sm:flex-col">
        <div className="bg-gray-100 p-3 rounded-xl w-24 h-24 shadow-sm">
          <img src={img} className="w-full h-full object-contain" alt={name} />
        </div>
        <div>
          <h6 className="text-base font-semibold text-slate-900">{name}</h6>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-slate-500 font-medium">
              Size: <span className="ml-1">{size}</span>
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Qty: <span className="ml-1">{qty}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Status */}
      <div>
        <h6 className="text-sm font-semibold text-slate-900">Status</h6>
        <p className="bg-orange-50 text-xs font-medium text-orange-600 mt-2 inline-block rounded-md py-1 px-3 shadow-sm">
          {status}
        </p>
      </div>
      {/* Price */}
      <div className="ml-auto">
        <h6 className="text-sm font-semibold text-slate-900">Price</h6>
        <p className="text-sm text-slate-900 font-medium mt-2">{price}</p>
      </div>
    </div>
  );
}

export default OrderHistory;
