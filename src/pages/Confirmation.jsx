import { Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getFirstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || {};
  const orderNumber =
    getFirstValue(
      order.orderNumber,
      order.order_number,
      order.orderId,
      order.order_id,
      order.id,
      order._id,
    ) || "Processing";
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
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#efe7da] flex items-center justify-center">
          <Check className="w-10 h-10 text-[#b88b3f]" strokeWidth={2.2} />
        </div>

        {/* Heading */}
        <p className="clo-eyebrow mt-8 text-[#b88b3f]">
          Thank You
        </p>

        <h1 className="clo-page-title mt-4 text-[#1a1a1a]">
          Order Placed Successfully
        </h1>

        <p className="mt-6 text-[#5d5550] text-lg leading-8 max-w-2xl mx-auto">
          Thank you for your purchase. Your order has been placed and is being
          prepared with care.
        </p>

        {/* Order Details Box */}
        <div className="mt-10 border border-[#ddd4ca] bg-[#faf7f2] px-5 py-8 text-left md:mt-14 md:px-10 md:py-10">
          <div className="space-y-6">
            {/* Row */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-[#5d5550] text-lg">Order Number</span>

              <span className="font-semibold text-lg tracking-wide text-[#1a1a1a]">
                {orderNumber}
              </span>
            </div>

            {/* Row */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-[#5d5550] text-lg">Total Paid</span>

              <span className="font-semibold text-xl text-[#1a1a1a]">
                {totalPaid !== undefined ? formatPrice(totalPaid) : "Processing"}
              </span>
            </div>

            {/* Row */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-[#5d5550] text-lg">Estimated Delivery</span>

              <span className="text-[#1a1a1a] text-lg">5-7 business days</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-md bg-black px-10 py-4 text-sm uppercase tracking-[2px] text-white transition hover:bg-[#222] sm:w-auto">
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/account")}
            className="w-full rounded-md border border-[#d7cec4] px-10 py-4 text-sm uppercase tracking-[2px] text-[#5d5550] transition hover:border-black hover:text-black sm:w-auto">
            View Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
