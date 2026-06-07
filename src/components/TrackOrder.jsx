
 

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
  X,
} from "lucide-react";
import { trackOrderByNumber } from "../api/orders/orders";
import { getProductImageUrl } from "../api/home";
import OrderTimeline from "../components/orders/OrderTimeline";

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatPrice = (v) =>
  `Rs. ${Number(v || 0).toLocaleString("en-IN")}`;

const formatDate = (raw) => {
  if (!raw) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(raw));
  } catch {
    return String(raw);
  }
};

const sanitiseInput = (v) =>
  String(v ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9\-_#]/g, "") // allow only safe chars
    .replace(/^#+/, "")                // strip leading #
    .slice(0, 60);                     // max length guard

// ─── Skeleton ──────────────────────────────────────────────────────────────

const ResultSkeleton = () => (
  <div className="space-y-5 rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
    <div className="flex justify-between">
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded bg-[#f0e8df]" />
        <div className="h-5 w-36 animate-pulse rounded bg-[#eee4d8]" />
      </div>
      <div className="h-6 w-24 animate-pulse rounded-full bg-[#eee4d8]" />
    </div>
    <div className="flex items-center gap-4 py-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-1 items-center">
          <div className="h-9 w-9 animate-pulse rounded-full bg-[#eee4d8]" />
          {i < 5 && <div className="h-0.5 flex-1 animate-pulse bg-[#f0e8df]" />}
        </div>
      ))}
    </div>
  </div>
);

