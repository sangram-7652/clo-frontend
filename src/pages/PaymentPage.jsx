import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchCheckout, placeOrder } from "../api/cart/cart";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getFirstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const getCheckoutTotal = (checkoutData) => {
  const sources = [
    checkoutData,
    checkoutData?.data,
    checkoutData?.summary,
    checkoutData?.data?.summary,
    checkoutData?.checkout,
    checkoutData?.data?.checkout,
    checkoutData?.price_details,
    checkoutData?.priceDetails,
    checkoutData?.data?.price_details,
    checkoutData?.data?.priceDetails,
  ].filter(Boolean);

  for (const source of sources) {
    const total = Number(
      getFirstValue(
        source.total,
        source.total_price,
        source.totalPrice,
        source.total_amount,
        source.totalAmount,
        source.grand_total,
        source.grandTotal,
        source.payable_amount,
        source.payableAmount,
        source.final_total,
        source.finalTotal,
      ),
    );

    if (Number.isFinite(total)) return total;
  }

  return null;
};

const getOrderDetails = (orderResponse) =>
  getFirstValue(
    orderResponse?.data?.order,
    orderResponse?.data,
    orderResponse?.order,
    orderResponse,
  );

const getSavedShippingDetails = () => {
  try {
    const savedDetails = sessionStorage.getItem("checkoutShippingDetails");
    return savedDetails ? JSON.parse(savedDetails) : null;
  } catch {
    return null;
  }
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutData, setCheckoutData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [shippingDetails] = useState(
    () => location.state?.shippingDetails || getSavedShippingDetails(),
  );
  const total = useMemo(() => getCheckoutTotal(checkoutData), [checkoutData]);

  useEffect(() => {
    let isMounted = true;

    if (!shippingDetails) {
      toast.error("Please add shipping details first.");
      navigate("/checkout", { replace: true });
      return undefined;
    }

    const loadCheckout = async () => {
      try {
        setLoadingSummary(true);
        const data = await fetchCheckout();
        if (isMounted) setCheckoutData(data);
      } catch (err) {
        toast.error(err?.message || "Unable to load checkout total.");
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    };

    loadCheckout();

    return () => {
      isMounted = false;
    };
  }, [navigate, shippingDetails]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingDetails) {
      toast.error("Please add shipping details first.");
      navigate("/checkout");
      return;
    }

    try {
      setPlacingOrder(true);
      const orderResponse = await placeOrder({
        shippingAddress: {
          firstName: shippingDetails.firstName.trim(),
          lastName: shippingDetails.lastName.trim(),
          email: shippingDetails.email.trim(),
          phone: shippingDetails.phone.trim(),
          address: shippingDetails.address.trim(),
          city: shippingDetails.city.trim(),
          state: shippingDetails.state.trim(),
          pinCode: shippingDetails.pinCode.trim(),
        },
        paymentMethod: "card",
      });
      const orderDetails = getOrderDetails(orderResponse);

      sessionStorage.removeItem("checkoutShippingDetails");
      toast.success("Order placed successfully");
      navigate("/order-confirmed", {
        state: {
          order: orderDetails,
          total: getFirstValue(getCheckoutTotal(orderResponse), total),
        },
      });
    } catch (err) {
      toast.error(err?.message || "Could not place your order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] px-4 py-8 text-[#3e3124] md:px-10 md:py-10 lg:px-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="clo-page-title">Checkout</h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[2px] sm:gap-5 sm:tracking-[3px]">
          <span className="text-[#8c8c8c]">1. Shipping</span>

          <div className="w-5 h-px bg-[#6e6a66]" />

          <span className="text-black font-medium">2. Payment</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
        {/* Payment Form */}
        <div>
          <h2 className="clo-section-title mb-10">Payment</h2>

          <form className="space-y-7" onSubmit={handlePlaceOrder}>
            {/* Card Number */}
            <InputField label="Card Number" placeholder="1234 5678 9012 3456" />

            {/* Expiry + CVV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Expiry" placeholder="MM / YY" />
              <InputField label="CVV" placeholder="..." />
            </div>

            {/* Name */}
            <InputField label="Name On Card" placeholder="John Doe" />

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="text-sm uppercase tracking-[2px] text-[#5d5550] transition hover:text-black">
              Back To Shipping
            </button>

            {/* Place Order */}
            <button
              type="submit"
              disabled={placingOrder}
              className="w-full rounded-md bg-black py-4 text-sm uppercase tracking-[2px] text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:bg-[#555]">
              {placingOrder
                ? "Placing Order..."
                : `Place Order${
                    total !== null && !loadingSummary
                      ? ` - ${formatPrice(total)}`
                      : ""
                  }`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-md bg-[#f3eee7] p-6 md:p-8">
          <h3 className="clo-card-title mb-8">Order Summary</h3>

          {/* Product */}
          <div className="flex gap-4 border-b border-[#d8d1c8] pb-5">
            <img
              src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=500&auto=format&fit=crop"
              alt="product"
              className="w-20 h-24 object-cover"
            />

            <div className="flex-1">
              <div className="flex justify-between gap-3">
                <h4 className="text-sm leading-5">
                  Blush Chikankari Kurta Set
                </h4>

                <span className="text-sm font-medium whitespace-nowrap">
                  Rs. 6,499
                </span>
              </div>

              <p className="mt-2 text-xs text-[#7a746d]">XS - Qty 1</p>
            </div>
          </div>

          {/* Promo */}
          <div className="py-6 border-b border-[#d8d1c8]">
            <p className="uppercase tracking-[3px] text-xs mb-4">Promo Code</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter code"
                className="h-12 min-w-0 flex-1 rounded-md border border-[#d7c8b8] bg-white px-4 text-sm outline-none transition focus:border-black"
              />

              <button className="rounded-md bg-black px-5 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-[#222]">
                Apply
              </button>
            </div>

            <p className="text-[11px] text-[#8c847a] mt-3">
              Try CLO10, LIBAAS15, or FESTIVE20
            </p>
          </div>

          {/* Totals */}
          <div className="pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {loadingSummary
                  ? "Loading..."
                  : total !== null
                    ? formatPrice(total)
                    : "Unavailable"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-[#b28a4d]">Free</span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-xl font-medium sm:text-2xl">Total</span>

              <span className="text-2xl font-semibold sm:text-3xl">
                {loadingSummary
                  ? "Loading..."
                  : total !== null
                    ? formatPrice(total)
                    : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder }) => {
  return (
    <div>
      <label className="clo-eyebrow block text-[#5d5550] mb-3">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-4 outline-none transition focus:border-black"
      />
    </div>
  );
};

export default PaymentPage;
