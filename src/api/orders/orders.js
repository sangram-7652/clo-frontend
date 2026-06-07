import api from "../client";

// ─── Error normalisation ───────────────────────────────────────────────────
const getApiErrorMessage = (err, fallback) => {
  const errors = err?.response?.data?.errors;
  if (errors && typeof errors === "object") {
    const msgs = Object.values(errors)
      .flat()
      .filter((m) => typeof m === "string");
    if (msgs.length) return msgs.join(" ");
  }
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
};

const logDev = (label, err) => {
  if (import.meta.env.DEV) console.error(`[orders] ${label}`, err?.response?.data ?? err);
};

// ─── Response normalisers ──────────────────────────────────────────────────

/**
 * Extract the orders array from whatever shape the backend returns.
 * Supports: data[], data.data[], data.orders[], data.data.orders[]
 */
export const extractOrdersList = (raw) => {
  const payload = raw?.data ?? raw;
  const list =
    (Array.isArray(payload) && payload) ||
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload?.orders) && payload.orders) ||
    (Array.isArray(payload?.data?.orders) && payload.data.orders) ||
    [];

  const pagination = payload?.meta || payload?.pagination || null;
  return { orders: list, pagination };
};

/**
 * Extract a single order from whatever shape the backend returns.
 * Supports: data, data.data, data.order, data.data.order
 */
export const extractOrder = (raw) => {
  const payload = raw?.data ?? raw;
  return payload?.order ?? payload?.data?.order ?? payload?.data ?? payload ?? null;
};

/**
 * Normalise an order object into a stable shape that the UI can rely on.
 */
export const normaliseOrder = (order) => {
  if (!order) return null;

  const items =
    order.items ||
    order.order_items ||
    order.orderItems ||
    order.products ||
    [];

  return {
    // identity
    id: order.id ?? order._id,
    orderNumber: order.order_number ?? order.orderNumber ?? order.id ?? "—",

    // status
    status: order.status ?? "pending",
    paymentStatus: order.payment_status ?? order.paymentStatus ?? "pending",
    paymentMethod: order.payment_method ?? order.paymentMethod ?? "unknown",

    // amounts
    subtotal: Number(order.subtotal ?? order.sub_total ?? 0),
    discount: Number(order.discount ?? order.discount_amount ?? 0),
    shipping: Number(order.shipping ?? order.shipping_charge ?? order.delivery_charge ?? 0),
    tax: Number(order.tax ?? order.tax_amount ?? order.gst ?? 0),
    total: Number(
      order.total ??
      order.total_amount ??
      order.grand_total ??
      order.payable_amount ??
      order.final_total ??
      0
    ),

    // address
    shippingAddress:
      order.shipping_address ??
      order.shippingAddress ??
      order.address ??
      null,

    // dates
    createdAt: order.created_at ?? order.createdAt ?? null,
    updatedAt: order.updated_at ?? order.updatedAt ?? null,
    estimatedDelivery: order.estimated_delivery ?? order.estimatedDelivery ?? null,

    // tracking
trackingNumber:
  order.tracking_number ??
  order.trackingNumber ??
  null,

trackingUrl:
  order.tracking_url ??
  order.trackingUrl ??
  null,

trackingHistory:
  Array.isArray(order.tracking_history)
    ? order.tracking_history
    : Array.isArray(order.timeline)
    ? order.timeline
    : Array.isArray(order.tracking)
    ? order.tracking
    : [],

    // Razorpay
    razorpayOrderId: order.razorpay_order_id ?? order.razorpayOrderId ?? null,
    razorpayPaymentId: order.razorpay_payment_id ?? order.razorpayPaymentId ?? null,

    // line items
    items: Array.isArray(items) ? items.map(normaliseOrderItem) : [],

    // raw (for debugging / fields we haven't mapped yet)
    _raw: order,
  };
};

export const normaliseOrderItem = (item) => {
  const product = item?.product ?? item?.product_details ?? item;
  const variant = item?.variant ?? item?.product_variant ?? null;

  const imageRaw =
    item.image ??
    item.product_image ??
    product?.image ??
    product?.thumbnail ??
    product?.images?.[0]?.image ??
    product?.images?.[0] ??
    variant?.images?.[0]?.image ??
    null;

  return {
    id: item.id ?? item._id ?? item.cart_item_id,
    productId: item.product_id ?? item.productId ?? product?.id,
    variantId: item.product_variant_id ?? item.variantId ?? variant?.id ?? null,
    name:
      item.name ??
      item.title ??
      item.product_name ??
      product?.name ??
      product?.title ??
      "Product",
    sku: item.sku ?? product?.sku ?? null,
    image: imageRaw,
    size: item.size ?? item.selectedSize ?? variant?.size ?? null,
    color: item.color ?? item.selectedColor ?? variant?.color ?? null,
    price: Number(item.price ?? item.discount_price ?? product?.price ?? 0),
    mrp: Number(item.mrp ?? item.original_price ?? product?.price ?? 0),
    quantity: Number(item.quantity ?? item.qty ?? 1),
    lineTotal: Number(item.line_total ?? item.lineTotal ?? item.total ?? 0),
  };
};

// ─── API calls ────────────────────────────────────────────────────────────

/**
 * GET /orders  — authenticated customer's order history
 */
export const fetchOrders = async ({ page = 1, status = "" } = {}) => {
  try {
    const params = { page };
    if (status) params.status = status;
    const { data } = await api.get("/orders", { params });
    return extractOrdersList(data);
  } catch (err) {
    logDev("fetchOrders", err);
    throw new Error(getApiErrorMessage(err, "Unable to load your orders."), { cause: err });
  }
};

/**
 * GET /orders/:id  — single order detail (authenticated)
 */
export const fetchOrderById = async (orderId) => {
  try {
    const { data } = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return normaliseOrder(extractOrder(data));
  } catch (err) {
    logDev("fetchOrderById", err);
    const status = err?.response?.status;
    if (status === 404) throw new Error("Order not found.", { cause: err });
    if (status === 403) throw new Error("You do not have access to this order.", { cause: err });
    throw new Error(getApiErrorMessage(err, "Unable to load order details."), { cause: err });
  }
};


export const trackOrderByNumber = async (orderNumber) => {
  try {
    const { data } = await api.post("/track-order", {
      order_id: orderNumber.trim(),
    });

    const order = extractOrder(data);

    return normaliseOrder(order);
  } catch (err) {
    logDev("trackOrderByNumber", err);

    const status = err?.response?.status;

    if (status === 404) {
      throw new Error(
        "No order found with that order number.",
        { cause: err }
      );
    }

    throw new Error(
      getApiErrorMessage(err, "Unable to track order."),
      { cause: err }
    );
  }
};

/**
 * POST /orders/:id/cancel  — cancel an order
 */
export const cancelOrder = async (orderId, reason = "") => {
  try {
    const { data } = await api.post(`/orders/${encodeURIComponent(orderId)}/cancel`, { reason });
    return normaliseOrder(extractOrder(data));
  } catch (err) {
    logDev("cancelOrder", err);
    throw new Error(getApiErrorMessage(err, "Unable to cancel order."), { cause: err });
  }
};
