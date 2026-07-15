import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  fetchCart,
  fetchCheckout,
  removeCartItem,
  updateCartItem,
} from "../api/cart/cart";

import { getProductImageUrl } from "../api/home";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getFirstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toNumberOrNull = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const getCartItems = (cartData) => {
  const possibleItems = getFirstValue(
    Array.isArray(cartData) ? cartData : null,
    Array.isArray(cartData?.data) ? cartData.data : null,
    Array.isArray(cartData?.cart) ? cartData.cart : null,
    Array.isArray(cartData?.data?.cart) ? cartData.data.cart : null,
    cartData?.items,
    cartData?.cart?.items,
    cartData?.data?.items,
    cartData?.data?.cart?.items,
    cartData?.cart_items,
    cartData?.cartItems,
    cartData?.data?.cart_items,
    cartData?.data?.cartItems,
    cartData?.data?.cart?.cart_items,
    cartData?.data?.cart?.cartItems,
    cartData?.products,
    cartData?.data?.products,
  );

  return Array.isArray(possibleItems) ? possibleItems : [];
};

const getCheckoutSummary = (checkoutData) => {
  const checkoutSources = [
    checkoutData,
    checkoutData?.data,
    checkoutData?.summary,
    checkoutData?.data?.summary,
    checkoutData?.checkout,
    checkoutData?.data?.checkout,
    checkoutData?.cart,
    checkoutData?.data?.cart,
    checkoutData?.price_details,
    checkoutData?.priceDetails,
    checkoutData?.data?.price_details,
    checkoutData?.data?.priceDetails,
    checkoutData?.data?.checkout?.price_details,
    checkoutData?.data?.checkout?.priceDetails,
  ].filter(Boolean);

  const getAmount = (...keys) => {
    for (const source of checkoutSources) {
      const value = getFirstValue(...keys.map((key) => source?.[key]));
      const amount = toNumberOrNull(value);

      if (amount !== null) {
        return amount;
      }
    }

    return null;
  };

  const subtotal = getAmount(
    "subtotal",
    "sub_total",
    "cartSubtotal",
    "cart_subtotal",
    "total_mrp",
    "totalMRP",
    "items_total",
    "itemsTotal",
  );
  const discount = getAmount(
    "discount",
    "discount_amount",
    "discountAmount",
    "couponDiscount",
    "coupon_discount",
    "total_discount",
    "totalDiscount",
  );
  const couponDiscount = getAmount(
    "coupon_discount",
    "couponDiscount",
    "promo_discount",
    "promoDiscount",
  );
  const tax = getAmount(
    "tax",
    "tax_amount",
    "taxAmount",
    "gst",
    "gst_amount",
    "gstAmount",
  );
  const shipping = getAmount(
    "shipping",
    "shipping_charge",
    "shippingCharge",
    "delivery_charge",
    "deliveryCharge",
  );
  const platformFee = getAmount(
    "platform_fee",
    "platformFee",
    "handling_fee",
    "handlingFee",
  );
  const total = getAmount(
    "total",
    "total_price",
    "totalPrice",
    "total_amount",
    "totalAmount",
    "cart_total",
    "cartTotal",
    "grand_total",
    "grandTotal",
    "payable_amount",
    "payableAmount",
    "payable_total",
    "payableTotal",
    "final_total",
    "finalTotal",
    "order_total",
    "orderTotal",
    "net_amount",
    "netAmount",
  );

  return {
    subtotal,
    discount,
    couponDiscount:
      couponDiscount !== null && couponDiscount !== discount
        ? couponDiscount
        : null,
    tax,
    shipping,
    platformFee,
    total,
  };
};

