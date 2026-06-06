import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  confirmRazorpayPayment,
  createRazorpayOrder,
  fetchCheckout,
  placeOrder,
} from "../api/cart/cart";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getFirstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const initialOrderForm = {
  shippingAddress: {
    phone: "",
    address: "",
  },
  paymentMethod: "cod",
};

const getCheckoutSummary = (checkoutData) => {
  const sources = [
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
  ].filter(Boolean);

  const getAmount = (...keys) => {
    for (const source of sources) {
      const amount = Number(getFirstValue(...keys.map((key) => source?.[key])));
      if (Number.isFinite(amount)) return amount;
    }

    return null;
  };

  return {
    subtotal: getAmount(
      "subtotal",
      "sub_total",
      "total_mrp",
      "totalMRP",
      "items_total",
      "itemsTotal",
    ),
    discount: getAmount(
      "discount",
      "discount_amount",
      "discountAmount",
      "total_discount",
      "totalDiscount",
    ),
    shipping: getAmount(
      "shipping",
      "shipping_charge",
      "shippingCharge",
      "delivery_charge",
      "deliveryCharge",
    ),
    tax: getAmount("tax", "tax_amount", "taxAmount", "gst", "gst_amount"),
    total: getAmount(
      "total",
      "total_price",
      "totalPrice",
      "total_amount",
      "totalAmount",
      "grand_total",
      "grandTotal",
      "payable_amount",
      "payableAmount",
      "final_total",
      "finalTotal",
    ),
  };
};

const getSummaryRows = (summary) =>
  [
    { key: "subtotal", label: "Subtotal", value: summary?.subtotal },
    {
      key: "discount",
      label: "Discount",
      value: summary?.discount,
      isDiscount: true,
    },
    { key: "tax", label: "Tax", value: summary?.tax },
    {
      key: "shipping",
      label: "Shipping",
      value: summary?.shipping,
      freeWhenZero: true,
    },
  ].filter((row) => row.value !== null && row.value !== undefined);

const getOrderDetails = (orderResponse) =>
  getFirstValue(
    orderResponse?.data?.order,
    orderResponse?.data,
    orderResponse?.order,
    orderResponse,
  );

const getOrderId = (orderResponse) => {
  const orderDetails = getOrderDetails(orderResponse);

  return getFirstValue(
    orderDetails?.order_id,
    orderDetails?.orderId,
    orderDetails?.id,
    orderDetails?._id,
    orderResponse?.data?.order_id,
    orderResponse?.data?.orderId,
    orderResponse?.order_id,
    orderResponse?.orderId,
    orderResponse?.id,
  );
};

const getRazorpayOrderDetails = (orderResponse) =>
  getFirstValue(
    orderResponse?.data?.razorpay_order,
    orderResponse?.data?.razorpayOrder,
    orderResponse?.data?.order,
    orderResponse?.data,
    orderResponse?.razorpay_order,
    orderResponse?.razorpayOrder,
    orderResponse?.order,
    orderResponse,
  );

const getRazorpayOrderId = (razorpayOrder) =>
  getFirstValue(
    razorpayOrder?.razorpay_order_id,
    razorpayOrder?.razorpayOrderId,
    razorpayOrder?.order_id,
    razorpayOrder?.orderId,
    razorpayOrder?.id,
  );

const getRazorpayKey = (razorpayOrder) =>
  getFirstValue(
    razorpayOrder?.key,
    razorpayOrder?.key_id,
    razorpayOrder?.keyId,
    razorpayOrder?.razorpay_key,
    razorpayOrder?.razorpayKey,
    import.meta.env.VITE_RAZORPAY_KEY_ID,
  );

