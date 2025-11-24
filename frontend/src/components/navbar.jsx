import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileProfileDropdown, setMobileProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, [location.pathname]);

  // Fetch cart count
  const fetchCartCount = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get(api().getCart, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.cart?.items || res.data?.items || [];
      // Calculate total quantity
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    } catch (err) {
      // If error, set to 0 (user might not be logged in or cart might be empty)
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    // Custom event listener for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Also refresh when route changes
    const interval = setInterval(fetchCartCount, 3000); // Check every 3 seconds
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchInput(false);
    } else {
      navigate("/search-products");
      setShowSearchInput(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setProfileDropdown(false);
    setMobileProfileDropdown(false);
    navigate("/login");
  };

  const NAVBAR_HEIGHT = 70;

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-orange-600 to-orange-500 shadow-xl fixed w-full top-0 z-50 px-4 md:px-6 h-[70px] flex justify-between items-center border-b border-orange-700">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold tracking-wide text-white transition hover:text-orange-100 flex items-center gap-2"
        >
          <span className="hidden sm:inline">ShopEase</span>
          <span className="sm:hidden">SE</span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border-2 border-orange-300 px-4 py-2 pr-12 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Right-side icons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="md:hidden p-2 text-white hover:text-orange-100 transition rounded-lg hover:bg-orange-700"
          >
            <Search size={22} />
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => {
              const token = localStorage.getItem("authToken");
              if (token) {
                navigate("/shopping-cart");
              } else {
                navigate("/login");
              }
            }}
            className="relative p-2 text-white hover:text-orange-100 transition rounded-lg hover:bg-orange-700"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-orange-600">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Desktop profile */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="p-2 text-white hover:text-orange-100 transition rounded-lg hover:bg-orange-700"
            >
              <User size={22} />
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-xl border border-gray-200 py-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/user-profile");
                        setProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center space-x-2 text-gray-700"
                    >
                      <User className="w-4 h-4 text-orange-600" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/order-history");
                        setProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center space-x-2 text-gray-700"
                    >
                      <ShoppingCart className="w-4 h-4 text-orange-600" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center space-x-2 text-gray-700"
                  >
                    <LogIn className="w-4 h-4 text-orange-600" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile profile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileProfileDropdown(!mobileProfileDropdown)}
              className="p-2 text-white hover:text-orange-100 transition rounded-lg hover:bg-orange-700"
            >
              <User size={22} />
            </button>
            {mobileProfileDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-2xl rounded-xl border border-gray-200 py-2 z-50">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/user-profile");
                        setMobileProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center space-x-2 text-gray-700"
                    >
                      <User className="w-4 h-4 text-orange-600" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/order-history");
                        setMobileProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center space-x-2 text-gray-700"
                    >
                      <ShoppingCart className="w-4 h-4 text-orange-600" />
                      <span>Orders</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center space-x-2 text-gray-700"
                  >
                    <LogIn className="w-4 h-4 text-orange-600" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-white hover:text-orange-100 transition rounded-lg hover:bg-orange-700"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Search Input */}
      {showSearchInput && (
        <div className="fixed top-[70px] left-0 right-0 bg-white shadow-lg z-40 p-4 border-b border-orange-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full rounded-xl border-2 border-orange-300 px-4 py-3 pr-12 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 w-full h-[70px] flex items-center justify-between px-5">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white hover:text-orange-100 transition rounded-lg hover:bg-orange-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Section */}
        {user ? (
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white flex flex-col items-center py-6 shadow-md">
            <div className="w-20 h-20 bg-white text-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-10 h-10" />
            </div>
            <h2 className="font-semibold text-lg mt-3">{user.name || "User"}</h2>
            <p className="text-sm text-orange-100 mt-1">{user.email}</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white flex flex-col items-center py-6 shadow-md">
            <div className="w-20 h-20 bg-white text-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-10 h-10" />
            </div>
            <h2 className="font-semibold text-lg mt-3">Guest</h2>
            <button
              onClick={() => {
                navigate("/login");
                setSidebarOpen(false);
              }}
              className="mt-3 px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              Login
            </button>
          </div>
        )}

        {/* Menu Items */}
        <ul className="mt-6 space-y-2 px-4">
          <MenuItem
            icon={<User />}
            title="My Profile"
            onClick={() => {
              navigate("/user-profile");
              setSidebarOpen(false);
            }}
          />
          <MenuItem
            icon={<ShoppingCart />}
            title="My Orders"
            onClick={() => {
              navigate("/order-history");
              setSidebarOpen(false);
            }}
          />
          <MenuItem
            icon={<Search />}
            title="Search Products"
            onClick={() => {
              navigate("/search-products");
              setSidebarOpen(false);
            }}
          />
          {user && (
            <MenuItem
              icon={<LogOut />}
              title="Logout"
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              isLogout
            />
          )}
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Spacer for fixed navbar */}
      <div style={{ height: NAVBAR_HEIGHT }}></div>
    </>
  );
};

const MenuItem = ({ icon, title, onClick, isLogout = false }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center space-x-4 cursor-pointer group p-3 rounded-xl transition ${
        isLogout
          ? "hover:bg-red-50 text-red-600"
          : "hover:bg-orange-50 text-gray-700"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
          isLogout
            ? "bg-red-100 group-hover:bg-red-200 text-red-600"
            : "bg-orange-100 group-hover:bg-orange-600 group-hover:text-white text-orange-600"
        } shadow-sm`}
      >
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <span
        className={`font-medium transition ${
          isLogout
            ? "group-hover:text-red-700"
            : "group-hover:text-orange-600"
        }`}
      >
        {title}
      </span>
    </li>
  );
};

export default Navbar;
