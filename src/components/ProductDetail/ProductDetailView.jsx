import { useMemo, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Breadcrumb from "../common/Breadcrumb";
import { getProductImageUrl } from "../../api/home";

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

// Fallback swatch colors, only used when the backend doesn't send a hex
// code for a variant's color (see colorHexMap below).
const fallbackColorCodes = {
  black: "#111111",
  brown: "#7c4f35",
  green: "#2f6b43",
  magenta: "#c026d3",
  orange: "#f97316",
  pink: "#e8a2b8",
  red: "#b91c1c",
  white: "#f8f8f8",
};

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatName = (value) => value?.toString().trim() || "";

const formatMetaName = (value, fallback = "Not assigned") => {
  if (value && typeof value === "object") {
    return formatName(value.name) || fallback;
  }

  return value || fallback;
};

const getVariantImages = (variant) => {
  if (!Array.isArray(variant?.images)) return [];

  return variant.images
    .map((image) => (typeof image === "string" ? image : image?.image))
    .filter(Boolean);
};

const ProductDetailView = ({
  product,
  onAddToBag,

  onToggleWishlist,
  isWishlisted = false,
  isAddingToCart = false,
  isUpdatingWishlist = false,
}) => {
  const variants = useMemo(() => product?.variants || [], [product]);
  const sizes = useMemo(
    () =>
      [
        ...new Set(variants.map((variant) => variant.size).filter(Boolean)),
      ].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)),
    [variants],
  );
  const colors = useMemo(
    () => [
      ...new Set(variants.map((variant) => variant.color).filter(Boolean)),
    ],
    [variants],
  );

  // Prefer a real hex/color code coming from the backend variant data.
  // Adjust the field names below (color_hex / color_code / hex) to match
  // whatever your API actually returns.
  const colorHexMap = useMemo(() => {
    const map = { ...fallbackColorCodes };

    variants.forEach((variant) => {
      const key = variant.color?.toLowerCase();
      const hex = variant.color_hex || variant.color_code || variant.hex;

      if (key && hex) {
        map[key] = hex;
      }
    });

    return map;
  }, [variants]);

  const galleryImages = useMemo(() => {
    const apiImages = (product?.images || [])
      .map((image) => image?.image || image)
      .filter(Boolean);
    const variantImages = variants.flatMap(getVariantImages);

    return [
      ...new Set(
        [product?.image, ...apiImages, ...variantImages].filter(Boolean),
      ),
    ].map(getProductImageUrl);
  }, [product, variants]);

  const [selectedImage, setSelectedImage] = useState(galleryImages[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectedColor,
    ) ||
    variants.find((variant) => variant.size === selectedSize) ||
    variants.find((variant) => variant.color === selectedColor);

  const stock = selectedVariant?.stock ?? 0;
  const salePrice = product?.discount_price || product?.price || 0;
  const hasDiscount =
    product?.discount_price &&
    Number(product.discount_price) < Number(product.price);
  const description = product?.description
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const getCartProduct = () => ({
    ...product,
    title: formatName(product.name),
    images: galleryImages,
    price: salePrice,
    oldPrice: product.price,
    selectedSize,
    selectedColor,
    selectedVariant,
    quantity,
  });

  const handleAddToBag = () => {
    onAddToBag?.(getCartProduct());
  };

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-clo-soft px-4 text-center">
        Product not found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-clo-soft px-4 pb-8 pt-4 md:px-8 md:pt-6">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Product Detail" },
            { label: formatName(product.name) },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(360px,1fr)] lg:items-start lg:gap-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto sm:w-16 sm:flex-col sm:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`h-16 w-14 shrink-0 overflow-hidden rounded-md border transition sm:h-20 sm:w-16 ${
                    selectedImage === image
                      ? "border-black"
                      : "border-[#d7c8b8] hover:border-black/40"
                  }`}>
                  <img
                    src={image}
                    alt={`${formatName(product.name)} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="aspect-4/5 max-h-155 flex-1 overflow-hidden rounded-md">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={formatName(product.name)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <span className="clo-card-title text-[#3e3124]">
                    {formatName(product.name)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {product.is_bestseller ? (
                <span className="border border-[#d7c8b8] px-2.5 py-1 text-[9px] uppercase leading-none tracking-[1.2px]">
                  Bestseller
                </span>
              ) : null}
              {product.is_wedding ? (
                <span className="border border-[#d7c8b8] px-2.5 py-1 text-[9px] uppercase leading-none tracking-[1.2px]">
                  Wedding
                </span>
              ) : null}
              {product.sku ? (
                <span className="text-[9px] uppercase leading-none tracking-[1.2px] text-gray-500">
                  SKU {product.sku}
                </span>
              ) : null}
            </div>

            {/* Product Name */}
            <div className="mb-1 text-4xl font-medium leading-tight text-black">
              {formatName(product.name)}
            </div>

            <div className="mb-4 mt-2 flex flex-wrap items-center gap-3">
              <span className="text-xl font-medium text-black">
                {formatPrice(salePrice)}
              </span>
              {hasDiscount ? (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              ) : null}
            </div>

            {/* Size */}
            {sizes.length ? (
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-xl font-medium uppercase leading-none text-black">
                    Size
                  </span>
                  {/* <button
                    type="button"
                    className="text-sm uppercase leading-none">
                    Size Guide
                  </button> */}
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`flex h-9 min-w-11 items-center justify-center border px-3 text-[11px] font-medium tracking-[0.5px] transition-colors duration-150 ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-[#d7c8b8] text-[#3e3124] hover:border-black"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Color */}
            {colors.length ? (
              <div className="mb-5">
                <span className="mb-2 block text-xl font-medium uppercase text-black">
                  Color
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setQuantity(1);
                      }}
                      className={`flex h-9 items-center gap-2 rounded-full border px-3 transition-colors duration-150 ${
                        selectedColor === color
                          ? "border-black "
                          : "border-[#d7c8b8] hover:border-black"
                      }`}
                      aria-pressed={selectedColor === color}>
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                        style={{
                          backgroundColor:
                            colorHexMap[color.toLowerCase()] || "#d7c8b8",
                        }}
                      />
                      <span className="text-[11px] font-medium tracking-[0.3px] text-[#3e3124]">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity */}
            <div className="mb-4 flex flex-wrap items-end gap-4">
              <div>
                <div className="mb-2 text-[9px] font-medium uppercase leading-none tracking-[1.3px] text-[#3e3124]">
                  Quantity
                </div>
                <div className="flex w-fit items-center border border-[#d7c8b8]">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(current - 1, 1))
                    }
                    className="flex h-8 w-8 items-center justify-center transition hover:bg-[#eee4d8]">
                    <Minus size={14} />
                  </button>
                  <span className="flex h-8 w-8 items-center justify-center text-[10px]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        stock ? Math.min(current + 1, stock) : current + 1,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center transition hover:bg-[#eee4d8]">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <p className="pb-1.5 text-[10px] leading-none text-gray-500">
                {stock > 0 ? `${stock} in stock` : "Stock will update soon"}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={isAddingToCart}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-6 py-3 text-[10px] uppercase leading-none tracking-[1.2px] text-white">
                <ShoppingBag size={16} />
                {isAddingToCart ? "Adding..." : "Add To Bag"}
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist?.(getCartProduct())}
                disabled={isUpdatingWishlist}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-6 py-3 text-[10px] uppercase leading-none tracking-[1.2px] text-white">
                <Heart
                  size={15}
                  className={
                    isWishlisted ? "fill-yellow-500 text-yellow-500" : ""
                  }
                />
                {isUpdatingWishlist
                  ? "Updating..."
                  : isWishlisted
                    ? "Remove From Wishlist"
                    : "Add To Wishlist"}
              </button>
            </div>

            {description?.length ? (
              <div className="mb-4 space-y-1.5 text-xs leading-5 text-gray-600">
                {description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-1 border-y border-[#ddd2c6] py-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 py-2 sm:flex-col sm:text-center">
                <Truck className="text-[#8f765b]" size={18} />
                <p className="text-[10px] uppercase leading-none tracking-[1.2px]">
                  Free Shipping
                </p>
              </div>
              <div className="flex items-center gap-2 py-2 sm:flex-col sm:text-center">
                <RotateCcw className="text-[#8f765b]" size={18} />
                <p className="text-[10px] uppercase leading-none tracking-[1.2px]">
                  Easy Returns
                </p>
              </div>
              <div className="flex items-center gap-2 py-2 sm:flex-col sm:text-center">
                <ShieldCheck className="text-[#8f765b]" size={18} />
                <p className="text-[10px] uppercase leading-none tracking-[1.2px]">
                  Secure Checkout
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-b border-[#ddd2c6] pb-5 text-[11px] leading-4 text-gray-600 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase leading-none tracking-[1.5px] text-[#3e3124]">
                  Collection
                </p>
                <p>
                  {formatMetaName(product.collection, product.collection_id)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase leading-none tracking-[1.5px] text-[#3e3124]">
                  Category
                </p>
                <p>{formatMetaName(product.category, product.category_id)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailView;
