import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";

function OrderSummary() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(api().getOrder(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data?.order || res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <p className="p-8 text-center">Loading order...</p>;
  if (!order)
    return <p className="p-8 text-center text-red-500">Order not found</p>;

  const items = order.items || [];
  const subtotal = order.subtotal || 0;
  const shipping = order.shippingPrice || 200;
  const tax = order.taxPrice || 400;
  const total = order.totalPrice || subtotal + shipping + tax;
  const user = order.user || {
    name: "John Doe",
    email: "john@example.com",
    address: "No address",
  };

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Thank You!</h2>
        <p className="mb-4 text-gray-700">
          Your order has been placed successfully.
        </p>

        <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Address: {user.address}</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Order Details</h3>
        {items.map((it, idx) => (
          <div
            key={idx}
            className="flex justify-between py-2 border-b border-gray-200"
          >
            <div>
              <p className="font-medium">{it.product?.name || "Product"}</p>
              <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
            </div>
            <p className="font-semibold">
              Rs{" "}
              {(it.price * it.quantity).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}

        <div className="mt-4 border-t border-gray-300 pt-4">
          <div className="flex justify-between">
            Subtotal: Rs {subtotal.toLocaleString()}
          </div>
          <div className="flex justify-between">
            Shipping: Rs {shipping.toLocaleString()}
          </div>
          <div className="flex justify-between">
            Tax: Rs {tax.toLocaleString()}
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            Total: Rs {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
