const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const upload = require("../middlewares/multer");
const userAuth = require("../middlewares/userAuth");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.get("/signature", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "social-media";

  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    process.env.CLOUD_API_SECRET
  );

  res.json({
    status: true,
    data: {
      signature,
      timestamp,
      apiKey: process.env.CLOUD_API_KEY,
      folder,
      cloudName: process.env.CLOUD_NAME,
    },
  });
});

router.post("/upload", userAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "No file provided" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "social-media",
      resource_type: "auto",
    });

    res.status(200).json({
      status: true,
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
});

router.delete("/delete/:publicId", userAuth, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res
        .status(400)
        .json({ status: false, message: "Public ID is required" });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      status: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
