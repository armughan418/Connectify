const Product = require("../models/product");
const Review = require("../models/review");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, uploadedImage) => {
        if (error) return reject(error);
        resolve(uploadedImage);
      }
    );
    stream.end(fileBuffer);
  });
};

const addProduct = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const {
      name,
      description,
      price,
      oldPrice,
      category,
      stockCount,
      inStock,
    } = req.body;

    // Support two flows:
    // 1) Client uploads image directly to Cloudinary and sends `image` URL in body
    // 2) Client sends multipart/form-data and `req.file` is present (server uploads to Cloudinary)
    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadedImage.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Image is required" });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      oldPrice: oldPrice !== undefined ? Number(oldPrice) : undefined,
      category,
      stockCount: Number(stockCount) || 0,
      inStock: inStock === "true" || inStock === true,
      image: imageUrl,
    });

    await product.save();

    res.status(201).json({
      status: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Aggregate reviews from the separate Review collection to compute
    // average rating and review counts per product. This keeps ratings
    // in sync whether reviews are stored in Product.reviews or the
    // separate Review model.
    const agg = await Review.aggregate([
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const reviewMap = new Map(agg.map((r) => [r._id.toString(), r]));

    const productsWithRatings = products.map((p) => {
      const info = reviewMap.get(p._id.toString());
      const rating = info && info.avgRating ? Number(info.avgRating) : 0;
      const numReviews = info ? info.count : p.numReviews || 0;
      return {
        ...p._doc,
        rating,
        numReviews,
      };
    });

    res.status(200).json({ status: true, products: productsWithRatings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    // Also aggregate reviews for this product from Review collection
    const reviews = await Review.find({ product: product._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const numReviews = reviews.length;
    const avgRating = numReviews
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews
      : 0;

    const productObj = {
      ...product._doc,
      avgRating,
      numReviews,
      reviews,
    };

    res.status(200).json({ status: true, product: productObj });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    // Handle image updates: support file upload or image URL in body
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      product.image = uploadedImage.secure_url;
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    // Merge other updatable fields (avoid overwriting image again)
    const updates = { ...req.body };
    // Remove image field if present (already handled above)
    delete updates.image;

    // Normalize types for known fields coming from multipart/form-data
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.oldPrice !== undefined)
      updates.oldPrice = Number(updates.oldPrice);
    if (updates.stockCount !== undefined) {
      updates.stockCount = Number(updates.stockCount) || 0;
      // Auto update inStock based on stockCount
      updates.inStock = updates.stockCount > 0;
    }
    if (updates.inStock !== undefined)
      updates.inStock =
        updates.inStock === "true" ||
        updates.inStock === true ||
        updates.inStock === "1";

    // Ensure category is applied as string if provided
    if (updates.category !== undefined)
      updates.category = String(updates.category);

    Object.assign(product, updates);

    await product.save();

    res.status(200).json({ status: true, message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    await product.deleteOne();
    res
      .status(200)
      .json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    if (!rating || rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ status: false, message: "Invalid rating value" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed)
      return res
        .status(400)
        .json({ status: false, message: "Product already reviewed" });

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating,
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ status: true, message: "Review added", product });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
