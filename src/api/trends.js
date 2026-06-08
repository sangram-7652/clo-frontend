import api from "./client";

export const getTrends = async () => {
  const { data } = await api.get("/trends");
  return data.data || [];
};

export const getTrend = async (slug) => {
  const { data } = await api.get(`/trends/${slug}`);
  return data.data;
};