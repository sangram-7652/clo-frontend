import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHomeData, getProductImageUrl } from "../../api/home";
import { useWishlist } from "../../context/WishlistContext";

const RelatedProducts = ({ currentSlug }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadRelatedProducts = async () => {
      try {
        const data = await getHomeData();
        const relatedProducts = [
          ...(data?.wedding_products || []),
          ...(data?.bestsellers || []),
        ];

        if (isMounted) {
          setProducts(relatedProducts);
        }
      } catch (error) {
        console.error("Unable to load related products", error);
      }
    };

    loadRelatedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayProducts = useMemo(() => {
    const uniqueProducts = new Map();

    products.forEach((product) => {
      if (product?.id && product.slug !== currentSlug) {
        uniqueProducts.set(product.id, product);
      }
    });

    return Array.from(uniqueProducts.values()).slice(0, 3);
  }, [currentSlug, products]);

  const handleToggleWishlist = async (item) => {
    try {
      const productId = item.id || item._id;
      const wasWishlisted = isWishlisted(productId);
      await toggleWishlist(item);
      toast.success(
        wasWishlisted ? "Removed from wishlist" : "Added to wishlist",
      );
    } catch (error) {
      toast.error(error?.message || "Could not update wishlist.");
    }
  };

  if (!displayProducts.length) {
    return null;
  }

  return (
    <section className="bg-[#f7f2eb] px-4 py-8 sm:px-6 md:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {displayProducts.map((item) => {
          const active = isWishlisted(item.id);
          const imageUrl = getProductImageUrl(item.image);

          return (
            <div key={item.id}>
              <div className="relative aspect-3/4 overflow-hidden rounded-md bg-[#eee4d8]">
                <button
                  type="button"
                  onClick={() => handleToggleWishlist(item)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white p-2">
                  <Heart
                    size={20}
                    className={`${
                      active ? "fill-yellow-500 text-yellow-500" : "text-black"
                    }`}
                  />
                </button>

                <img
                  src={imageUrl}
                  alt={item.name}
                  onClick={() =>
                    navigate(
                      `/product-detail/${encodeURIComponent(item.slug)}`,
                    )
                  }
                  className="h-full w-full cursor-pointer object-cover"
                />
              </div>

              <div className="mt-3 text-center">
                <p className="text-[9px] uppercase leading-none tracking-[1.5px] text-gray-500">
                  {item.category?.name || "Related Product"}
                </p>

                <h3 className="mt-1 font-[var(--heading)] text-lg leading-snug">
                  {item.name?.trim()}
                </h3>

                <p className="mt-1 text-xs font-semibold">
                  Rs. {Number(item.price || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
