import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  addWishlistItem,
  fetchWishlist,
  getWishlistProductId,
  removeWishlistItem,
} from "../api/wishlist/wishlist";

const WishlistContext = createContext();

const getWishlistItems = (wishlistData) => {
  const possibleItems =
    (Array.isArray(wishlistData) && wishlistData) ||
    (Array.isArray(wishlistData?.data) && wishlistData.data) ||
    (Array.isArray(wishlistData?.wishlist) && wishlistData.wishlist) ||
    (Array.isArray(wishlistData?.data?.wishlist) &&
      wishlistData.data.wishlist) ||
    (Array.isArray(wishlistData?.items) && wishlistData.items) ||
    (Array.isArray(wishlistData?.data?.items) && wishlistData.data.items);

  return possibleItems || [];
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchWishlist();
      setWishlist(getWishlistItems(data));
      return data;
    } catch (err) {
      setError(err?.message || "Could not load wishlist.");
      setWishlist([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isWishlisted = useCallback(
    (id) => {
      if (!id) return false;

      return wishlist.some(
        (item) => String(getWishlistProductId(item)) === String(id),
      );
    },
    [wishlist],
  );

  const addToWishlist = useCallback(async (product) => {
    const productId = getWishlistProductId(product);

    if (!productId) {
      throw new Error("Product id is missing.");
    }

    const data = await addWishlistItem(product);
    await refreshWishlist();
    return data;
  }, [refreshWishlist]);

  const removeFromWishlist = useCallback(async (product) => {
    const productId = getWishlistProductId(product);

    if (!productId) {
      throw new Error("Product id is missing.");
    }

    const data = await removeWishlistItem(product);
    await refreshWishlist();
    return data;
  }, [refreshWishlist]);

  const toggleWishlist = useCallback(
    async (product) => {
      const productId = getWishlistProductId(product);
      const existingItem = wishlist.find(
        (item) => String(getWishlistProductId(item)) === String(productId),
      );

      if (existingItem) {
        return removeFromWishlist({ ...existingItem, ...product });
      }

      return addToWishlist(product);
    },
    [addToWishlist, removeFromWishlist, wishlist],
  );

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      error,
      addToWishlist,
      removeFromWishlist,
      refreshWishlist,
      toggleWishlist,
      isWishlisted,
    }),
    [
      addToWishlist,
      error,
      isWishlisted,
      loading,
      refreshWishlist,
      removeFromWishlist,
      toggleWishlist,
      wishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
