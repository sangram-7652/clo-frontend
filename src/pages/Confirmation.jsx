/**
 * Confirmation.jsx — Order Success page
 *
 * Route: /order-success  or  /order-confirmed
 *
 * Changes from original:
 * - Guards against direct URL access (refresh / bookmark)
 *   → Redirects to / if no order state is present
 * - Shows "View Order Details" link to /account/orders/:id
 * - Shows "Track Order" link to /track-order?order=<orderNumber>
 * - Removed PaymentPage reference from "View Account" button
 *   (now links to /account/orders)
 */

import { Check } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getFirstValue = (...values) =>
  values.find((v) => v !== undefined && v !== null && v !== "");

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Guard: if navigated directly (refresh / bookmark), redirect home
  if (!location.state?.order && !location.state?.total) {
    return <Navigate to="/" replace />;
  }

  const order = location.state?.order ?? {};
  const orderNumber =
    getFirstValue(
      order.orderNumber,
      order.order_number,
      order.orderId,
      order.order_id,
      order.id,
      order._id,
    ) ?? "Processing";

  const orderId = getFirstValue(order.id, order._id, order.orderId, order.order_id);

  const totalPaid = getFirstValue(
    location.state?.total,
    order.total,
    order.total_price,
    order.totalPrice,
    order.total_amount,
    order.totalAmount,
    order.grand_total,
    order.grandTotal,
    order.payable_amount,
    order.payableAmount,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f2eb] px-4 py-10">
      <div className="w-full max-w-3xl text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#efe7da]">
          <Check className="h-10 w-10 text-[#b88b3f]" strokeWidth={2.2} />
        </div>

        {/* Heading */}
        <p className="clo-eyebrow mt-8 text-[#b88b3f]">Thank You</p>
        <h1 className="clo-page-title mt-4 text-[#1a1a1a]">
          Order Placed Successfully
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5d5550]">
          Your order has been received and is being prepared with care. You will
          receive a confirmation email shortly.
        </p>

        {/* Order details box */}
        <div className="mt-10 border border-[#ddd4ca] bg-[#faf7f2] px-5 py-8 text-left md:mt-14 md:px-10 md:py-10">
          <div className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg text-[#5d5550]">Order Number</span>
              <span className="font-mono text-lg font-semibold tracking-wide text-[#1a1a1a]">
                #{orderNumber}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg text-[#5d5550]">Total Paid</span>
              <span className="text-xl font-semibold text-[#1a1a1a]">
                {totalPaid !== undefined ? formatPrice(totalPaid) : "Processing"}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg text-[#5d5550]">Estimated Delivery</span>
              <span className="text-lg text-[#1a1a1a]">5–7 business days</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-md bg-black px-10 py-4 text-sm uppercase tracking-[2px] text-white transition hover:bg-[#222] sm:w-auto"
          >
            Continue Shopping
          </button>

          {orderId && (
            <Link
              to={`/account/orders/${encodeURIComponent(orderId)}`}
              className="w-full rounded-md border border-[#d7cec4] px-10 py-4 text-sm uppercase tracking-[2px] text-[#5d5550] transition hover:border-black hover:text-black sm:w-auto"
            >
              View Order Details
            </Link>
          )}

          <Link
            to={`/track-order?order=${encodeURIComponent(orderNumber)}`}
            className="w-full rounded-md border border-[#d7cec4] px-10 py-4 text-sm uppercase tracking-[2px] text-[#5d5550] transition hover:border-black hover:text-black sm:w-auto"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
