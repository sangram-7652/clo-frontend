/**
 * OrderTimeline.jsx
 *
 * Amazon / Flipkart-style order status timeline.
 * Handles the three flows:
 *   NORMAL:  Placed → Payment → Processing → Packed → Shipped → OutForDelivery → Delivered
 *   CANCEL:  Placed → Cancelled
 *   RETURN:  Delivered → ReturnRequested → Returned → Refunded
 */

import { useMemo } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Truck,
  X,
  XCircle,
  CreditCard,
  MapPin,
} from "lucide-react";

// ─── Step definitions ──────────────────────────────────────────────────────

const NORMAL_STEPS = [
  { key: "placed",          label: "Order Placed",        Icon: ShoppingBag    },
  { key: "payment",         label: "Payment Confirmed",   Icon: CreditCard     },
  { key: "processing",      label: "Processing",          Icon: Clock          },
  { key: "packed",          label: "Packed",              Icon: Package        },
  { key: "shipped",         label: "Shipped",             Icon: Truck          },
  { key: "out_for_delivery",label: "Out For Delivery",    Icon: MapPin         },
  { key: "delivered",       label: "Delivered",           Icon: PackageCheck   },
];

const CANCEL_STEPS = [
  { key: "placed",    label: "Order Placed", Icon: ShoppingBag },
  { key: "cancelled", label: "Cancelled",    Icon: XCircle,    isBad: true },
];

const RETURN_STEPS = [
  { key: "delivered",        label: "Delivered",         Icon: PackageCheck },
  { key: "return_requested", label: "Return Requested",  Icon: RefreshCw    },
  { key: "returned",         label: "Returned",          Icon: Package      },
  { key: "refunded",         label: "Refunded",          Icon: CheckCircle2 },
];

// ─── Status → step-key mapping ─────────────────────────────────────────────
// Maps backend order.status values to a step key.

const STATUS_TO_STEP = {
  // normal flow
  pending:            "placed",
  placed:             "placed",
  confirmed:          "payment",
  payment_confirmed:  "payment",
  processing:         "processing",
  packed:             "packed",
  shipped:            "shipped",
  out_for_delivery:   "out_for_delivery",
  delivered:          "delivered",

  // cancel flow
  cancelled:          "cancelled",
  canceled:           "cancelled",

  // return flow
  return_requested:   "return_requested",
  return_approved:    "return_requested",
  returned:           "returned",
  refund_initiated:   "refunded",
  refunded:           "refunded",
};

const resolveFlow = (status) => {
  const normalised = String(status ?? "").toLowerCase().trim();
  if (["cancelled", "canceled"].includes(normalised)) return "cancel";
  if (["return_requested", "return_approved", "returned", "refund_initiated", "refunded"].includes(normalised))
    return "return";
  return "normal";
};

const formatStatus = (status) =>
  String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const resolveActiveKey = (status) =>
  STATUS_TO_STEP[String(status ?? "").toLowerCase().trim()] ?? "placed";

// ─── Sub-components ────────────────────────────────────────────────────────

