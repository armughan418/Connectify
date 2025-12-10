import { useState, useEffect } from "react";
import {
  Menu,
  User,
  LogOut,
  Home,
  Users,
  MessageSquare,
  Search,
  Bell,
  Settings,
  X,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import messageService from "../services/messageService";
import { toast } from "react-toastify";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await messageService.getUnreadCount();
      if (response.status && response.data) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleLogout = () => {
    authService.logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setSidebarOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Feed", path: "/feed", icon: Home },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
  ];

  const protectedLinks = [
    { name: "My Profile", path: "/user/own-profile", icon: User },
    { name: "Settings", path: "/user/own-profile", icon: Settings },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-blue-500/50 transition"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <NavLink
                to="/feed"
                className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold shadow-md">
                  SM
                </div>
                <span className="hidden sm:inline">SocialMedia</span>
              </NavLink>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm"
                        : "hover:bg-white/10"
                    }`
                  }
                >
                  <link.icon size={20} />
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 text-gray-300" size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  onClick={() => navigate("/search")}
                  className="pl-10 pr-4 py-2 w-64 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition"
                  readOnly
                />
              </div>

              <button
                onClick={() => navigate("/search")}
                className="p-2 rounded-lg hover:bg-white/10 transition md:hidden"
                title="Search users"
              >
                <Search size={20} />
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => navigate("/messages")}
                  className="p-2 rounded-lg hover:bg-white/10 transition relative"
                  title="Messages"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                      {user?.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user?.name || "User"}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        {protectedLinks.map((link) => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setDropdownOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2 text-sm transition ${
                                isActive
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`
                            }
                          >
                            <link.icon size={18} />
                            {link.name}
                          </NavLink>
                        ))}

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition font-medium"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-medium"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-500/30 bg-blue-700/50 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm"
                        : "hover:bg-white/10"
                    }`
                  }
                >
                  <link.icon size={20} />
                  {link.name}
                </NavLink>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-blue-500/30 my-2"></div>
                  {protectedLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-white/10"
                    >
                      <link.icon size={20} />
                      {link.name}
                    </NavLink>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition text-red-200 hover:bg-red-500/20 w-full"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <link.icon size={20} />
                  {link.name}
                </NavLink>
              ))}

              <button
                onClick={() => {
                  navigate("/search");
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Search size={20} />
                Search Users
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    navigate("/messages");
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 hover:bg-gray-50 w-full text-left relative"
                >
                  <Bell size={20} />
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {protectedLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 hover:bg-gray-50"
                    >
                      <link.icon size={20} />
                      {link.name}
                    </NavLink>
                  ))}
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Navbar;
