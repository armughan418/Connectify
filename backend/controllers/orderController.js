const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const sendEmail = require("../utils/sendMail"); // nodemailer helper

// ------------------------------
// HELPER: CALCULATE SUBTOTAL
// ------------------------------
const calculateCartTotals = (cart) => {
  let subtotal = 0;
  cart.items.forEach((item) => {
    subtotal += item.product.price * item.quantity;
  });
  return subtotal;
};

// ------------------------------
// HELPER: CALCULATE SUMMARY
// ------------------------------
const calculateOrderSummary = (subtotal) => {
  const taxRate = 0.1; // 10%
  const shippingFee = subtotal > 3000 ? 0 : 250;
  const discount = subtotal > 5000 ? 500 : 0;

  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingFee - discount;

  return { subtotal, tax, shippingFee, discount, total };
};

// ----------------------------------------------------
// CREATE ORDER
// ----------------------------------------------------
exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // STOCK VALIDATION
    for (let item of cart.items) {
      if (item.quantity > item.product.stockCount) {
        return res.status(400).json({
          message: `${item.product.name} only ${item.product.stockCount} items available`,
        });
      }
    }

    // VALIDATE AND SET DEFAULT SHIPPING ADDRESS
    let finalShippingAddress = shippingAddress;
    
    // If shippingAddress is missing or incomplete, get from user profile
    if (!finalShippingAddress || 
        !finalShippingAddress.address || 
        finalShippingAddress.address === "Not provided" ||
        !finalShippingAddress.city ||
        !finalShippingAddress.postalCode) {
      
      const User = require("../models/user");
      const user = await User.findById(userId);
      
      if (user && user.address && user.address !== "Not provided") {
        finalShippingAddress = {
          address: user.address,
          city: shippingAddress?.city || "City",
          postalCode: shippingAddress?.postalCode || "00000",
          country: shippingAddress?.country || "Pakistan",
        };
      } else {
        return res.status(400).json({ 
          status: false,
          message: "Shipping address is required. Please update your address in profile." 
        });
      }
    }

    // Ensure all required fields are present
    if (!finalShippingAddress.address || 
        !finalShippingAddress.city || 
        !finalShippingAddress.postalCode) {
      return res.status(400).json({ 
        status: false,
        message: "Shipping address must include address, city, and postal code" 
      });
    }

    // Set default country if not provided
    if (!finalShippingAddress.country) {
      finalShippingAddress.country = "Pakistan";
    }

    const subtotal = calculateCartTotals(cart);
    const summary = calculateOrderSummary(subtotal);

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: finalShippingAddress,
      paymentMethod: paymentMethod || "COD",
      subtotal: summary.subtotal,
      tax: summary.tax,
      shippingFee: summary.shippingFee,
      discount: summary.discount,
      totalPrice: summary.total,
      status: "Pending",
      timeline: [{ status: "Pending" }],
      emailNotification: {
        orderPlaced: false,
        orderShipped: false,
        orderDelivered: false,
      },
    });

    // REDUCE STOCK
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stockCount: -item.quantity },
      });
    }

    // CLEAR CART
    cart.items = [];
    await cart.save();

    // SEND EMAIL
    await sendEmail(
      req.user.email,
      "Order Placed Successfully",
      `<h3>Thank you for your order!</h3><p>Order ID: <b>${order._id}</b></p>`
    );

    order.emailNotification.orderPlaced = true;
    await order.save();

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------
// GET MY ORDERS
// ----------------------------------------------------
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.json({ status: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------
// ADMIN: GET ALL ORDERS
// ----------------------------------------------------
exports.getAllOrders = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && !req.user.isAdmin)) {
      return res
        .status(403)
        .json({ status: false, message: "Access denied: Admins only" });
    }

    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "name email");

    res.json({ status: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------
// GET ORDER BY ID
// ----------------------------------------------------
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ status: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------
// UPDATE ORDER STATUS (ADMIN)
// ----------------------------------------------------
exports.updateOrderStatus = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && !req.user.isAdmin)) {
      return res
        .status(403)
        .json({ status: false, message: "Access denied: Admins only" });
    }

    const order = await Order.findById(req.params.id).populate("user");
    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    const newStatus = req.body.status;
    
    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ 
        status: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    // Don't update if status is same
    if (order.status === newStatus) {
      return res.json({
        status: true,
        message: "Status is already set to this value",
        order,
      });
    }

    // Update status (pre-save hook will handle timeline automatically)
    order.status = newStatus;

    // Ensure emailNotification exists
    if (!order.emailNotification) {
      order.emailNotification = {
        orderPlaced: false,
        orderShipped: false,
        orderDelivered: false,
      };
    }

    // Update email notification flags
    order.emailNotification.orderShipped = newStatus === "Shipped";
    order.emailNotification.orderDelivered = newStatus === "Delivered";

    await order.save();

    // SEND EMAIL (don't let email failure break the update)
    if (order.user && order.user.email) {
      try {
        await sendEmail(
          order.user.email,
          `Order Status Updated`,
          `<p>Your order <b>${order._id}</b> status is now <b>${newStatus}</b>.</p>`
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      status: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ 
      status: false, 
      message: err.message || "Failed to update order status" 
    });
  }
};
