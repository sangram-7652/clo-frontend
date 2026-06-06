import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHomeData, getProductImageUrl } from "../../api/home";

const BestSellerProducts = () => {
  const navigate = useNavigate();
  const railRef = useRef(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getHomeData()
      .then((data) => setProducts(data?.bestsellers || []))
      .catch(console.error);
  }, []);

  const scrollProducts = useCallback((direction) => {
    const rail = railRef.current;

    if (!rail) return;

    rail.scrollBy({
      left: direction * Math.min(rail.clientWidth * 0.85, 900),
      behavior: "smooth",
    });
  }, []);

  if (products === null) return <p className="py-20 text-center">Loading...</p>;

  return (
    <section className="w-full bg-clo-soft py-14 md:py-20">
      <div className="mb-6 px-4 text-center">
        <h2 className="clo-section-title text-black">Bestsellers</h2>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-10">
        {products.length ? (
          <>
            <button
              type="button"
              aria-label="Scroll bestsellers left"
              onClick={() => scrollProducts(-1)}
              className="absolute left-2 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-black hover:text-white md:flex">
              <ChevronLeft size={20} />
            </button>

            <div
              ref={railRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() =>
                    product.slug &&
                    navigate(
                      `/product-detail/${encodeURIComponent(product.slug)}`,
                    )
                  }
                  className={`home-product-card group ${product.slug ? "cursor-pointer" : ""}`}>
                  <div className="aspect-3/4 overflow-hidden rounded-md bg-[#eee4d8]">
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="line-clamp-2 text-base font-medium">
                      {product.name?.trim()}
                    </h3>
                    <p className="mt-1 text-sm">
                      Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-label="Scroll bestsellers right"
              onClick={() => scrollProducts(1)}
              className="absolute right-2 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-black hover:text-white md:flex">
              <ChevronRight size={20} />
            </button>
          </>
        ) : (
          <div className="flex min-h-48 items-center justify-center bg-clo-soft px-4 text-center">
            <p className="text-sm font-medium uppercase tracking-[2px] text-[#6f6256]">
              No bestsellers available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellerProducts;
