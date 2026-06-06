import api from "./client";

export async function getNewLaunches(page = 1) {
  const { data } = await api.get("/new-launches", {
    params: { page: Number(page) || 1 },
  });
  const payload = data?.data ?? data;
  return {
    products: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload || {},
  };
}
