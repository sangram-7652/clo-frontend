import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWatchVideos } from "../../api/watchVideos";
import { getImageUrl } from "../../api/home";

const MEDIA_URL = "https://api.clo.co.in/storage";

export default function WatchVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getWatchVideos();
        setVideos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) {
    return (
      <section className="py-10 text-center">
        Loading videos...
      </section>
    );
  }

  if (!videos.length) return null;

  return (
    <section className="py-12 bg-white">
      <div className="text-center mb-8">
        <h2 className="clo-section-title">Watch & Shop</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4">
        {videos.map((item) => (
          <div
            key={item.id}
            className="min-w-[280px] max-w-[280px] rounded-lg overflow-hidden border"
          >
            <video
              src={`${MEDIA_URL}/${item.video}`}
              controls
              muted
              playsInline
              className="w-full h-[420px] object-cover"
            />

            <div className="p-3">
              {item.product && (
                <>
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    className="w-14 h-14 rounded object-cover mb-2"
                  />

                  <h3 className="font-medium text-sm">
                    {item.product.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    ₹{item.price}
                  </p>

                  <Link
                    to={`/product-detail/${item.product.slug}`}
                    className="inline-block mt-2 text-sm font-medium underline"
                  >
                    Shop Now
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}