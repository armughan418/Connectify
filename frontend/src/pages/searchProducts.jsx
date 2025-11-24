import React, { useEffect, useState, useRef } from "react";
import { Search, Star, StarHalf } from "lucide-react";
import axios from "axios";
import api from "../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function SearchProducts() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState("");
  const [minStars, setMinStars] = useState(0);
  const [loading, setLoading] = useState(true);

  const suggestRef = useRef(null);
  const navigate = useNavigate();

  // Get query from URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Fetch Products
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(api().getProducts);
        if (!mounted) return;

        const list = res.data?.products || [];
        setProducts(list);
        
        // If there's a query from URL, apply it
        const urlQuery = searchParams.get("q");
        if (urlQuery) {
          const lower = urlQuery.toLowerCase();
          const filtered = list.filter((p) => 
            p.name?.toLowerCase().includes(lower)
          );
          setResults(filtered);
        } else {
          setResults(list);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => (mounted = false);
  }, [searchParams]);

  // Suggestions
  useEffect(() => {
    if (!query) return setSuggestions([]);

    const id = setTimeout(() => {
      const q = query.toLowerCase();
      const matches = products
        .filter((p) => p.name && p.name.toLowerCase().includes(q))
        .slice(0, 8);
      setSuggestions(matches);
    }, 150);

    return () => clearTimeout(id);
  }, [query, products]);

  // Apply Filters
  const applyFilters = (q = query, s = sort, min = minStars) => {
    let list = [...products];

    if (q.trim() !== "") {
      const lower = q.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(lower));
    }

    list = list.filter((p) => (p.rating ?? 0) >= Number(min));

    if (s === "price-asc")
      list.sort((a, b) => Number(a.price) - Number(b.price));
    if (s === "price-desc")
      list.sort((a, b) => Number(b.price) - Number(a.price));

    setResults(list);
    setSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      await axios.post(
        api().addToCart,
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMsg);

      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }
  };

  // Star Rating Component supporting decimals
  const StarRating = ({ rating, size = 16 }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} size={size} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(
          <StarHalf key={i} size={size} className="text-yellow-400" />
        );
      } else {
        stars.push(<Star key={i} size={size} className="text-gray-300" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">
        Search Products
      </h2>

      {/* Search / Filters Box */}
      <div className="w-full max-w-5xl">
        <form onSubmit={handleSearch} className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-2xl border border-orange-300 px-5 py-3 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            type="submit"
            className="absolute right-3 top-3 text-orange-600"
          >
            <Search size={20} />
          </button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul
              ref={suggestRef}
              className="absolute top-14 w-full bg-white rounded-2xl shadow-xl border border-orange-200 max-h-64 overflow-auto z-50"
            >
              {suggestions.map((s) => (
                <li
                  key={s._id}
                  onClick={() => {
                    setQuery(s.name);
                    applyFilters(s.name, sort, minStars);
                  }}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-orange-50 cursor-pointer"
                >
                  <img
                    src={s.image || s.img}
                    alt={s.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <div className="flex items-center gap-1">
                      <StarRating rating={s.avgRating ?? 0} size={12} />
                      <span className="text-xs text-gray-500">
                        {(s.avgRating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Filters */}
        <div className="flex gap-4 mb-6 items-center bg-white shadow-md border border-orange-200 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <label className="font-medium text-sm">Sort:</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilters(query, e.target.value, minStars);
              }}
              className="border rounded-lg px-3 py-2 bg-orange-50"
            >
              <option value="">Relevance</option>
              <option value="price-asc">Low to High</option>
              <option value="price-desc">High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-sm">Min Rating:</label>
            <select
              value={minStars}
              onChange={(e) => {
                setMinStars(Number(e.target.value));
                applyFilters(query, sort, Number(e.target.value));
              }}
              className="border rounded-lg px-3 py-2 bg-orange-50"
            >
              <option value={0}>Any</option>
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-5xl">
        {loading ? (
          <p className="text-center text-orange-500">Loading products...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-orange-500 mt-6">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition relative flex flex-col"
              >
                <div
                  onClick={() => handleProductClick(p._id)}
                  className="cursor-pointer"
                >
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center">
                    <img
                      src={p.image || p.img}
                      alt={p.name}
                      className="h-48 object-contain"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mt-3 text-orange-600">
                    {p.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={p.avgRating ?? 0} size={16} />
                    <span className="text-gray-600 text-sm">
                      {(p.avgRating ?? 0).toFixed(1)}
                    </span>
                  </div>

                  {p.oldPrice && p.oldPrice > p.price && (
                    <p className="text-gray-400 text-sm line-through">
                      Rs{" "}
                      {Number(p.oldPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  )}

                  <p className="text-orange-600 font-bold text-xl mt-1">
                    Rs{" "}
                    {Number(p.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(p._id)}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-xl shadow-md font-semibold transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
