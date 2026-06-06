import api from "../client";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback;

const getValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

export const getWishlistProductId = (item) => {
  const product = item?.product || item?.product_details || item?.productData;

  return getValue(
    item?.product_id,
    item?.productId,
    product?.id,
    product?._id,
    item?.id,
    item?._id,
  );
};

const buildWishlistPayload = (item) => {
  const wishlistItemId = getValue(
    item?.wishlist_id,
    item?.wishlistId,
    item?.wishlist_item_id,
    item?.wishlistItemId,
  );
  const productId = getWishlistProductId(item);

  if (!productId) {
    throw new Error("Product id is missing.");
  }

  const payload = { product_id: productId };

  if (wishlistItemId) {
    payload.id = wishlistItemId;
    payload.wishlist_id = wishlistItemId;
  }

  return payload;
};

export const fetchWishlist = async () => {
  try {
    const { data } = await api.get("/wishlist");
    return data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Could not load wishlist."), {
      cause: err,
    });
  }
};

export const addWishlistItem = async (item) => {
  try {
    const { data } = await api.post("/wishlist/add", buildWishlistPayload(item));
    return data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Could not add item to wishlist."), {
      cause: err,
    });
  }
};

export const removeWishlistItem = async (item) => {
  try {
    const { data } = await api.post(
      "/wishlist/remove",
      buildWishlistPayload(item),
    );
    return data;
  } catch (err) {
    throw new Error(
      getErrorMessage(err, "Could not remove item from wishlist."),
      { cause: err },
    );
  }
};


