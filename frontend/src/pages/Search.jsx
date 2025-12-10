import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, User, Loader, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import authService from "../services/authService";
import { toast } from "react-toastify";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const navigate = useNavigate();
  const currentUserId =
    authService.getCurrentUser()?._id || authService.getCurrentUser()?.id;
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchQuery.trim() === "") {
      setUsers([]);
      return;
    }

    const timeout = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (!query || query.trim() === "") {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await userService.searchUsers(query);
      if (response.status && response.users) {
        setUsers(response.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setUsers([]);
    inputRef.current?.focus();
  };

  const handleUserClick = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Users
          </h1>
          <p className="text-gray-600">Find and connect with people</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : searchQuery.trim() === "" ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">
              Start typing to search for users
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Search by name or email address
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No users found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                {users.length}{" "}
                {users.length === 1 ? "user found" : "users found"}
              </p>
            </div>
            <div className="divide-y">
              {users.map((user) => (
                <button
                  key={user._id || user.id}
                  onClick={() => handleUserClick(user._id || user.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : user.name ? (
                      <span className="text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User size={24} className="text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
