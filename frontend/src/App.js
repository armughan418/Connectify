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
import SearchProducts from "./pages/searchProducts";
import AddProduct from "./pages/addProduct";
import AddCarousel from "./pages/addCarousel";
import RatingReviews from "./pages/ratingReviews";
import ManageProducts from "./pages/manageProduct";
import CarouselSetting from "./pages/CarouselSetting";
import Checkout from "./pages/checkout";
import AdminOrders from "./pages/adminOrders";
import AdminRoute from "./components/adminRoute";
import UserProfile from "./pages/userProfile";
import UserOwnProfile from "./pages/UserOwnProfile";
import UserConnections from "./pages/userConnections";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import AdminPanel from "./pages/AdminPanel";
import { SocketProvider } from "./context/SocketContext";
import authService from "./services/authService";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import LayoutWithNavbarSocial from "./components/LayoutWithNavbarSocial";

function App() {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

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
    "/admin-panel",
  ];

  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const socialMediaRoutes = ["/feed", "/messages", "/friends", "/admin-panel"];
  const isSocialMediaRoute = socialMediaRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <SocketProvider userId={currentUser?._id}>
        <Routes>
          {/* Public Routes - No Navbar (has own navigation) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/otp-verification" element={<Otp />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/" element={<Home />} />

          {/* Social Media Routes - NavbarSocial */}
          <Route element={<LayoutWithNavbarSocial />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Route>

          {/* Routes with Regular Navbar */}
          <Route element={<LayoutWithNavbar />}>
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/search-products" element={<SearchProducts />} />
          <Route path="/user/own-profile" element={<UserOwnProfile />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
            <Route path="/user/connections" element={<UserConnections />} />

            {/* Protected User Routes */}
            <Route element={<Super />}>
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/shopping-cart" element={<ShoppingCart />} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="/order-summary/:id" element={<OrderSummary />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin-orders" element={<AdminOrders />} />
              <Route path="/user-table" element={<UserTable />} />
              <Route path="/add-products" element={<AddProduct />} />
              <Route path="/manage-products" element={<ManageProducts />} />
              <Route path="/add-carousel" element={<AddCarousel />} />
              <Route path="/rating-and-reviews" element={<RatingReviews />} />
              <Route path="/set-carousel" element={<CarouselSetting />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>

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
