import "./App.css";
import ForgetPassword from "./pages/forget-password";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import ProductDetails from "./pages/productDetails";
import Login from "./pages/login";
import Otp from "./pages/otp";
import Signup from "./pages/signup";
import UpdatePassword from "./pages/updatePassword";
import Super from "./components/super";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/notFound";
import Navbar from "./components/navbar";
import OrderHistory from "./pages/orderHistory";
import ShoppingCart from "./pages/shoppingCart";
import OrderSummary from "./pages/orderSummary";
import OrderTracking from "./pages/orderTracking";
import UserTable from "./pages/userTable";
import AdminSidebar from "./components/adminSidebar";
import AdminDashboard from "./pages/adminDashboard";
import SearchProducts from "./pages/searchProducts";
import AddProduct from "./pages/addProduct";
import Carousel from "./components/caroseul";
import CarouselImages from "./pages/addCarousel";
import RatingReviews from "./pages/ratingReviews";
import ManageProducts from "./pages/manageProduct";
import CarouselSetting from "./pages/CarouselSetting";
import AddCarousel from "./pages/addCarousel";
import Profile from "./pages/profile";
import Checkout from "./pages/checkout";
import AdminOrders from "./pages/adminOrders";
import AdminRoute from "./components/adminRoute";

function App() {
  const location = useLocation();
  
  // Admin routes where navbar should be hidden
  const adminRoutes = [
    "/admin-dashboard",
    "/admin-orders",
    "/user-table",
    "/add-products",
    "/manage-products",
    "/add-carousel",
    "/rating-and-reviews",
    "/set-carousel",
  ];
  
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<Otp />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search-products" element={<SearchProducts />} />

        {/* Protected User Routes */}
        <Route element={<Super />}>
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/order-summary/:id" element={<OrderSummary />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/user-profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-orders" element={<AdminOrders />} />
          <Route path="/user-table" element={<UserTable />} />
          <Route path="/add-products" element={<AddProduct />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/add-carousel" element={<AddCarousel />} />
          <Route path="/rating-and-reviews" element={<RatingReviews />} />
          <Route path="/set-carousel" element={<CarouselSetting />} />
        </Route>

        {/* Remove these unprotected routes */}
        {/* <Route path="/admin-sidebar" element={<AdminSidebar />} /> ❌ Remove */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

export default App;
