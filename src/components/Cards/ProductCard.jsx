import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const price = Number(product.price || 0).toLocaleString("en-IN");
  const productId = product.id || product._id;
  const active = isWishlisted(productId);

  const handleToggleWishlist = async (event) => {
    event.stopPropagation();

    if (!productId) {
      toast.error("Product id is missing.");
      return;
    }

    try {
      await toggleWishlist(product);
      toast.success(active ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error(error?.message || "Could not update wishlist.");
    }
  };

  return (
    <div
      onClick={() =>
        navigate(`/product-detail/${encodeURIComponent(product.slug)}`)
      }
      className="group cursor-pointer">
      <div className="relative mb-4 aspect-3/4 overflow-hidden rounded-md bg-[#eee4d8]">
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#3e3124] shadow-md transition hover:bg-black hover:text-white"
          aria-label={
            active ? "Remove from wishlist" : "Add to wishlist"
          }>
          <Heart
            size={17}
            className={active ? "fill-yellow-500 text-yellow-500" : ""}
          />
        </button>
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="mb-1 line-clamp-2 text-base font-medium text-[#3e3124]">
        {product.title}
      </h3>

      <p className="text-sm text-[#6f6256]">Rs. {price}</p>
    </div>
  );
};

export default ProductCard;
