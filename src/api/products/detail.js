import api from "../client";

//  This function takes an image path or URL and returns a complete URL for the category image.
export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${encodeURIComponent(slug)}`);
  const payload = data?.data ?? data;
  const product = payload?.product ?? payload;
  return { ...product, variants: payload?.variants || product.variants || [] };
};
