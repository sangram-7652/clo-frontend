/**
 * OrderDetail.jsx  —  Single Order Detail page
 *
 * Route: /account/orders/:orderId  (ProtectedRoute)
 *
 * Shows:
 *  - Order number (with copy button)
 *  - Payment status + method
 *  - Order status timeline
 *  - Ordered products with variant info + images
 *  - Price breakdown
 *  - Shipping address
 *  - Estimated delivery
 *  - Track order button
 *  - Cancel order (if cancellable)
 *
 * Security:
 *  - All requests are authenticated (Bearer token via axios interceptor)
 *  - Backend returns 403 if order doesn't belong to the logged-in user
 *  - 403/404 responses shown as dedicated error states (not raw data)
 */

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import { cancelOrder, fetchOrderById } from "../api/orders/orders";
import OrderTimeline from "../components/orders/OrderTimeline";
import { getProductImageUrl } from "../api/home";
import Breadcrumb from "../components/common/Breadcrumb";

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (raw) => {
  if (!raw) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(raw));
  } catch {
    return String(raw);
  }
};

const formatDateShort = (raw) => {
  if (!raw) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(raw));
  } catch {
    return String(raw);
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
};

// ─── Status config (same as Orders.jsx) ───────────────────────────────────

const STATUS_CONFIG = {
  pending:          { label: "Pending",           color: "bg-amber-50 text-amber-700 border-amber-200"    },
  placed:           { label: "Placed",            color: "bg-amber-50 text-amber-700 border-amber-200"    },
  confirmed:        { label: "Confirmed",         color: "bg-blue-50 text-blue-700 border-blue-200"      },
  payment_confirmed:{ label: "Payment Confirmed", color: "bg-blue-50 text-blue-700 border-blue-200"      },
  processing:       { label: "Processing",        color: "bg-blue-50 text-blue-700 border-blue-200"      },
  packed:           { label: "Packed",            color: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped:          { label: "Shipped",           color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-orange-50 text-orange-700 border-orange-200" },
  delivered:        { label: "Delivered",         color: "bg-green-50 text-green-700 border-green-200"   },
  cancelled:        { label: "Cancelled",         color: "bg-red-50 text-red-700 border-red-200"         },
  canceled:         { label: "Cancelled",         color: "bg-red-50 text-red-700 border-red-200"         },
  return_requested: { label: "Return Requested",  color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  returned:         { label: "Returned",          color: "bg-gray-50 text-gray-600 border-gray-200"      },
  refunded:         { label: "Refunded",          color: "bg-green-50 text-green-700 border-green-200"   },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[String(status ?? "").toLowerCase()] ?? {
    label: String(status ?? "Unknown"),
    color: "bg-gray-50 text-gray-500 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
};

const isCancellable = (status) =>
  ["pending", "placed", "confirmed", "processing"].includes(
    String(status ?? "").toLowerCase()
  );

// ─── Skeleton ──────────────────────────────────────────────────────────────

const DetailSkeleton = () => (
  <div className="space-y-6">
    <div className="rounded-lg border border-[#e8dfd4] bg-white p-6">
      <div className="mb-4 flex justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-[#f0e8df]" />
          <div className="h-5 w-40 animate-pulse rounded bg-[#eee4d8]" />
        </div>
        <div className="h-6 w-24 animate-pulse rounded-full bg-[#eee4d8]" />
      </div>
      <div className="mt-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#eee4d8]" />
            <div className="h-2 flex-1 animate-pulse rounded bg-[#f0e8df]" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#eee4d8]" />
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-lg border border-[#e8dfd4] bg-white p-6">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-4 py-4 first:pt-0">
          <div className="h-20 w-16 animate-pulse rounded bg-[#eee4d8]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-[#f0e8df]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-[#f0e8df]" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-[#f0e8df]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Order line item ───────────────────────────────────────────────────────

const OrderItem = ({ item }) => {
  const imgSrc = item.image ? getProductImageUrl(item.image) : null;
  const hasDiscount = item.mrp > item.price && item.mrp > 0;

  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className="h-20 w-16 shrink-0 overflow-hidden rounded border border-[#e8dfd4] bg-[#f7f2eb]">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.name}
            width={64}
            height={80}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={18} className="text-[#c8b9a8]" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="line-clamp-2 text-sm font-medium leading-snug text-[#3e3124]">
            {item.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] uppercase tracking-[0.08em] text-[#6f6256]">
            {item.size && <span>Size: {item.size}</span>}
            {item.color && <span>Color: {item.color}</span>}
            {item.sku && <span>SKU: {item.sku}</span>}
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[#3e3124]">
              {formatPrice(item.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(item.mrp)}
              </span>
            )}
          </div>
          <span className="text-xs text-[#6f6256]">Qty: {item.quantity}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Price row ─────────────────────────────────────────────────────────────

const PriceRow = ({ label, value, isDiscount, isBold, freeWhenZero }) => {
  if (value === null || value === undefined) return null;
  const display =
    freeWhenZero && value === 0
      ? "Free"
      : `${isDiscount && value > 0 ? "−" : ""}${formatPrice(Math.abs(value))}`;

  return (
    <div className={`flex justify-between gap-4 ${isDiscount ? "text-green-700" : ""}`}>
      <span className={`text-sm ${isBold ? "font-semibold text-[#3e3124]" : "text-[#6f6256]"}`}>
        {label}
      </span>
      <span
        className={`text-right text-sm ${
          isBold ? "font-semibold text-[#3e3124]" : "font-medium"
        }`}
      >
        {display}
      </span>
    </div>
  );
};

// ─── Shipping address ──────────────────────────────────────────────────────

const ShippingAddress = ({ address }) => {
  if (!address) return null;

  const lines = [
    address.name ?? `${address.first_name ?? ""} ${address.last_name ?? ""}`.trim(),
    address.address ?? address.street,
    [address.city, address.state, address.pin_code ?? address.pinCode ?? address.zip]
      .filter(Boolean)
      .join(", "),
    address.country,
    address.phone ? `📞 ${address.phone}` : null,
    address.email ? `✉ ${address.email}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => (
        <p key={i} className={`text-sm ${i === 0 ? "font-medium text-[#3e3124]" : "text-[#6f6256]"}`}>
          {line}
        </p>
      ))}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | error | success
  const [errorMsg, setErrorMsg] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!orderId) {
      setIsNotFound(true);
      setLoadStatus("error");
      return;
    }
    setLoadStatus("loading");
    setErrorMsg("");
    setIsNotFound(false);
    setIsForbidden(false);

    try {
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setLoadStatus("success");
    } catch (err) {
      const msg = err?.message ?? "";
      if (msg.toLowerCase().includes("not found")) setIsNotFound(true);
      if (msg.toLowerCase().includes("access")) setIsForbidden(true);
      setErrorMsg(msg || "Unable to load order.");
      setLoadStatus("error");
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCopyOrderNumber = async () => {
    if (!order?.orderNumber) return;
    await copyToClipboard(`#${order.orderNumber}`);
    setCopied(true);
    toast.success("Order number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    if (!order?.id) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelling(true);
      const updated = await cancelOrder(order.id);
      setOrder(updated);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error(err?.message ?? "Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  // ── Error states ──────────────────────────────────────────────────────

  if (loadStatus === "loading") {
    return (
      <section className="min-h-screen bg-[#f7f2eb] px-4 py-8 sm:px-6 md:py-12 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 h-4 w-48 animate-pulse rounded bg-[#eee4d8]" />
          <DetailSkeleton />
        </div>
      </section>
    );
  }

  if (loadStatus === "error") {
    if (isNotFound) {
      return (
        <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f2eb] px-4 text-center">
          <Package size={40} className="mb-4 text-[#c8b9a8]" />
          <h1 className="clo-card-title mb-2 text-[#3e3124]">Order Not Found</h1>
          <p className="mb-6 text-sm text-[#6f6256]">
            We couldn&apos;t find an order with that ID.
          </p>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-[#222]"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </section>
      );
    }

    if (isForbidden) {
      return (
        <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f2eb] px-4 text-center">
          <XCircle size={40} className="mb-4 text-red-400" />
          <h1 className="clo-card-title mb-2 text-[#3e3124]">Access Denied</h1>
          <p className="mb-6 text-sm text-[#6f6256]">
            This order does not belong to your account.
          </p>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-[#222]"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </section>
      );
    }

    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f2eb] px-4 text-center">
        <AlertCircle size={40} className="mb-4 text-red-400" />
        <h1 className="clo-card-title mb-2 text-[#3e3124]">Something went wrong</h1>
        <p className="mb-6 text-sm text-[#6f6256]">{errorMsg}</p>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-[#222]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </section>
    );
  }

  if (!order) return null;

  const showCancel = isCancellable(order.status);
  const hasTracking = !!order.trackingNumber;

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 py-8 text-[#3e3124] sm:px-6 md:py-12 lg:px-10">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "My Orders", path: "/account/orders" },
            { label: `#${order.orderNumber}` },
          ]}
        />

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="clo-eyebrow mb-1 text-[#8f765b]">Order Details</p>
            <div className="flex items-center gap-2">
              <h1 className="clo-card-title m-0 text-[#201811]">#{order.orderNumber}</h1>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                aria-label="Copy order number"
                className="rounded p-1 text-[#8f765b] transition hover:bg-[#e8dfd4] hover:text-[#3e3124]"
              >
                {copied ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <ClipboardCopy size={16} />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-[#6f6256]">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-5">
          {/* ── Timeline ──────────────────────────────────────────────── */}
          <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
              Order Status
            </h2>
            <OrderTimeline
              status={order.status}
              paymentStatus={order.paymentStatus}
              history={order.trackingHistory}
            />
          </div>

          {/* ── Order meta ────────────────────────────────────────────── */}
          <div className="grid gap-4 rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm sm:grid-cols-3">
            <div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
                Payment
              </p>
              <p className="text-sm font-medium text-[#3e3124]">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod === "razorpay"
                  ? "Razorpay"
                  : order.paymentMethod ?? "—"}
              </p>
              <p className="mt-0.5 text-xs text-[#6f6256] capitalize">
                {order.paymentStatus ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
                Est. Delivery
              </p>
              <p className="text-sm font-medium text-[#3e3124]">
                {order.estimatedDelivery
                  ? formatDateShort(order.estimatedDelivery)
                  : "5–7 business days"}
              </p>
            </div>

            {hasTracking && (
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
                  Tracking No.
                </p>
                <p className="font-mono text-sm font-medium text-[#3e3124]">
                  {order.trackingNumber}
                </p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#b19777] hover:underline"
                  >
                    <Truck size={11} />
                    Track on carrier
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ── Products ──────────────────────────────────────────────── */}
          <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </h2>
            <div className="divide-y divide-[#f0e8df]">
              {order.items.map((item, i) => (
                <OrderItem key={item.id ?? i} item={item} />
              ))}
            </div>
          </div>

          {/* ── Price breakdown ───────────────────────────────────────── */}
          <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
              Price Breakdown
            </h2>
            <div className="space-y-2.5">
              <PriceRow label="Subtotal" value={order.subtotal} />
              {order.discount > 0 && (
                <PriceRow label="Discount" value={order.discount} isDiscount />
              )}
              <PriceRow label="Shipping" value={order.shipping} freeWhenZero />
              {order.tax > 0 && <PriceRow label="Tax" value={order.tax} />}
              <div className="border-t border-[#e8dfd4] pt-2.5">
                <PriceRow label="Total Paid" value={order.total} isBold />
              </div>
            </div>
          </div>

          {/* ── Shipping address ──────────────────────────────────────── */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-[#8f765b]" />
                <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
                  Shipping Address
                </h2>
              </div>
              <ShippingAddress address={order.shippingAddress} />
            </div>
          )}

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d7c8b8] px-5 py-2.5 text-sm font-medium text-[#3e3124] transition hover:border-black"
            >
              <ArrowLeft size={15} />
              Back to Orders
            </Link>

            <Link
              to={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3e3124] px-5 py-2.5 text-sm font-medium text-[#3e3124] transition hover:bg-[#3e3124] hover:text-white"
            >
              <Truck size={15} />
              Track Order
            </Link>

            {showCancel && (
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto"
              >
                <XCircle size={15} />
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
