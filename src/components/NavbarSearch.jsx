import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../api/products/search";

const NavbarSearch = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  // Call API whenever searchText changes (debounced 400ms)
  useEffect(() => {
    const query = searchText.trim();

    if (!query) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const products = await searchProducts(query);
        setResults(products);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setError("Unable to search products");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  const handleClose = () => {
    setShowSearch(false);
    setSearchText("");
    setResults([]);
    setError("");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchText(value);

    if (!value.trim()) {
      setResults([]);
      setError("");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-w-0 items-center gap-2">
      {/* Search Icon */}
      <button onClick={() => setShowSearch(!showSearch)}>
        <Search size={20} />
      </button>

      {/* Input or Label */}
      {showSearch ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={handleSearchChange}
            className="w-20 border-b border-black bg-transparent text-sm uppercase tracking-wider outline-none transition-all duration-300 sm:w-28"
            autoFocus
          />
          {/* Clear / Close button */}
          <button onClick={handleClose}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <span className="hidden md:block text-sm uppercase tracking-wider">
          Search
        </span>
      )}

      {/* Dropdown Results */}
      {showSearch && searchText.trim() && (
        <div className="absolute top-8 left-0 z-50 w-64 rounded border border-gray-200 bg-white shadow-md">
          {loading ? (
            <p className="p-3 text-xs text-gray-400">Searching...</p>
          ) : error ? (
            <p className="p-3 text-xs text-red-500">{error}</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li
                  key={product.id}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    if (product.slug) {
                      navigate(
                        `/product-detail/${encodeURIComponent(product.slug)}`,
                      );
                    }
                    handleClose();
                  }}>
                  <span className="block truncate">{product.name?.trim()}</span>
                  <span className="block text-xs text-gray-500">
                    Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-xs text-gray-400">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
