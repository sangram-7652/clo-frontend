import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { getProductImageUrl } from "../api/home";
import { getCategoryBySlug } from "../api/category/categories";

const skeletonItems = Array.from({ length: 8 });

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatTitle = (value, fallback = "") => {
  const text = String(value || fallback)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getProductImage = (product) => {
  const directImage =
    product?.image || product?.thumbnail || product?.cover_image;

  if (directImage) return getProductImageUrl(directImage);

  const imageList = product?.images || product?.product_images || [];
  const firstImage = Array.isArray(imageList) ? imageList[0] : null;

  return getProductImageUrl(
    firstImage?.image || firstImage?.url || firstImage?.path || firstImage,
  );
};

const CategoryProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [failedImages, setFailedImages] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const categorySlug = useMemo(() => {
    try {
      return decodeURIComponent(slug || "");
    } catch {
      return slug || "";
    }
  }, [slug]);

  const categoryTitle = formatTitle(category?.name, categorySlug);

  useEffect(() => {
    let isMounted = true;

    const loadCategory = async () => {
      if (!categorySlug) {
        setCategory(null);
        setProducts([]);
        setStatus("error");
        setError("Category slug is missing.");
        return;
      }

      setStatus("loading");
      setError("");

      try {
        const data = await getCategoryBySlug(categorySlug);

        if (isMounted) {
          setCategory(data.category);
          setProducts(Array.isArray(data.products) ? data.products : []);
          setStatus("success");
        }
      } catch (requestError) {
        if (isMounted) {
          console.error("Unable to load category", requestError);
          setCategory(null);
          setProducts([]);
          setStatus("error");
          setError("We could not load this category. Please try again.");
        }
      }
    };

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  if (status === "loading") {
    return (
      <section className="min-h-screen bg-[#f7f2eb] px-4 pb-16 pt-4 md:px-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-4 w-56 animate-pulse bg-[#e2d5c7]" />
          <div className="mb-10 h-10 w-72 animate-pulse bg-[#e2d5c7]" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {skeletonItems.map((_, index) => (
              <div key={`category-skeleton-${index}`}>
                <div className="aspect-3/4 animate-pulse bg-[#eee4d8]" />
                <div className="mt-4 h-4 w-3/4 animate-pulse bg-[#e2d5c7]" />
                <div className="mt-2 h-3 w-1/3 animate-pulse bg-[#e2d5c7]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f7f2eb] px-4 text-center text-[#3e3124]">
        <h1 className="clo-card-title mb-3">Category not found</h1>
        <p className="mb-6 max-w-md text-sm text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-black px-6 py-3 text-xs font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222]">
          Continue Shopping
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 pb-16 pt-4 md:px-8 md:pt-6">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Categories" },
            { label: categoryTitle },
          ]}
        />

        <div className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="clo-eyebrow mb-3 text-[#6f6256]">Category</p>
            <h1 className="clo-section-title text-black">{categoryTitle}</h1>
          </div>
          <p className="text-xs uppercase tracking-[2px] text-[#6f6256]">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const productKey =
                product.id || product._id || product.slug || product.name;
              const title = product.name || product.title || "Product";
              const image = getProductImage(product);
              const salePrice =
                product.discount_price &&
                Number(product.discount_price) < Number(product.price)
                  ? product.discount_price
                  : null;

              return (
                <button
                  key={`category-product-${productKey}`}
                  type="button"
                  disabled={!product.slug}
                  onClick={() =>
                    product.slug &&
                    navigate(
                      `/product-detail/${encodeURIComponent(product.slug)}`,
                    )
                  }
                  className="group text-left disabled:cursor-not-allowed disabled:opacity-70">
                <div className="aspect-3/4 overflow-hidden rounded-md bg-[#eee4d8]">
                    {image && !failedImages[productKey] ? (
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        onError={() =>
                          setFailedImages((current) => ({
                            ...current,
                            [productKey]: true,
                          }))
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-4 text-center">
                        <span className="clo-card-title text-[#3e3124]">
                          {title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h2 className="line-clamp-2 text-base font-medium text-[#3e3124]">
                      {title}
                    </h2>
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
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center bg-white px-4 text-center">
            <p className="text-sm font-medium uppercase tracking-[2px] text-[#6f6256]">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProducts;
