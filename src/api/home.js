import api from "./client";

const MEDIA_URL = "https://api.clo.co.in/storage";

export async function getHomeData() {
  const { data } = await api.get("/home");
  return data?.data ?? data;
}

export function getImageUrl(image) {
  const path = String(image?.url || image?.path || image?.image || image || "");
  if (!path || path.startsWith("http")) return path;
  return `${MEDIA_URL}/${path.replace(/^\/|^storage\//gi, "")}`;
}

export const getHomeImageUrl = getImageUrl;
export const getProductImageUrl = getImageUrl;
