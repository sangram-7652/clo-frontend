import { useEffect, useState } from "react";

const banners = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* HERO SLIDER */}
      <section className="relative mt-28 h-[50vh] w-full overflow-hidden sm:h-[65vh] md:h-[75vh] lg:h-[85vh] xl:h-[calc(100vh-7rem)]">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 overflow-hidden transition-all duration-1000 ${
              currentSlide === index
                ? "z-10 opacity-100 scale-100"
                : "z-0 opacity-0 scale-100"
            } bg-cover bg-center`}
            style={{ backgroundImage: `url(${banner.image})` }}>
            {/* CONTENT */}
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
              <div className="px-4 text-center text-white sm:px-6 md:px-8">
                <h2 className="clo-display-title mb-2 text-white md:mb-4 lg:mb-6">
                  {banner.title}
                </h2>
                <p className="clo-eyebrow mb-4 text-white md:mb-6 lg:mb-8">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default HeroSection;
