import { useEffect, useState } from "react";
import { getHomeData, getHomeImageUrl } from "../../api/home";

const getCollections = (data) => {
  const c =
    data?.collections || data?.collection || data?.home_collections || [];
  return Array.isArray(c) ? c : [];
};

const CollectionsSection = () => {
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    getHomeData()
      .then((data) => setCollections(getCollections(data)))
      .catch(console.error);
  }, []);

  return (
    <section className="w-full bg-clo-soft py-14 md:py-20">
      <div className="mx-auto mb-8 max-w-3xl px-4 text-center md:mb-10">
        <p className="clo-eyebrow mb-3 text-[#6f6256]">CLO Collection</p>
        <h2 className="clo-section-title text-black">Shop By Collections</h2>
      </div>

      <div className="mx-auto max-w-412.5 px-3 sm:px-6 lg:px-10">
        {collections === null && (
          <p className="py-20 text-center">Loading...</p>
        )}

        {collections?.length === 0 && (
          <p className="py-20 text-center text-sm uppercase tracking-[2px] text-[#6f6256]">
            No collections available.
          </p>
        )}

        {collections?.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {collections.map((collection) => {
              const title = String(collection.name || "Collection").trim();
              const key = collection.id || collection.slug || title;
              const image = getHomeImageUrl(
                collection.image ||
                  collection.cover_image ||
                  collection.thumbnail,
              );

              return (
                <article
                  key={key}
                  className="group relative aspect-3/4 min-h-48 overflow-hidden bg-[#eee4d8] sm:min-h-60">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-4 text-center">
                      <span className="clo-card-title text-[#3e3124]">
                        {title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-0 z-10 w-full px-3 text-center text-white">
                    <h3 className="clo-card-title line-clamp-2 text-white drop-shadow-md">
                      {title}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
