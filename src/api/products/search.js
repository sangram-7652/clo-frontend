import api from "../client";

export const searchProducts = async (query) => {
  const { data } = await api.get("/products/search", {
    params: { q: query, page: 1, limit: 10 },
  });
  return Array.isArray(data)
    ? data
    : data?.data?.products || data?.products || [];
};
