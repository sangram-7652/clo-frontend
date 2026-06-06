import { useEffect } from "react";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { getProductImageUrl } from "../api/home";

const getValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const normalizeWishlistItem = (item) => {
  const product =
    item.product || item.product_details || item.productData || item;
  const image = getValue(
    item.image,
    item.product_image,
    product.image,
    product.thumbnail,
    product.images?.[0]?.image,
    product.images?.[0],
  );

  return {
    ...item,
    id: getValue(item.product_id, item.productId, product.id, product._id),
    title: getValue(item.name, item.title, product.name, product.title),
    category: getValue(
      item.category?.name,
      item.category,
      product.category?.name,
      product.category,
      "Wishlist",
    ),
    imageUrl: image ? getProductImageUrl(image) : "",
    price: getValue(
      item.price,
      item.discount_price,
      product.discount_price,
      product.price,
      0,
    ),
  };
};

const Wishlist = () => {
  const { wishlist, loading, error, refreshWishlist, removeFromWishlist } =
    useWishlist();
  const wishlistItems = wishlist.map(normalizeWishlistItem);

  useEffect(() => {
    refreshWishlist().catch(() => {});
  }, [refreshWishlist]);

  const handleRemove = async (item) => {
    try {
      await removeFromWishlist(item);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err?.message || "Could not remove item from wishlist.");
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f2eb] ">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="clo-page-title">Wishlist</h1>
        </div>

        {loading ? (
          <div className="text-center text-xl text-gray-500">
            Loading wishlist...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="text-center text-xl text-gray-500">{error}</div>
        ) : null}

        {!loading && !error && wishlistItems.length === 0 ? (
          <div className="text-center text-xl text-gray-500">
            No wishlist products yet.
          </div>
        ) : null}

        {!loading && !error && wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
            {wishlistItems.map((item) => (
              <div key={item._id || item.id}>
                <div className="relative overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="absolute right-4 top-4 flex min-h-9 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-[#3e3124] shadow-md transition hover:bg-black hover:text-white"
                    aria-label={`Remove ${item.title} from wishlist`}>
                    <Heart
                      size={16}
                      className="fill-yellow-500 text-yellow-500"
                    />
                    Remove
                  </button>

                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-96 w-full object-cover sm:h-104"
                    />
                  ) : (
                    <div className="flex h-96 w-full items-center justify-center bg-[#eee4d8] px-4 text-center text-[#8f765b] sm:h-104">
                      No Image
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs uppercase tracking-[3px] text-gray-500">
                    {item.category}
                  </p>

                  <h3 className="clo-card-title mt-2">{item.title}</h3>

                  <p className="mt-2 font-semibold">
                    Rs. {Number(item.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Wishlist;
