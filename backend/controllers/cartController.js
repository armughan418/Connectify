const Cart = require("../models/cart.js");
const Product = require("../models/product.js");

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({
        status: false,
        message: "Product ID is required to add item to cart",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found. The product may have been removed.",
      });
    }

    if (quantity > product.stockCount) {
      return res.status(400).json({
        status: false,
        message: `Insufficient stock. Only ${product.stockCount} units available.`,
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
      return res.json({
        status: true,
        cart,
        message: "Item added to cart successfully",
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > product.stockCount) {
        return res.status(400).json({
          status: false,
          message: `Cannot add more items. Only ${product.stockCount} units available in stock.`,
        });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({
      status: true,
      cart,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      status: false,
      message:
        "Server error: Failed to add item to cart. Please try again later.",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    res.json({ status: true, cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (quantity <= 0)
      return res.status(400).json({ message: "Quantity must be > 0" });

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stockCount)
      return res.status(400).json({
        message: `Only ${product.stockCount} units available`,
      });

    item.quantity = quantity;
    await cart.save();

    res.json({ status: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ status: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};
