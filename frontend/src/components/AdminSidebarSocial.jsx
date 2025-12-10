import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Plus,
  Package,
  Star,
  Image,
  Menu,
  X,
} from "lucide-react";

const AdminSidebarSocial = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin-panel",
    },
    {
      label: "Reports",
      icon: <LayoutDashboard size={20} />,
      path: "/admin-panel",
    },
    {
      label: "Users",
      icon: <Users size={20} />,
      path: "/admin-panel",
    },
  ];

  const ecommerceItems = [
    {
      label: "Orders",
      icon: <ShoppingCart size={20} />,
      path: "/admin-orders",
    },
    {
      label: "Add Product",
      icon: <Plus size={20} />,
      path: "/add-products",
    },
    {
      label: "Manage Products",
      icon: <Package size={20} />,
      path: "/manage-products",
    },
    {
      label: "Reviews",
      icon: <Star size={20} />,
      path: "/rating-and-reviews",
    },
    {
      label: "Carousel",
      icon: <Image size={20} />,
      path: "/add-carousel",
    },
  ];

  return (
    <div className="flex">
      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } min-h-screen shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isOpen && <h2 className="font-bold text-lg">Admin Panel</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <h3 className="px-4 py-3 text-xs font-bold uppercase text-gray-400">
            Social Media
          </h3>
        )}
        <nav className="space-y-2 px-3 py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
              title={!isOpen ? item.label : ""}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {isOpen && (
          <h3 className="px-4 py-3 text-xs font-bold uppercase text-gray-400">
            E-Commerce
          </h3>
        )}
        <nav className="space-y-2 px-3 py-4">
          {ecommerceItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
              title={!isOpen ? item.label : ""}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 bg-gray-50 min-h-screen" />
    </div>
  );
};

export default AdminSidebarSocial;
