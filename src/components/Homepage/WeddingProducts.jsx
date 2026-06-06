import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeData, getProductImageUrl } from "../../api/home";

const WeddingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [failedImages, setFailedImages] = useState({});
  const placeholders = [
    "Wedding Edit",
    "Celebration Wear",
    "Festive Favorites",
    "Occasion Picks",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getHomeData();

        if (isMounted) {
          setProducts(data?.wedding_products || []);
        }
      } catch (error) {
        console.error("Unable to load wedding products", error);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-clo-soft py-14 md:py-20">
      <div className="mb-6 px-4 text-center">
        <h2 className="clo-section-title text-black">Wedding Picks</h2>
      </div>

      <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-10">
        {products.length
          ? products.map((product) => {
              const imageUrl = getProductImageUrl(product.image);

              return (
                <article
                  key={`wedding-${product.id}`}
                  onClick={() =>
                    navigate(
                      `/product-detail/${encodeURIComponent(product.slug)}`,
                    )
                  }
                  className="home-product-card group cursor-pointer">
                  <div className="aspect-3/4 overflow-hidden rounded-md bg-[#eee4d8]">
                    {imageUrl && !failedImages[product.id] ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={() =>
                          setFailedImages((current) => ({
                            ...current,
                            [product.id]: true,
                          }))
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#eee4d8] px-4 text-center">
                        <span className="clo-card-title text-[#3e3124]">
                          {product.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="line-clamp-2 text-base font-medium text-[#3e3124]">
                      {product.name?.trim()}
                    </h3>
                    <p className="mt-1 text-sm text-[#6f6256]">
                      Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </article>
              );
            })
          : placeholders.map((title) => (
              <article
                key={`wedding-placeholder-${title}`}
                className="home-product-card group">
                <div className="aspect-3/4 overflow-hidden rounded-md bg-[#eee4d8]">
                  <div className="flex h-full w-full items-center justify-center px-4 text-center">
                    <span className="clo-card-title text-[#3e3124]">
                      {title}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="line-clamp-2 text-base font-medium text-[#3e3124]">
                    Coming soon
                  </h3>
                  <p className="mt-1 text-sm text-[#6f6256]">
                    New products loading
                  </p>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
};

export default WeddingProducts;
