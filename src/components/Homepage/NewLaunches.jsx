import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../../api/home";
import { getNewLaunches } from "../../api/newLaunches";

const skeletonItems = Array.from({ length: 4 });

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const NewLaunches = () => {
  const navigate = useNavigate();
  const railRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [failedImages, setFailedImages] = useState({});
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    const loadNewLaunches = async () => {
      try {
        const { products: newLaunches } = await getNewLaunches();

        if (isMounted) {
          setProducts(newLaunches);
          setStatus("success");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Unable to load new launches", error);
          setStatus("error");
        }
      }
    };

    loadNewLaunches();

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollProducts = useCallback((direction) => {
    const rail = railRef.current;

    if (!rail) return;

    rail.scrollBy({
      left: direction * Math.min(rail.clientWidth * 0.85, 900),
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="w-full bg-clo-soft py-14 md:py-20">
      <div className="mb-8 px-4 text-center">
        <h2 className="clo-section-title ">New Launches</h2>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-10">
        {status === "loading" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {skeletonItems.map((_, index) => (
              <div key={`new-launch-skeleton-${index}`}>
                <div className="aspect-3/4 animate-pulse bg-[#eee4d8]" />
                <div className="mt-4 h-4 w-3/4 animate-pulse bg-[#e2d5c7]" />
                <div className="mt-2 h-3 w-1/3 animate-pulse bg-[#e2d5c7]" />
              </div>
            ))}
          </div>
        ) : null}

        {status === "error" ? (
          <div className="flex min-h-48 items-center justify-center bg-white px-4 text-center">
            <p className="text-sm font-medium uppercase tracking-[2px] text-[#6f6256]">
              New launches could not be loaded.
            </p>
          </div>
        ) : null}

        {status === "success" && products.length ? (
          <>
            <button
              type="button"
              aria-label="Scroll new launches left"
              onClick={() => scrollProducts(-1)}
              className="absolute left-2 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-black hover:text-white md:flex">
              <ChevronLeft size={20} />
            </button>

            <div
              ref={railRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
              {products.map((product) => {
                const imageUrl = getProductImageUrl(product.image);
                const salePrice =
                  product.discount_price &&
                  product.discount_price < product.price
                    ? product.discount_price
                    : null;

                return (
                  <article
                    key={`new-launch-${product.id}`}
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
                          decoding="async"
                          onError={() =>
                            setFailedImages((current) => ({
                              ...current,
                              [product.id]: true,
                            }))
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-4 text-center">
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
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-[#3e3124]">
                          {formatPrice(salePrice ?? product.price)}
                        </span>
                        {salePrice ? (
                          <span className="text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Scroll new launches right"
              onClick={() => scrollProducts(1)}
              className="absolute right-2 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-black hover:text-white md:flex">
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}

        {status === "success" && !products.length ? (
          <div className="flex min-h-48 items-center justify-center bg-white px-4 text-center">
            <p className="text-sm font-medium uppercase tracking-[2px] text-[#6f6256]">
              No new launches available.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NewLaunches;
