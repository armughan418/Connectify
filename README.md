# MERN E-Commerce Website

This is a complete E-Commerce project built using the MERN stack (MongoDB, Express, React, Node.js).  
The project includes product management, user authentication, admin dashboard, and Cloudinary image uploads.

---

## Features

- User Registration & Login (JWT Auth)
- Admin Panel for Product Management
- Add / Edit / Delete Products
- Product Image Upload using Cloudinary
- Secure API Routes with Role-Based Access
- Responsive UI (React)
- Fully Functional Backend (Express + MongoDB)
- Protected Routes (Frontend + Backend)

---

## Tech Stack

### **Frontend**

- React
- React Router
- Axios
- TailwindCSS

### **Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary for Image Storage
- Multer for File Handling

---

## 📦 Setup Instructions

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongo_connection_string

JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=xxxxxx
CLOUDINARY_API_SECRET=xxxxxx
```

### Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Cloudinary Setup

1. Cloudinary dashboard → Settings → Upload
2. Create an **Upload Preset** named: `products`
3. Set:
   - Type: **signed**
   - Folder: **products**
4. Copy Cloud Name, API Key, API Secret into `.env`

---

## 🧪 Testing

### Test Admin APIs

- Login as admin
- Create / Update / Delete products
- Upload images via Cloudinary

### Test User Side

- View products
- See product details
- Add to cart UI

---

## Notes

- Make sure Cloudinary preset name and folder name match **exactly**.
- JWT token must be sent with every protected request.
- Ensure admin role = true for admin routes.

---

## Purpose

This project is built for learning full-stack development with the MERN stack and understanding real-world e-commerce functionalities.