// ─── Status badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:          { label: "Pending",           color: "bg-amber-50 text-amber-700 border-amber-200"    },
  placed:           { label: "Order Placed",      color: "bg-amber-50 text-amber-700 border-amber-200"    },
  confirmed:        { label: "Confirmed",         color: "bg-blue-50 text-blue-700 border-blue-200"      },
  payment_confirmed:{ label: "Payment Confirmed", color: "bg-blue-50 text-blue-700 border-blue-200"      },
  processing:       { label: "Processing",        color: "bg-blue-50 text-blue-700 border-blue-200"      },
  packed:           { label: "Packed",            color: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped:          { label: "Shipped",           color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-orange-50 text-orange-700 border-orange-200" },
  delivered:        { label: "Delivered",         color: "bg-green-50 text-green-700 border-green-200"   },
  cancelled:        { label: "Cancelled",         color: "bg-red-50 text-red-700 border-red-200"         },
};

const StatusBadge = ({ status }) => {
  const key = String(status ?? "").toLowerCase();
  const cfg = STATUS_CONFIG[key] ?? {
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

// ─── Result card ───────────────────────────────────────────────────────────

const TrackingResult = ({ order }) => {
  const token = localStorage.getItem("token");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8f765b]">
              Order Number
            </p>
            <p className="mt-0.5 font-mono text-lg font-semibold text-[#3e3124]">
              #{order.orderNumber}
            </p>
            <p className="mt-0.5 text-xs text-[#6f6256]">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <StatusBadge status={order.status} />
            <p className="text-sm font-semibold text-[#3e3124]">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Estimated delivery */}
        {(order.estimatedDelivery || order.status !== "delivered") && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-[#f7f2eb] px-4 py-3">
            <Truck size={16} className="shrink-0 text-[#b19777]" />
            <p className="text-sm text-[#3e3124]">
              {order.status === "delivered"
                ? "Your order has been delivered."
                : order.estimatedDelivery
                ? `Estimated delivery: ${formatDate(order.estimatedDelivery)}`
                : "Estimated delivery: 5–7 business days"}
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
          Delivery Progress
        </h2>
        <OrderTimeline
          status={order.status}
          paymentStatus={order.paymentStatus}
          history={order.trackingHistory}
        />
      </div>

      {/* Tracking number */}
      {order.trackingNumber && (
        <div className="flex items-center justify-between rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8f765b]">
              Tracking Number
            </p>
            <p className="mt-0.5 font-mono text-sm font-medium text-[#3e3124]">
              {order.trackingNumber}
            </p>
          </div>
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#d7c8b8] px-4 py-2 text-xs font-medium text-[#3e3124] transition hover:border-black"
            >
              <MapPin size={12} />
              Track on carrier
            </a>
          )}
        </div>
      )}

      {/* Products preview */}
      {order.items.length > 0 && (
        <div className="rounded-lg border border-[#e8dfd4] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8f765b]">
            {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
          </h2>
          <div className="space-y-3">
            {order.items.map((item, i) => {
              const imgSrc = item.image ? getProductImageUrl(item.image) : null;
              return (
                <div key={item.id ?? i} className="flex items-center gap-3">
                  <div className="h-14 w-11 shrink-0 overflow-hidden rounded border border-[#e8dfd4] bg-[#f7f2eb]">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        width={44}
                        height={56}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package size={14} className="text-[#c8b9a8]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#3e3124]">
                      {item.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0 text-[11px] uppercase tracking-[0.08em] text-[#6f6256]">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-[#3e3124]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA: view full details if logged in */}
      {token && (
        <div className="flex justify-center">
          <Link
            to={`/account/orders/${encodeURIComponent(order.id)}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3e3124] underline-offset-4 hover:underline"
          >
            View full order details
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOrder = searchParams.get("order") ?? "";

  const [inputValue, setInputValue] = useState(() => sanitiseInput(urlOrder));
  const [order, setOrder] = useState(null);
  const [trackStatus, setTrackStatus] = useState("idle"); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState("");
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef(null);

  // Update document title
  useEffect(() => {
    if (order) {
      document.title = `Order #${order.orderNumber} — CLO`;
    } else {
      document.title = "Track Your Order — CLO";
    }
    return () => {
      document.title = "CLO";
    };
  }, [order]);

  // Auto-track if URL has ?order= param on first load
  const hasAutoTracked = useRef(false);
  useEffect(() => {
    if (urlOrder && !hasAutoTracked.current) {
      hasAutoTracked.current = true;
      doTrack(sanitiseInput(urlOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doTrack = useCallback(async (orderNum) => {
    const clean = sanitiseInput(orderNum);
    if (!clean) {
      toast.error("Please enter your order number.");
      inputRef.current?.focus();
      return;
    }

    setTrackStatus("loading");
    setErrorMsg("");
    setNotFound(false);
    setOrder(null);

    // Sync URL without triggering re-render loop
    setSearchParams({ order: clean }, { replace: true });

    try {
      const result = await trackOrderByNumber(clean);
      setOrder(result);
      setTrackStatus("success");
    } catch (err) {
      const msg = err?.message ?? "Unable to track order.";
      setErrorMsg(msg);
      setNotFound(msg.toLowerCase().includes("not found"));
      setTrackStatus("error");
    }
  }, [setSearchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doTrack(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setOrder(null);
    setTrackStatus("idle");
    setErrorMsg("");
    setNotFound(false);
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  return (
    <>
      {/* noindex — tracking results contain PII */}
      <meta name="robots" content="noindex, nofollow" />

      <section className="min-h-screen bg-[#f7f2eb] px-4 py-10 text-[#3e3124] md:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Page header */}
          <div className="mb-8 text-center">
            <p className="clo-eyebrow mb-2 text-[#8f765b]">CLO Store</p>
            <h1 className="clo-page-title m-0 text-[#201811]">Track Your Order</h1>
            <p className="mt-3 text-sm leading-6 text-[#6f6256]">
              Enter your order number to see real-time delivery status.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f765b]"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(sanitiseInput(e.target.value))}
                  placeholder="e.g. CLO-12345 or 1001"
                  maxLength={60}
                  aria-label="Order number"
                  className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white pl-10 pr-10 text-sm text-[#3e3124] outline-none transition placeholder:text-[#b5a898] focus:border-[#3e3124] focus:shadow-[0_0_0_3px_rgba(62,49,36,0.08)]"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#8f765b] hover:text-[#3e3124]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={trackStatus === "loading" || !inputValue.trim()}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#3e3124] px-6 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#2a2118] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {trackStatus === "loading" ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Tracking…
                  </>
                ) : (
                  "Track"
                )}
              </button>
            </div>
          </form>

          {/* Loading skeleton */}
          {trackStatus === "loading" && <ResultSkeleton />}

          {/* Error */}
          {trackStatus === "error" && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center">
              {notFound ? (
                <>
                  <Package size={32} className="mx-auto mb-3 text-red-300" />
                  <p className="font-medium text-red-700">Order not found</p>
                  <p className="mt-1 text-sm text-red-500">
                    We couldn&apos;t find an order with number{" "}
                    <strong>#{inputValue}</strong>. Please check and try again.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
                  <p className="font-medium text-red-700">Tracking failed</p>
                  <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
                  <button
                    type="button"
                    onClick={() => doTrack(inputValue)}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <RefreshCw size={14} />
                    Retry
                  </button>
                </>
              )}
            </div>
          )}

          {/* Result */}
          {trackStatus === "success" && order && (
            <TrackingResult order={order} />
          )}

          {/* Idle helper */}
          {trackStatus === "idle" && (
            <div className="rounded-lg border border-[#e8dfd4] bg-white p-6 text-center shadow-sm">
              <Truck size={32} className="mx-auto mb-3 text-[#c8b9a8]" />
              <p className="text-sm text-[#6f6256]">
                Your order number can be found in your confirmation email or on the{" "}
                <Link
                  to="/account/orders"
                  className="font-medium text-[#3e3124] underline-offset-4 hover:underline"
                >
                  My Orders
                </Link>{" "}
                page.
              </p>
            </div>
          )}

          {/* Success message when delivered */}
          {trackStatus === "success" &&
            order?.status?.toLowerCase() === "delivered" && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-green-100 bg-green-50 px-5 py-3">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  Your order has been delivered. Enjoy your purchase!
                </p>
              </div>
            )}
        </div>
      </section>
    </>
  );
};

export default TrackOrder;
