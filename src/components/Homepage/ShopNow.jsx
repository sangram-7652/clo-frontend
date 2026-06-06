import { useNavigate } from "react-router-dom";

// Women Images
import women1 from "../../assets/image1-optimized.jpg";
import women2 from "../../assets/image2-optimized.jpg";
import women3 from "../../assets/saree.jpg";
import women4 from "../../assets/Allsaree.jpg";
import women5 from "../../assets/anarkalidress.jpg";

// Men Images
import men1 from "../../assets/men1-optimized.webp";
import men2 from "../../assets/men2-optimized.webp";
import men3 from "../../assets/men3-optimized.webp";

const sectionData = {
  women: {
    title: "Elegance In Every Drape",
    subtitle: "Women's Collection",
    description:
      "Step into timeless beauty with our curated women's collection featuring luxurious sarees, graceful silhouettes, and handcrafted elegance for every celebration.",
    buttonText: "Explore Women's Fashion",
    images: [
      { image: women1, alt: "Wine Banarasi saree" },
      { image: women2, alt: "Red silk saree" },
      { image: women3, alt: "Royal gold saree" },
      { image: women4, alt: "Royal new saree" },
      { image: women5, alt: "Royal neww saree" },
    ],
  },

  men: {
    title: "Modern Style Redefined",
    subtitle: "Men's Collection",
    description:
      "Discover premium menswear crafted for confidence and sophistication - from sharp formal fits to effortless casual essentials designed for the modern man.",
    buttonText: "Explore Men's Fashion",
    images: [
      { image: men1, alt: "Classic black suit" },
      { image: men2, alt: "Casual white shirt" },
      { image: men3, alt: "Royal blue blazer" },
    ],
  },
};

const ShopNow = ({ type = "women" }) => {
  const navigate = useNavigate();
  const currentSection = sectionData[type] ?? sectionData.women;

  return (
    <section className="w-full overflow-hidden bg-clo-soft py-14 md:py-24">
      {/* Heading */}
      <div className="mx-auto mb-12 max-w-3xl px-6 text-center md:mb-16">
        <p className="clo-eyebrow mb-3 text-gray-500">
          {currentSection.subtitle}
        </p>
        <h2 className="clo-section-title mb-6">{currentSection.title}</h2>

        <p className="clo-body text-gray-600">{currentSection.description}</p>
        <button
          type="button"
          onClick={() => navigate("/all-categories")}
          className="mt-8 border border-black px-8 py-3 uppercase tracking-[3px] transition duration-300 hover:bg-black hover:text-white">
          {currentSection.buttonText}
        </button>
      </div>

      <div
        aria-label={`${currentSection.subtitle} product rail`}
        className="hide-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-10">
        {currentSection.images.map((item, index) => (
          <button
            key={`${item.alt}-${index}`}
            type="button"
            onClick={() => navigate("/all-categories")}
            className="group block w-[82vw] shrink-0 snap-start overflow-hidden rounded-lg text-left sm:w-[42vw] md:w-[31vw] lg:w-[19vw]">
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              className="h-[18.75rem] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:h-[25rem] md:h-[31.25rem]"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default ShopNow;
