import api from "../client";

const BASE_URL = (
  import.meta.env.VITE_IMAGE_URL || "https://api.clo.co.in/storage"
).replace(/\/+$/, "");

//   This function takes an image path or URL and returns a complete URL for the category image.

export const getCategoryImageUrl = (image) => {
  if (!image) return "";
  const str = String(image);
  return str.startsWith("http")
    ? str
    : `${BASE_URL}/${str.replace(/^\/|^storage\//gi, "")}`;
};

// fetches the list of categories from the API and returns as array.
export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return Array.isArray(data)
    ? data
    : data?.data?.categories || data?.categories || data?.data || [];
};

// fetches the details of a specific category based on the provided slug

export const getCategoryBySlug = async (slug) => {
  const { data } = await api.get(`/categories/${encodeURIComponent(slug)}`);
  const payload = data?.data ?? data;
  const category = payload?.category ?? payload;
  const products =
    [payload, payload?.products, payload?.category?.products]
      .map((s) => (Array.isArray(s) ? s : s?.data))
      .find((s) => s?.length) || [];

  return { category, products };
};

export default getCategories;
