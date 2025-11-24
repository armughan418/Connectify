import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

export default function OrderTracking() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        let res;
        if (id) {
          res = await axios.get(api().getOrder(id), {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrder(res.data?.order || res.data);
        } else {
          // No id provided - fetch user's most recent order
          const base = new URL(api().getOrders).origin;
          res = await axios.get(`${base}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = res.data?.orders || res.data;
          if (Array.isArray(list) && list.length > 0) {
            // pick most recent
            const recent = list[list.length - 1];
            setOrder(recent);
            // update URL with id for shareability
            navigate(`/order-tracking?id=${recent._id}`, { replace: true });
          } else {
            setError("No orders found for this user");
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.search, navigate]);

  const renderStep = (title, subtitle, done) => (
    <li
      className={`p-4 rounded-xl shadow-sm ${
        done
          ? "bg-orange-50 hover:bg-orange-100"
          : "bg-gray-100 hover:bg-gray-200"
      } transition`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full shadow ${
          done ? "bg-orange-200" : "bg-gray-300"
        }`}
      >
        {done ? "✓" : ""}
      </span>
      <h4 className="font-semibold text-slate-900 mt-3">{title}</h4>
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
    </li>
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-8 text-center">No order data</div>;

  // Determine statuses
  const steps = [
    { key: "Pending", title: "Order Placed", time: order.createdAt },
    {
      key: "Shipped",
      title: "Arrived at courier warehouse",
      time: order.updatedAt,
    },
    { key: "OutForDelivery", title: "Out for delivery", time: null },
    { key: "Delivered", title: "Delivered", time: null },
  ];

  // Map order.status to completion
  const statusOrder = ["Pending", "Shipped", "Delivered"];
  const currentIndex = Math.max(0, statusOrder.indexOf(order.status));

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-orange-500">
        <h1 className="text-2xl font-bold text-orange-600">Order Tracking</h1>
        <p className="text-gray-600 mt-1 text-sm">Tracking ID: #{order._id}</p>
      </div>

      {/* Tracking Steps */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mt-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-6">
          Order Status Timeline
        </h2>

        <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const done = idx <= currentIndex;
            const time =
              idx === 0 ? order.createdAt : done ? order.updatedAt : s.time;
            const subtitle = time
              ? new Date(time).toLocaleString()
              : idx === 2 && done
              ? "Courier on the way"
              : idx === 2
              ? "Courier is processing"
              : idx === 3
              ? "Expected delivery soon"
              : "";
            return (
              <React.Fragment key={s.key}>
                {renderStep(s.title, subtitle, done)}
              </React.Fragment>
            );
          })}
        </ul>
      </div>

      {/* Product List & Billing */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {/* Products Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-orange-600 border-b pb-2">
            Products
          </h3>

          <div className="space-y-5 mt-6">
            {(order.items || []).map((item) => (
              <div
                key={item._id || item.product._id}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition"
              >
                <div className="col-span-2 flex items-center gap-4">
                  <img
                    src={item.product?.image || item.image || "https://via.placeholder.com/80"}
                    alt={item.product?.name || item.name || "product"}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-100 p-2"
                  />
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {item.product?.name || item.name || "Product"}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>
                <p className="text-right font-semibold text-orange-600">
                  Rs {((item.price || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-orange-600 border-b pb-2">
            Billing Details
          </h3>

          <ul className="mt-6 text-sm font-medium space-y-4">
            <li className="flex justify-between text-slate-700">
              Subtotal{" "}
              <span className="text-slate-900 font-semibold">
                Rs {(order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0).toFixed(2)}
              </span>
            </li>
            <li className="flex justify-between text-slate-700">
              Shipping{" "}
              <span className="text-slate-900 font-semibold">Rs {order.shippingFee?.toFixed(2) || order.shippingPrice?.toFixed(2) || "0.00"}</span>
            </li>
            <li className="flex justify-between text-slate-700">
              Tax <span className="text-slate-900 font-semibold">Rs {order.tax?.toFixed(2) || order.taxPrice?.toFixed(2) || "0.00"}</span>
            </li>

            <hr />

            <li className="flex justify-between text-lg text-slate-900 font-bold">
              Total <span>Rs {order.totalPrice.toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
