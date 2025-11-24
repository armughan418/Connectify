const mongoose = require("mongoose");

// Timeline schema for tracking order updates
const statusTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ],
  },
  updatedAt: { type: Date, default: Date.now },
});

// Each ordered item
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // price at order time
});

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "Pakistan" },
    },

    paymentMethod: { type: String, default: "COD" },

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // IMPORTANT: timeline tracking
    timeline: [statusTimelineSchema],

    // For email notifications
    emailNotification: {
      orderPlaced: { type: Boolean, default: false },
      orderShipped: { type: Boolean, default: false },
      orderDelivered: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Auto add first timeline entry when order is created
orderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.timeline.push({ status: this.status });
  }
  next();
});

// Add timeline entry when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.timeline.push({ status: this.status });
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
