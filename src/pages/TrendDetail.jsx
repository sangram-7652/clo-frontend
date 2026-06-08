import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTrend } from "../api/trends";

const MEDIA_URL = "https://api.clo.co.in/storage";

const imageUrl = (img) =>
  img ? `${MEDIA_URL}/${img.replace(/^\/|^storage\//, "")}` : "";

export default function TrendDetail() {
  const { slug } = useParams();
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrend = async () => {
      try {
        const data = await getTrend(slug);
        console.log("Trend Response:", data);
        setTrend(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTrend();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        Loading...
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="container mx-auto px-4 py-10">
        Trend not found
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Trend Banner */}
      {trend.image && (
        <img
          src={imageUrl(trend.image)}
          alt={trend.title}
          className="w-full rounded-lg object-cover"
        />
      )}

      {/* Trend Title */}
      <h1 className="text-4xl font-bold mt-6">
        {trend.title}
      </h1>

      {/* Trend Description */}
      {trend.description && (
        <div
          className="mt-4 prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: trend.description,
          }}
        />
      )}

      {/* Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          Products in this Trend
        </h2>

        {trend.products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trend.products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={imageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-3 font-medium">
                  {product.name}
                </h3>

                <div className="mt-1">
                  {product.discount_price ? (
                    <>
                      <span className="font-semibold">
                        ₹{product.discount_price}
                      </span>

                      <span className="ml-2 text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">
                      ₹{product.price}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No products found for this trend.
          </p>
        )}
      </div>
    </section>
  );
}