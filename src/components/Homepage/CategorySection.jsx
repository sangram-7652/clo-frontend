import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getCategoryImageUrl,
} from "../../api/category/categories";

const GRID =
  "mx-auto grid max-w-[1650px] grid-cols-2 gap-1 px-3 sm:grid-cols-3 sm:px-6 lg:grid-cols-6";

const CategorySection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [failedImages, setFailedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Unable to load categories", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-clo-soft py-14 md:py-20">
        <div className={GRID}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-3/4 min-h-48 animate-pulse bg-[#eee4d8] sm:min-h-60"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-clo-soft py-14 md:py-20">
      <div className="mb-8 px-4 text-center md:mb-10">
        <h2 className="clo-section-title text-black">Shop By Categories</h2>
      </div>

      {categories.length ? (
        <div className={GRID}>
          {categories.slice(0, 12).map((cat) => {
            const name = cat.name;
            const image = getCategoryImageUrl(cat.image);
            const slug = cat.slug || "";
            const imageKey = cat.id || slug || name;

            return (
              <button
                key={imageKey}
                type="button"
                disabled={!slug}
                onClick={() =>
                  slug && navigate(`/categories/${encodeURIComponent(slug)}`)
                }
                className="group relative aspect-3/4 min-h-48 overflow-hidden bg-[#eee4d8] text-left  disabled:opacity-60 sm:min-h-60">
                {image && !failedImages[imageKey] ? (
                  <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [imageKey]: true }))
                    }
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-4 text-center">
                    <span className="clo-card-title text-[#3e3124]">
                      {name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/80" />
                <div className="absolute bottom-5 left-0 z-10 w-full px-3 text-center">
                  <h3 className="clo-card-title text-white drop-shadow-md">
                    {name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mx-auto max-w-412.5 px-3 sm:px-6">
          <div className="flex min-h-48 items-center justify-center bg-clo-soft px-4 text-center sm:min-h-60">
            <p className="text-sm font-medium uppercase tracking-[2px] text-[#6f6256]">
              {error
                ? "Failed to load categories."
                : "No categories available."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategorySection;
