import api from "../client";

const getApiErrorMessage = (err, fallbackMessage) => {
  const errors = err?.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const validationMessages = Object.entries(errors)
      .flatMap(([field, messages]) => {
        if (Array.isArray(messages)) return messages;
        if (typeof messages === "string") return messages;
        return `${field} is invalid.`;
      })
      .filter(Boolean);

    if (validationMessages.length) {
      return validationMessages.join(" ");
    }
  }

  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallbackMessage
  );
};

const logApiError = (label, err) => {
  if (import.meta.env.DEV) {
    console.error(label, err?.response?.data || err);
  }
};

// fetch cart data
export const fetchCart = async () => {
  try {
    const { data } = await api.get("/cart");
    return data;
  } catch (err) {
    logApiError("Fetch cart failed", err);
    throw new Error(getApiErrorMessage(err, "Unable to fetch cart."), {
      cause: err,
    });
  }
};

// add item to cart
export const addToCart = async (productData) => {
  try {
    const { data } = await api.post("/cart/add", productData);
    return data;
  } catch (err) {
    logApiError("Add to cart failed", err);
    throw new Error(getApiErrorMessage(err, "Unable to add item to cart."), {
      cause: err,
    });
  }
};

// update cart item quantity
export const updateCartItem = async (cartData) => {
  try {
    const { data } = await api.post("/cart/update", cartData);
    return data;
  } catch (err) {
    logApiError("Update cart failed", err);
    throw new Error(getApiErrorMessage(err, "Unable to update cart item."), {
      cause: err,
    });
  }
};

// delete item from cart
export const removeCartItem = async (cartData) => {
  try {
    const { data } = await api.post("/cart/remove", cartData);
    return data;
  } catch (err) {
    logApiError("Remove cart item failed", err);
    throw new Error(getApiErrorMessage(err, "Unable to remove cart item."), {
      cause: err,
    });
  }
};

// fetch backend-verified checkout totals

export const fetchCheckout = async () => {
  try {
    const { data } = await api.get("/checkout");
    return data;
  } catch (err) {
    logApiError("Fetch checkout failed", err);
    throw new Error(getApiErrorMessage(err, "Unable to fetch checkout."), {
      cause: err,
    });
  }
};

// place order from the authenticated user's current cart
export const placeOrder = async (orderData) => {
  try {
    const { data } = await api.post("/checkout/place-order", orderData);
    return data;
  } catch (err) {
    logApiError("Place order failed", err);
    throw new Error(getApiErrorMessage(err, "Unable to place order."), {
      cause: err,
    });
  }
};

// create Razorpay order from the authenticated user's current cart
export const createRazorpayOrder = async (orderData) => {
  try {
    const { data } = await api.post("/checkout/razorpay-order", orderData);
    return data;
  } catch (err) {
    logApiError("Create Razorpay order failed", err);
    throw new Error(
      getApiErrorMessage(err, "Unable to create Razorpay order."),
      {
        cause: err,
      },
    );
  }
};

// verify Razorpay payment and create the final order
export const confirmRazorpayPayment = async (paymentData) => {
  try {
    const { data } = await api.post("/checkout/razorpay-success", paymentData);
    return data;
  } catch (err) {
    logApiError("Confirm Razorpay payment failed", err);
    throw new Error(
      getApiErrorMessage(err, "Unable to verify Razorpay payment."),
      {
        cause: err,
      },
    );
  }
};