const getSummaryRows = (summary) => {
  if (!summary) return [];

  return [
    {
      key: "subtotal",
      label: "Subtotal",
      value: summary.subtotal,
    },
    {
      key: "discount",
      label: "Discount",
      value: summary.discount,
      isDiscount: true,
    },
    {
      key: "couponDiscount",
      label: "Coupon Discount",
      value: summary.couponDiscount,
      isDiscount: true,
    },
    {
      key: "tax",
      label: "Tax",
      value: summary.tax,
    },
    {
      key: "shipping",
      label: "Shipping",
      value: summary.shipping,
      freeWhenZero: true,
    },
    {
      key: "platformFee",
      label: "Platform Fee",
      value: summary.platformFee,
    },
  ].filter((row) => row.value !== null);
};

const getCartLineTotal = (item) => {
  const product =
    item.product || item.product_details || item.productData || {};
  const value = Number(
    getFirstValue(
      item.line_total,
      item.lineTotal,
      item.total,
      item.item_total,
      product.line_total,
      product.lineTotal,
    ),
  );

  return Number.isFinite(value) ? value : null;
};

const normalizeCartItem = (item, index) => {
  const product =
    item.product || item.product_details || item.productData || item;
  const variant = item.variant || item.product_variant || item.productVariant;
  const cartItemId = getFirstValue(
    item.id,
    item._id,
    item.cart_id,
    item.cartId,
    item.cart_item_id,
    item.cartItemId,
  );
  const productId = getFirstValue(
    item.product_id,
    item.productId,
    product.id,
    product._id,
  );
  const variantId = getFirstValue(
    item.product_variant_id,
    item.productVariantId,
    item.variant_id,
    item.variantId,
    variant?.id,
    variant?._id,
  );
  const image = getFirstValue(
    item.image,
    item.product_image,
    product.image,
    product.thumbnail,
    product.images?.[0]?.image,
    product.images?.[0],
    variant?.images?.[0]?.image,
    variant?.images?.[0],
  );
  const price = Number(
    getFirstValue(
      item.price,
      item.discount_price,
      item.product_price,
      product.discount_price,
      product.price,
      variant?.price,
      0,
    ),
  );
  const oldPrice = Number(
    getFirstValue(item.mrp, item.oldPrice, product.price),
  );
  const quantity = Number(getFirstValue(item.quantity, item.qty, 1));
  const name = getFirstValue(
    item.name,
    item.title,
    item.product_name,
    product.name,
    product.title,
  );
  const color = getFirstValue(item.color, item.selectedColor, variant?.color);
  const size = getFirstValue(item.size, item.selectedSize, variant?.size);

  return {
    id: getFirstValue(cartItemId, productId, index),
    cartItemId,
    productId,
    variantId,
    name: name || "Product",
    imageUrl: image ? getProductImageUrl(image) : "",
    price,
    oldPrice,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    size,
    color,
    sku: getFirstValue(item.sku, product.sku),
    lineTotal: getCartLineTotal(item),
  };
};

