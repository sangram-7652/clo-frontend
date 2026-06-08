import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrends } from "../../api/trends";

const MEDIA_URL = "https://api.clo.co.in/storage";

const imageUrl = (img) =>
  img ? `${MEDIA_URL}/${img.replace(/^\/|^storage\//, "")}` : "";

export default function ShopByTrends() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const data = await getTrends();
        setTrends(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, []);

  if (loading) {
    return (
      <section className="py-10 text-center">
        Loading trends...
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="text-center mb-8">
        <h2 className="clo-section-title">Shop By Trends</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {trends.map((trend) => (
          <Link
            key={trend.id}
            to={`/trends/${trend.slug}`}
            className="group"
          >
            <div className="overflow-hidden">
              <img
                src={imageUrl(trend.image)}
                alt={trend.title}
                className="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <h3 className="mt-3 text-center font-medium">
              {trend.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}