const StepDot = ({ state, Icon, isBad }) => {
  if (state === "done") {
    return (
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ${
          isBad
            ? "bg-red-500 text-white"
            : "bg-[#3e3124] text-white"
        }`}
      >
        {isBad ? <X size={16} strokeWidth={2.5} /> : <Check size={16} strokeWidth={2.5} />}
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#3e3124] bg-white shadow-md">
        <Icon size={15} className="text-[#3e3124]" />
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#3e3124] opacity-20" />
      </div>
    );
  }
  // future
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#d7c8b8] bg-white">
      <Icon size={15} className="text-[#d7c8b8]" />
    </div>
  );
};

const ConnectorLine = ({ filled }) => (
  <div className="ml-[17px] h-8 w-0.5 shrink-0 sm:ml-0 sm:mt-[17px] sm:h-0.5 sm:w-full sm:flex-1">
    <div
      className={`h-full w-full transition-all duration-500 ${
        filled ? "bg-[#3e3124]" : "bg-[#d7c8b8]"
      }`}
    />
  </div>
);

/**
 * TimelineEvent — one entry from the backend tracking history.
 */
const TimelineEvent = ({ event, isLast }) => (
  <div className="flex gap-3">
    {/* Dot + line */}
    <div className="flex flex-col items-center">
      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#b19777]" />
      {!isLast && <div className="mt-1 w-0.5 flex-1 bg-[#d7c8b8]" />}
    </div>

    <div className="pb-4">
      <p className="text-sm font-medium leading-snug text-[#3e3124]">
        {formatStatus(event.status ?? event.title ?? event.message)}
      </p>
     {(event.description ?? event.note ?? event.message) && (
  <p className="mt-0.5 text-xs leading-5 text-[#6f6256]">
    {event.description ?? event.note ?? event.message}
  </p>
)}
      {(event.location ?? event.city) && (
        <p className="mt-0.5 text-[11px] text-[#8f765b]">
          📍 {event.location ?? event.city}
        </p>
      )}
      <p className="mt-1 text-[11px] text-[#8f765b]">
        {formatEventTime(event.created_at ?? event.timestamp ?? event.date)}
      </p>
    </div>
  </div>
);

const formatEventTime = (raw) => {
  if (!raw) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(raw));
  } catch {
    return String(raw);
  }
};

// ─── Main Component ────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {string}  props.status          — current order status string from backend
 * @param {string}  [props.paymentStatus] — payment_status string
 * @param {Array}   [props.history]       — tracking_history array from backend
 */
const OrderTimeline = ({ status, history = [] }) => {
  const flow = useMemo(() => resolveFlow(status), [status]);
  const activeKey = useMemo(() => resolveActiveKey(status), [status]);

  const steps = useMemo(() => {
    if (flow === "cancel") return CANCEL_STEPS;
    if (flow === "return") return RETURN_STEPS;
    return NORMAL_STEPS;
  }, [flow]);

  const activeIndex = useMemo(
    () => steps.findIndex((s) => s.key === activeKey),
    [steps, activeKey]
  );

  const getState = (index) => {
    if (index < activeIndex) return "done";
    if (index === activeIndex) return "active";
    return "future";
  };

  return (
    <div>
      {/* ── Step track ───────────────────────────────────────────────── */}
      {/* Mobile: vertical stack | Desktop: horizontal track */}
      <div className="sm:hidden flex flex-col">
        {steps.map((step, i) => {
          const state = getState(i);
          return (
            <div key={step.key}>
              <div className="flex items-start gap-4 py-1">
                <StepDot state={state} Icon={step.Icon} isBad={step.isBad} />
                <div className="flex flex-col pt-1">
                  <span
                    className={`text-sm font-medium leading-snug ${
                      state === "done"
                        ? step.isBad
                          ? "text-red-500"
                          : "text-[#3e3124]"
                        : state === "active"
                        ? "text-[#3e3124]"
                        : "text-[#b5a898]"
                    }`}
                  >
                    {step.label}
                  </span>
                  {state === "active" && (
                    <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[#b19777]">
                      Current
                    </span>
                  )}
                </div>
              </div>
              {i < steps.length - 1 && (
                <ConnectorLine filled={state === "done"} />
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop horizontal */}
      <div className="hidden sm:flex items-start">
        {steps.map((step, i) => {
          const state = getState(i);
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && <ConnectorLine filled={getState(i - 1) === "done"} />}
                <StepDot state={state} Icon={step.Icon} isBad={step.isBad} />
                {i < steps.length - 1 && <ConnectorLine filled={state === "done"} />}
              </div>
              <div className="mt-2 px-1 text-center">
                <span
                  className={`block text-[11px] font-medium leading-4 ${
                    state === "done"
                      ? step.isBad
                        ? "text-red-500"
                        : "text-[#3e3124]"
                      : state === "active"
                      ? "text-[#3e3124]"
                      : "text-[#b5a898]"
                  }`}
                >
                  {step.label}
                </span>
                {state === "active" && (
                  <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-[#b19777]">
                    Now
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detailed tracking history ─────────────────────────────────── */}
      {history.length > 0 && (
        <div className="mt-8 border-t border-[#e8dfd4] pt-6">
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8f765b]">
            Tracking History
          </h3>
          <div>
            {[...history].reverse().map((event, i) => (
              <TimelineEvent
                key={event.id ?? event.timestamp ?? i}
                event={event}
                isLast={i === history.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
