import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductDetailView from "../components/ProductDetail/ProductDetailView";
import RelatedProducts from "../components/GetMore/RelatedProducts";
import { getProductBySlug } from "../api/products/detail";
import { addToCart as addCartItem } from "../api/cart/cart";
import { useWishlist } from "../context/WishlistContext";

const buildCartPayload = (cartProduct) => {
  const productId = cartProduct.id || cartProduct._id;

  if (!productId) return null;

  const payload = {
    product_id: productId,
    qty: cartProduct.quantity,
  };

  const variantId =
    cartProduct.selectedVariant?.id || cartProduct.selectedVariant?._id;

  if (variantId) {
    payload.product_variant_id = variantId;
  }

  if (cartProduct.selectedSize) {
    payload.size = cartProduct.selectedSize;
  }

  if (cartProduct.selectedColor) {
    payload.color = cartProduct.selectedColor;
  }

  return payload;
};

const buildAddedItemState = (cartProduct) => ({
  ...cartProduct,
  product: cartProduct,
  qty: cartProduct.quantity,
  variant: cartProduct.selectedVariant,
  size: cartProduct.selectedSize,
  color: cartProduct.selectedColor,
});

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const productSlug = useMemo(() => {
    try {
      return decodeURIComponent(slug || "");
    } catch {
      return slug || "";
    }
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!productSlug) {
        setProduct(null);
        setStatus("error");
        setError("Product slug is missing.");
        return;
      }

      setStatus("loading");
      setError("");

      try {
        const productData = await getProductBySlug(productSlug);

        if (isMounted) {
          setProduct(productData);
          setStatus("success");
        }
      } catch (requestError) {
        if (isMounted) {
          console.error("Unable to load product", requestError);
          setProduct(null);
          setStatus("error");
          setError("We could not load this product. Please try again.");
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productSlug]);

  const handleAddToBag = async (cartProduct) => {
    const payload = buildCartPayload(cartProduct);

    if (!payload) {
      toast.error("Product id is missing.");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addCartItem(payload);
      toast.success("Added to cart");
      navigate("/cart", {
        state: { addedItem: buildAddedItemState(cartProduct) },
      });
    } catch (requestError) {
      const message =
        requestError?.message ||
        requestError?.error ||
        "Could not add this product to cart.";

      toast.error(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (wishlistProduct) => {
    const productId = wishlistProduct.id || wishlistProduct._id;

    if (!productId) {
      toast.error("Product id is missing.");
      return;
    }

    try {
      setIsUpdatingWishlist(true);
      const wasWishlisted = isWishlisted(productId);
      await toggleWishlist(wishlistProduct);
      toast.success(
        wasWishlisted ? "Removed from wishlist" : "Added to wishlist",
      );
    } catch (requestError) {
      toast.error(
        requestError?.message || "Could not update this wishlist item.",
      );
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center  px-4 text-center ">
        Loading product...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center  px-4 text-center">
        <h1 className="clo-card-title mb-3">Product not found</h1>
        <p className="mb-6 max-w-md text-sm text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-black px-6 py-3 text-xs font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222]">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductDetailView
        key={`${product.id}-${product.slug}`}
        product={product}
        onAddToBag={handleAddToBag}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isWishlisted(product?.id || product?._id)}
        isAddingToCart={isAddingToCart}
        isUpdatingWishlist={isUpdatingWishlist}
      />
      <RelatedProducts currentSlug={product?.slug} />
    </>
  );
};

export default ProductDetail;
