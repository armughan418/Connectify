import { useState } from "react";
import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  PlusCircle,
  Boxes,
  Star,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import { FaFirstOrder } from "react-icons/fa";
import { NavLink, useNavigate, Outlet } from "react-router-dom";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin-dashboard",
    },
    { name: "Users", icon: <Users size={20} />, path: "/user-table" },
    { name: "Orders", icon: <FaFirstOrder size={20} />, path: "/admin-orders" },
    {
      name: "Add Product",
      icon: <PlusCircle size={20} />,
      path: "/add-products",
    },
    {
      name: "Manage Products",
      icon: <Boxes size={20} />,
      path: "/manage-products",
    },
    {
      name: "Rating & Reviews",
      icon: <Star size={20} />,
      path: "/rating-and-reviews",
    },
    {
      name: "Add Carousel",
      icon: <SlidersHorizontal size={20} />,
      path: "/add-carousel",
    },
    {
      name: "Carousel Settings",
      icon: <Settings size={20} />,
      path: "/set-carousel",
    },
  ];

  return (
    <div className="flex w-full bg-gray-100 min-h-screen">
      {/* === SIDEBAR === */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg border-r z-50
          transform transition-all duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
          ${sidebarCollapsed ? "md:w-20" : "md:w-64"}
          w-64
        `}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between gap-2 p-5 font-bold text-xl text-indigo-700 border-b">
          <span className={`${sidebarCollapsed ? "hidden" : "inline"}`}>
            ⚡ Connectify
          </span>
          <button
            className="p-1 rounded-md hover:bg-gray-200 md:block hidden"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="px-2 mt-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-indigo-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
              onClick={() => setSidebarOpen(false)} // Mobile: close sidebar on click
            >
              {item.icon}
              {!sidebarCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* === MOBILE OVERLAY === */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* === MAIN AREA === */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-20">
        {/* === TOP NAVBAR === */}
        {/* === TOP NAVBAR === */}
        <header className="flex items-center justify-between bg-indigo-700 h-14 px-4 md:px-6 shadow-md">
          {/* Sidebar toggle (left side) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-indigo-500 text-white md:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Right side - User icon */}
          <div className="ml-auto relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition"
            >
              <User size={20} className="text-indigo-700" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border shadow-lg rounded-xl py-2 z-50">
                <button
                  onClick={() => navigate("/user-profile")}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left transition"
                >
                  <User size={18} /> My Profile
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-left transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* === PAGE CONTENT === */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
