import "./App.css";
import ForgetPassword from "./pages/forget-password";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Otp from "./pages/otp";
import Signup from "./pages/signup";
import UpdatePassword from "./pages/updatePassword";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/notFound";
import UserTable from "./pages/userTable";
import AdminRoute from "./components/adminRoute";
import UserProfile from "./pages/userProfile";
import UserOwnProfile from "./pages/UserOwnProfile";
import UserConnections from "./pages/userConnections";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import Search from "./pages/Search";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import { SocketProvider } from "./context/SocketContext";
import authService from "./services/authService";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import LayoutWithNavbarSocial from "./components/LayoutWithNavbarSocial";
import MaintenanceMode from "./components/MaintenanceMode";
import useSessionTimeout from "./hooks/useSessionTimeout";

function App() {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  useSessionTimeout();

  const isMaintenanceMode = () => {
    const maintenance = localStorage.getItem("maintenanceMode");
    if (maintenance) {
      try {
        return JSON.parse(maintenance);
      } catch {
        return false;
      }
    }
    return false;
  };

  const maintenanceActive = isMaintenanceMode();
  const isAdmin =
    currentUser?.role === "admin" || currentUser?.isAdmin === true;
  const isAdminDashboardRoute =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/admin-panel") ||
    location.pathname.startsWith("/user-table");
  const isPublicRoute =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forget-password" ||
    location.pathname === "/otp-verification" ||
    location.pathname === "/update-password" ||
    location.pathname === "/";

  if (
    maintenanceActive &&
    !isAdmin &&
    !isAdminDashboardRoute &&
    !isPublicRoute
  ) {
    return <MaintenanceMode />;
  }

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/otp-verification" element={<Otp />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/" element={<Home />} />

          <Route element={<LayoutWithNavbarSocial />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Route>

          <Route element={<LayoutWithNavbar />}>
            <Route path="/user/own-profile" element={<UserOwnProfile />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-profile/:id" element={<UserProfile />} />
            <Route path="/user/connections" element={<UserConnections />} />

            <Route element={<AdminRoute />}>
              <Route path="/user-table" element={<UserTable />} />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<AdminProfile />} />
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
