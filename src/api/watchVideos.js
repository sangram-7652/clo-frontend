import api from "./client";

export const getWatchVideos = async () => {
  const { data } = await api.get("/watch-videos");
  return data.data || [];
};

