import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getCategoryImageUrl,
} from "../../api/category/categories";


const ShopNow = ({ type = "women" }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        const parent = data.find(
          (item) => item.slug?.toLowerCase() === type.toLowerCase()
        );

        setCategories(parent?.children || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, [type]);

  return (
    <section className="w-full overflow-hidden bg-clo-soft py-14 md:py-24">
      <div className="mx-auto mb-12 max-w-3xl px-6 text-center">
        <p className="clo-eyebrow mb-3 text-gray-500">
          {type === "women" ? "Women's Collection" : "Men's Collection"}
        </p>

        <h2 className="clo-section-title mb-6">
          Explore {type === "women" ? "Women's" : "Men's"} Fashion
        </h2>
      </div>

      <div className="hide-scrollbar flex gap-3 overflow-x-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              navigate(`/categories/${encodeURIComponent(cat.slug)}`)
            }
            className="group block w-[82vw] shrink-0 overflow-hidden rounded-lg sm:w-[42vw] md:w-[31vw] lg:w-[19vw]"
          >
            <img
              src={getCategoryImageUrl(cat.image)}
              alt={cat.name}
              className="h-[320px] w-full object-cover transition group-hover:scale-105"
            />

            <div className="bg-white py-4 text-center">
              <h3 className="font-semibold uppercase tracking-wider">
                {cat.name}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ShopNow;