const buildCartMutationPayload = (item, qty) => {
  const payload = {};

  if (item.cartItemId) {
    payload.id = item.cartItemId;
    payload.cart_id = item.cartItemId;
    payload.cart_item_id = item.cartItemId;
  }

  if (item.productId) {
    payload.product_id = item.productId;
  }

  if (item.variantId) {
    payload.product_variant_id = item.variantId;
  }

  if (qty !== undefined) {
    payload.qty = qty;
  }

  return payload;
};

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartData, setCartData] = useState(null);
  const [cartOverrideItems, setCartOverrideItems] = useState(null);
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingItemId, setPendingItemId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getCart = async () => {
      try {
        setLoading(true);
        setError("");
        const [cartResponse, checkoutResponse] = await Promise.all([
          fetchCart(),
          fetchCheckout(),
        ]);

        if (isMounted) {
          setCartData(cartResponse);
          setCheckoutSummary(getCheckoutSummary(checkoutResponse));
          setCartOverrideItems(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message ||
              err?.error ||
              "Unable to load your cart. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const cartItems = useMemo(() => {
    if (cartOverrideItems) {
      return cartOverrideItems;
    }

    const apiItems = getCartItems(cartData);

    if (apiItems.length) {
      return apiItems.map(normalizeCartItem);
    }

    if (location.state?.addedItem) {
      return [normalizeCartItem(location.state.addedItem, 0)];
    }

    return [];
  }, [cartData, cartOverrideItems, location.state]);
  const summaryRows = useMemo(
    () => getSummaryRows(checkoutSummary),
    [checkoutSummary],
  );

  const handleUpdateQuantity = async (item, nextQuantity) => {
    if (nextQuantity < 1 || pendingItemId) return;

    const payload = buildCartMutationPayload(item, nextQuantity);

    if (!payload.cart_id && !payload.product_id) {
      toast.error("Cart item id is missing.");
      return;
    }

    try {
      setPendingItemId(item.id);
      await updateCartItem(payload);
      setSummaryLoading(true);
      const checkoutData = await fetchCheckout();
      setCheckoutSummary(getCheckoutSummary(checkoutData));
      setCartOverrideItems((currentItems) =>
        (currentItems || cartItems).map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: nextQuantity,
                lineTotal: null,
              }
            : cartItem,
        ),
      );
      toast.success("Cart updated");
    } catch (err) {
      toast.error(err?.message || "Could not update this cart item.");
    } finally {
      setPendingItemId(null);
      setSummaryLoading(false);
    }
  };

  const handleRemoveItem = async (item) => {
    const payload = buildCartMutationPayload(item);

    if (!payload.cart_id && !payload.product_id) {
      toast.error("Cart item id is missing.");
      return;
    }

    try {
      setPendingItemId(item.id);
      await removeCartItem(payload);
      setSummaryLoading(true);
      const checkoutData = await fetchCheckout();
      setCheckoutSummary(getCheckoutSummary(checkoutData));
      setCartOverrideItems((currentItems) =>
        (currentItems || cartItems).filter(
          (cartItem) => cartItem.id !== item.id,
        ),
      );
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err?.message || "Could not remove this cart item.");
    } finally {
      setPendingItemId(null);
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-[#f7f2eb] px-4 py-8 text-[#3e3124] md:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
            Cart
          </p>
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-md bg-[#eee4d8]"
              />
            ))}
            <div className="h-56 animate-pulse rounded-md bg-[#eee4d8]" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#f7f2eb] px-4 text-center text-[#3e3124]">
        <div className="max-w-md">
          <AlertCircle className="mx-auto mb-4 text-[#8f765b]" size={34} />
          <h1 className="mb-3 font-serif text-2xl text-[#3e3124]">
            Could not load cart
          </h1>
          <p className="mb-6 text-sm leading-6 text-[#6f6256]">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-black px-6 py-3 text-xs font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222]">
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!cartItems.length) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#f7f2eb] px-4 text-center text-[#3e3124]">
        <div className="max-w-md">
          <ShoppingBag className="mx-auto mb-4 text-[#8f765b]" size={38} />
          <h1 className="mb-3 font-serif text-3xl text-[#3e3124]">Your Cart</h1>
          <p className="mb-7 text-sm leading-6 text-[#6f6256]">
            Your shopping bag is empty. Add your favorite styles before
            checkout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-xs font-medium uppercase tracking-[2px] text-white transition m-2 ">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 py-6 text-[#3e3124] md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
              Shopping Bag
            </p>
            <h1 className="my-0 font-serif text-3xl leading-tight text-[#3e3124] md:text-4xl">
              Your Cart
            </h1>
          </div>
          <p className="text-xs text-[#6f6256]">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your bag
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="grid gap-3 rounded-md border border-[#d7c8b8] bg-white p-3 shadow-sm shadow-black/5 sm:grid-cols-[88px_1fr] md:p-4">
                <div className="aspect-4/5 overflow-hidden rounded-md bg-[#eee4d8]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-[#8f765b]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="my-0 mb-1 line-clamp-2 text-sm font-semibold leading-5 text-[#3e3124] md:text-[15px]">
                        {item.name}
                      </h2>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.08em] text-[#6f6256]">
                        {item.size ? <span>Size {item.size}</span> : null}
                        {item.color ? <span>Color {item.color}</span> : null}
                        {item.sku ? <span>SKU {item.sku}</span> : null}
                      </div>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-sm font-semibold text-[#3e3124]">
                        {formatPrice(item.price)}
                      </p>
                      {item.oldPrice > item.price ? (
                        <p className="mt-1 text-xs text-gray-400 line-through">
                          {formatPrice(item.oldPrice)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[#eaded2] pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-fit items-center rounded-md border border-[#d7c8b8]">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity - 1)
                        }
                        disabled={
                          item.quantity <= 1 || pendingItemId === item.id
                        }
                        className="flex h-8 w-8 items-center justify-center text-[#6f6256] transition hover:bg-[#f7f2eb] disabled:cursor-not-allowed disabled:text-[#bbb]"
                        aria-label={`Decrease ${item.name} quantity`}>
                        <Minus size={14} />
                      </button>
                      <span className="flex h-8 min-w-8 items-center justify-center px-2 text-xs">
                        {pendingItemId === item.id ? "..." : item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity + 1)
                        }
                        disabled={pendingItemId === item.id}
                        className="flex h-8 w-8 items-center justify-center text-[#6f6256] transition hover:bg-[#f7f2eb] disabled:cursor-not-allowed disabled:text-[#bbb]"
                        aria-label={`Increase ${item.name} quantity`}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      {item.lineTotal !== null ? (
                        <p className="text-xs font-medium">
                          Total: {formatPrice(item.lineTotal)}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        disabled={pendingItemId === item.id}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d7c8b8] text-[#6f6256] transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:text-[#bbb]"
                        aria-label={`Remove ${item.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-md border border-[#d7c8b8] bg-[#f3eee7] p-4 lg:sticky lg:top-28">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="my-0 font-serif text-2xl text-[#3e3124]">
                  Order Summary
                </h2>
              </div>
              {summaryLoading ? (
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8f765b]">
                  Updating
                </span>
              ) : null}
            </div>

            <div className="space-y-3 border-b border-[#d8d1c8] pb-4 text-sm">
              {summaryRows.length ? (
                summaryRows.map((row) => (
                  <div
                    key={row.key}
                    className={`flex justify-between gap-4 ${
                      row.isDiscount ? "text-[#8f765b]" : ""
                    }`}>
                    <span>{row.label}</span>
                    <span className="text-right font-medium">
                      {summaryLoading
                        ? "Updating..."
                        : row.freeWhenZero && row.value === 0
                          ? "Free"
                          : `${row.isDiscount && row.value > 0 ? "-" : ""}${formatPrice(
                              Math.abs(row.value),
                            )}`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[#6f6256]">
                  Order summary is waiting for checkout details.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-base font-medium">Payable Total</span>
              <span className="text-right text-lg font-semibold">
                {summaryLoading
                  ? "Updating..."
                  : checkoutSummary?.total !== null &&
                      checkoutSummary?.total !== undefined
                    ? formatPrice(checkoutSummary?.total)
                    : "Unavailable"}
              </span>
            </div>
            {/* Coupon Code */}
            <div className="mb-5 rounded-md border border-[#d7c8b8] bg-white p-3">
              <label
                htmlFor="coupon"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6f6256]">
                Have a Coupon?
              </label>

              <div className="flex gap-2">
                <input
                  id="coupon"
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-md border border-[#d7c8b8] bg-white px-3 py-2 text-sm text-[#3e3124] outline-none transition focus:border-black"
                />

                <button
                  type="button"
                  className="rounded-md bg-black px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#222]">
                  Apply
                </button>
              </div>

              <p className="mt-2 text-xs text-[#8f765b]">
                Enter your coupon code to get a discount.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#222]">
              proceed to checkout
              <ArrowRight size={16} />
            </button>

            <Link
              to="/"
              className="mt-3 flex w-full items-center justify-center rounded-md border border-[#d7c8b8] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#3e3124] transition hover:border-black">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;