const getRazorpayAmount = (razorpayOrder, total) =>
  getFirstValue(
    razorpayOrder?.amount,
    razorpayOrder?.amount_due,
    razorpayOrder?.amountDue,
    total !== null && total !== undefined ? Number(total) * 100 : null,
  );

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderForm, setOrderForm] = useState(() => {
    try {
      const savedDetails = sessionStorage.getItem("checkoutPlaceOrderData");
      return savedDetails ? JSON.parse(savedDetails) : initialOrderForm;
    } catch {
      return initialOrderForm;
    }
  });
  const [checkoutData, setCheckoutData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

  const summary = useMemo(
    () => getCheckoutSummary(checkoutData),
    [checkoutData],
  );
  const summaryRows = useMemo(() => getSummaryRows(summary), [summary]);

  useEffect(() => {
    let isMounted = true;

    const loadCheckout = async () => {
      try {
        setLoadingSummary(true);
        const data = await fetchCheckout();
        if (isMounted) setCheckoutData(data);
      } catch (err) {
        toast.error(err?.message || "Unable to load checkout details.");
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    };

    loadCheckout();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((currentForm) => ({
      ...currentForm,
      shippingAddress: {
        ...currentForm.shippingAddress,
        [name]: value,
      },
    }));
  };

  const handlePaymentChange = (event) => {
    setOrderForm((currentForm) => ({
      ...currentForm,
      paymentMethod: event.target.value,
    }));
  };

  const buildPlaceOrderPayload = () => {
    const shippingAddress = Object.fromEntries(
      Object.entries(orderForm.shippingAddress).map(([key, value]) => [
        key,
        String(value).trim(),
      ]),
    );
    const shippingAddressPayload = {
      phone: shippingAddress.phone,
      address: shippingAddress.address,
    };

    return {
      shippingAddress,
      shipping_address: shippingAddressPayload,
      ...shippingAddressPayload,
      paymentMethod: orderForm.paymentMethod,
      payment_method: orderForm.paymentMethod,
    };
  };

  const handleConfirmedOrder = (orderResponse, fallbackTotal) => {
    const orderDetails = getOrderDetails(orderResponse);

    sessionStorage.removeItem("checkoutPlaceOrderData");
    sessionStorage.removeItem("checkoutShippingDetails");
    toast.success("Order placed successfully");
    navigate("/order-success", {
      state: {
        order: orderDetails,
        total: getFirstValue(
          getCheckoutSummary(orderResponse).total,
          fallbackTotal,
        ),
      },
    });
  };

  const placeCodOrder = async (payload, refreshedSummary) => {
    const orderResponse = await placeOrder(payload);
    handleConfirmedOrder(orderResponse, refreshedSummary.total);
  };

  const placeRazorpayOrder = async (payload, refreshedSummary) => {
    await loadRazorpayScript();

    const pendingOrderResponse = await placeOrder({
      ...payload,
      paymentMethod: "razorpay",
      payment_method: "razorpay",
      payment_status: "pending",
    });
    const localOrderId = getOrderId(pendingOrderResponse);

    if (!localOrderId) {
      throw new Error("Order id is missing from the place order response.");
    }

    const totalAmount = refreshedSummary.total;
    const razorpayOrderResponse = await createRazorpayOrder({
      ...payload,
      order_id: localOrderId,
      orderId: localOrderId,
      amount: totalAmount,
      total: totalAmount,
      total_amount: totalAmount,
      payable_amount: totalAmount,
    });
    const razorpayOrder = getRazorpayOrderDetails(razorpayOrderResponse);
    const razorpayOrderId = getRazorpayOrderId(razorpayOrder);
    const razorpayKey = getRazorpayKey(razorpayOrder);
    const razorpayAmount = getRazorpayAmount(
      razorpayOrder,
      refreshedSummary.total,
    );

    if (!razorpayKey) {
      throw new Error(
        "Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID in frontend env or return key_id from /checkout/razorpay-order.",
      );
    }

    if (!razorpayOrderId) {
      throw new Error("Razorpay order id is missing from the backend.");
    }

    if (!razorpayAmount) {
      throw new Error("Razorpay amount is missing from the backend.");
    }

    await new Promise((resolve, reject) => {
      let paymentFailed = false;

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: razorpayAmount,
        currency: getFirstValue(razorpayOrder?.currency, "INR"),
        name: getFirstValue(razorpayOrder?.name, "CLO"),
        description: "Order payment",
        order_id: razorpayOrderId,
        prefill: {
          contact: payload.shippingAddress.phone,
        },
        notes: {
          address: payload.shippingAddress.address,
        },
        handler: async (paymentResponse) => {
          try {
            setProcessingPayment(true);
            const successResponse = await confirmRazorpayPayment({
              ...payload,
              order_id: localOrderId,
              orderId: localOrderId,
              paymentMethod: "razorpay",
              payment_method: "razorpay",
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            handleConfirmedOrder(
              successResponse || pendingOrderResponse,
              refreshedSummary.total,
            );
            resolve(successResponse);
          } catch (err) {
            reject(err);
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            if (paymentFailed) return;
            reject(new Error("Payment was cancelled."));
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        paymentFailed = true;
        reject(
          new Error(
            response?.error?.description ||
              "Payment failed. Please try again or choose another method.",
          ),
        );
      });

      razorpay.open();
    });
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const payload = buildPlaceOrderPayload();
    const missingField = Object.entries(payload.shippingAddress).find(
      ([, value]) => !value,
    );

    if (missingField) {
      toast.error("Please complete all shipping address fields.");
      return;
    }

    try {
      setPlacingOrder(true);
      sessionStorage.setItem("checkoutPlaceOrderData", JSON.stringify(payload));
      setLoadingSummary(true);
      const refreshedCheckoutData = await fetchCheckout();
      setCheckoutData(refreshedCheckoutData);
      const refreshedSummary = getCheckoutSummary(refreshedCheckoutData);

      if (payload.paymentMethod === "razorpay") {
        await placeRazorpayOrder(payload, refreshedSummary);
      } else {
        await placeCodOrder(payload, refreshedSummary);
      }
    } catch (err) {
      toast.error(err?.message || "Could not place your order.");
    } finally {
      setPlacingOrder(false);
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] px-4 py-8 text-[#3e3124] md:px-10 md:py-10 lg:px-20">
      <div className="mb-10 text-center">
        <h1 className="clo-page-title">Checkout</h1>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
        <form className="space-y-8" onSubmit={handlePlaceOrder}>
          <section>
            <h2 className="clo-section-title mb-8">Shipping Address</h2>

            <div className="grid grid-cols-1 gap-5">
              <InputField
                label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={orderForm.shippingAddress.phone}
                onChange={handleShippingChange}
              />
            </div>

            <div className="mt-5">
              <InputField
                label="Address"
                name="address"
                value={orderForm.shippingAddress.address}
                onChange={handleShippingChange}
              />
            </div>
          </section>

          <section>
            <h2 className="clo-section-title mb-6">Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "cod", label: "Cash On Delivery" },
                { value: "razorpay", label: "Razorpay" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-xs font-medium uppercase tracking-[1.5px] transition ${
                    orderForm.paymentMethod === method.value
                      ? "border-black bg-black text-white"
                      : "border-[#d7c8b8] bg-white text-[#5d5550] hover:border-black"
                  }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={orderForm.paymentMethod === method.value}
                    onChange={handlePaymentChange}
                    className="sr-only"
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={placingOrder || processingPayment}
            className="w-full rounded-md bg-black py-4 text-sm uppercase tracking-[2px] text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:bg-[#555]">
            {processingPayment
              ? "Confirming Payment..."
              : placingOrder
                ? "Placing Order..."
                : `Place Order${
                  summary.total !== null && !loadingSummary
                    ? ` - ${formatPrice(summary.total)}`
                    : ""
                }`}
          </button>
        </form>

        <aside className="h-fit rounded-md border border-[#d7c8b8] bg-[#f3eee7] p-6 md:p-8 lg:sticky lg:top-28">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="clo-card-title">Order Summary</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#8f765b]">
                Backend verified
              </p>
            </div>
            {loadingSummary ? (
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8f765b]">
                Loading
              </span>
            ) : null}
          </div>

          <div className="space-y-4 border-b border-[#d8d1c8] pb-5 text-sm">
            {summaryRows.length ? (
              summaryRows.map((row) => (
                <div
                  key={row.key}
                  className={`flex justify-between gap-4 ${
                    row.isDiscount ? "text-[#8f765b]" : ""
                  }`}>
                  <span>{row.label}</span>
                  <span className="text-right font-medium">
                    {row.freeWhenZero && row.value === 0
                      ? "Free"
                      : `${row.isDiscount && row.value > 0 ? "-" : ""}${formatPrice(
                          Math.abs(row.value),
                        )}`}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[#6f6256]">
                Checkout totals will appear after the backend responds.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 pt-5">
            <span className="text-xl font-medium">Total</span>
            <span className="text-right text-2xl font-semibold">
              {loadingSummary
                ? "Loading..."
                : summary.total !== null
                  ? formatPrice(summary.total)
                  : "Unavailable"}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  inputMode,
}) => {
  return (
    <div>
      <label className="clo-eyebrow mb-3 block text-[#5d5550]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-4 outline-none transition focus:border-black"
      />
    </div>
  );
};

export default CheckoutPage;
