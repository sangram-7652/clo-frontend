/**
 * Orders.jsx  —  My Orders page
 *
 * Route: /account/orders  (ProtectedRoute)
 *
 * Shows the authenticated customer's order history with:
 * - Skeleton loading state
 * - Error state with retry
 * - Empty state
 * - Status filter tabs
 * - Normalised order cards linking to /account/orders/:id
 * - Pagination
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, ChevronRight, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { fetchOrders, normaliseOrder } from "../api/orders/orders";
import { getProductImageUrl } from "../api/home";

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (raw) => {
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

// ─── Status badge ──────────────────────────────────────────────────────────

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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
};

const PaymentBadge = ({ status, method }) => {
  const isPaid = ["paid", "captured", "success", "completed"].includes(
    String(status ?? "").toLowerCase()
  );
  const isFailure = ["failed", "cancelled", "canceled"].includes(
    String(status ?? "").toLowerCase()
  );

  const color = isPaid
    ? "bg-green-50 text-green-700 border-green-200"
    : isFailure
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const label = isPaid ? "Paid" : isFailure ? "Failed" : "Pending";
  const methodLabel =
    method === "razorpay" ? "Razorpay" : method === "cod" ? "COD" : method ?? "";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] ${color}`}
    >
      {label}
      {methodLabel ? ` · ${methodLabel}` : ""}
    </span>
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────

const OrderCardSkeleton = () => (
  <div className="rounded-lg border border-[#e8dfd4] bg-white p-4 sm:p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="h-4 w-36 animate-pulse rounded bg-[#eee4d8]" />
        <div className="h-3 w-24 animate-pulse rounded bg-[#f0e8df]" />
      </div>
      <div className="h-6 w-24 animate-pulse rounded-full bg-[#eee4d8]" />
    </div>
    <div className="mt-4 flex gap-3">
      <div className="h-14 w-11 animate-pulse rounded bg-[#eee4d8]" />
      <div className="h-14 w-11 animate-pulse rounded bg-[#eee4d8]" />
      <div className="flex flex-col justify-center gap-2">
        <div className="h-3 w-28 animate-pulse rounded bg-[#f0e8df]" />
        <div className="h-3 w-20 animate-pulse rounded bg-[#f0e8df]" />
      </div>
    </div>
  </div>
);

// ─── Filter tabs ───────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: "",           label: "All Orders"  },
  { key: "processing", label: "Active"      },
  { key: "shipped",    label: "Shipped"     },
  { key: "delivered",  label: "Delivered"   },
  { key: "cancelled",  label: "Cancelled"   },
];

// ─── Order card ────────────────────────────────────────────────────────────

const OrderCard = ({ order }) => {
  const firstImage = order.items[0]?.image
    ? getProductImageUrl(order.items[0].image)
    : null;

  return (
    <Link
      to={`/account/orders/${encodeURIComponent(order.id)}`}
      className="group block rounded-lg border border-[#e8dfd4] bg-white p-4 shadow-sm transition hover:border-[#b5a898] hover:shadow-md sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left — order number + date */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8f765b]">
            Order
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-[#3e3124]">
            #{order.orderNumber}
          </p>
          <p className="mt-1 text-xs text-[#6f6256]">{formatDate(order.createdAt)}</p>
        </div>

        {/* Right — badges + total */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} method={order.paymentMethod} />
          <p className="text-sm font-semibold text-[#3e3124]">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      {/* Items preview */}
      {order.items.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex gap-1.5">
            {order.items.slice(0, 3).map((item, i) => {
              const imgSrc = item.image ? getProductImageUrl(item.image) : null;
              return (
                <div
                  key={item.id ?? i}
                  className="h-14 w-11 overflow-hidden rounded border border-[#e8dfd4] bg-[#f7f2eb]"
                >
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
                      <Package size={14} className="text-[#b5a898]" />
                    </div>
                  )}
                </div>
              );
            })}
            {order.items.length > 3 && (
              <div className="flex h-14 w-11 items-center justify-center rounded border border-[#e8dfd4] bg-[#f7f2eb] text-xs font-medium text-[#6f6256]">
                +{order.items.length - 3}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#3e3124]">
              {order.items[0]?.name ?? "—"}
            </p>
            <p className="text-xs text-[#6f6256]">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <ChevronRight
            size={16}
            className="ml-auto shrink-0 text-[#b5a898] transition group-hover:text-[#3e3124]"
          />
        </div>
      )}
    </Link>
  );
};

// ─── Main component ────────────────────────────────────────────────────────

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilter = searchParams.get("status") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1");

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await fetchOrders({ page: currentPage, status: activeFilter });
      setOrders(result.orders.map(normaliseOrder));
      setPagination(result.pagination);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err?.message ?? "Unable to load orders.");
      setStatus("error");
    }
  }, [currentPage, activeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilterChange = (key) => {
    const next = new URLSearchParams();
    if (key) next.set("status", key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const handlePageChange = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = pagination?.last_page ?? pagination?.total_pages ?? 1;

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 py-8 text-[#3e3124] sm:px-6 md:py-12 lg:px-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="clo-eyebrow mb-2 text-[#b19777]">My Account</p>
          <h1 className="clo-page-title m-0 text-[#201811]">My Orders</h1>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleFilterChange(tab.key)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition ${
                activeFilter === tab.key
                  ? "border-[#3e3124] bg-[#3e3124] text-white"
                  : "border-[#d7c8b8] bg-white text-[#6f6256] hover:border-[#8f765b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {status === "loading" && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-red-100 bg-red-50 px-6 py-10 text-center">
            <AlertCircle size={32} className="text-red-400" />
            <div>
              <p className="font-medium text-red-700">Could not load orders</p>
              <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "success" && orders.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <ShoppingBag size={40} className="text-[#c8b9a8]" />
            <div>
              <p className="text-lg font-medium text-[#3e3124]">
                {activeFilter ? "No orders with this status" : "No orders yet"}
              </p>
              <p className="mt-1 text-sm text-[#6f6256]">
                {activeFilter
                  ? "Try a different filter."
                  : "When you place your first order, it will appear here."}
              </p>
            </div>
            {activeFilter ? (
              <button
                type="button"
                onClick={() => handleFilterChange("")}
                className="rounded-md border border-[#d7c8b8] px-5 py-2 text-sm text-[#3e3124] transition hover:border-black"
              >
                Show All Orders
              </button>
            ) : (
              <Link
                to="/"
                className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#222]"
              >
                Start Shopping
              </Link>
            )}
          </div>
        )}

        {/* Orders list */}
        {status === "success" && orders.length > 0 && (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="rounded-md border border-[#d7c8b8] px-4 py-2 text-sm text-[#3e3124] transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-3 text-sm text-[#6f6256]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="rounded-md border border-[#d7c8b8] px-4 py-2 text-sm text-[#3e3124] transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Orders;
