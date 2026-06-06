import img1 from "../../assets/trends1.jpg";
import img4 from "../../assets/image1-optimized.jpg";
import img5 from "../../assets/image2-optimized.jpg";
import img6 from "../../assets/image5-optimized.jpg";
import img7 from "../../assets/image6.jpg";

const ShopByTrends = () => {
  const banner = {
    title: "Loungewear",
    subtitle: "Breezy Fits For Brighter Days",
  };

  return (
    <section className="mt-10 w-full bg-clo-soft">
      {/* HEADING */}
      <div className="px-4 text-center">
        <h2 className="clo-section-title text-black">Shop by Trends</h2>
      </div>

      {/* TOP BANNER */}
      <div className="relative mt-6 h-[45vh] w-full overflow-hidden md:h-[70vh]">
        {/* IMAGE */}
        <img
          src={img1}
          alt="Loungewear"
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {/* CONTENT */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-2xl px-6 text-left text-white md:px-20">
            <h2 className="clo-display-title mb-4 text-white">
              {banner.title}
            </h2>

            <p className="clo-eyebrow mb-8 text-white">{banner.subtitle}</p>

            <button className="border-2 border-white px-6 py-3 text-sm uppercase tracking-widest transition duration-300 hover:bg-white hover:text-black md:px-8">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="mt-2 grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-2">
        {/* CARD 1 */}
        <div className="group relative h-[35vh] overflow-hidden md:h-[75vh]">
          <img
            src={img6}
            alt="Laidback Styles"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-2 text-center text-white">
            <h3 className="clo-section-title text-white">
              Laidback
              <br />
              Styles
            </h3>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="group relative h-[35vh] overflow-hidden md:h-[75vh]">
          <img
            src={img5}
            alt="Comfy Days"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-2 text-center text-white">
            <h3 className="clo-section-title text-white">
              Comfy
              <br />
              Days
            </h3>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="group relative h-[35vh] overflow-hidden md:h-[75vh]">
          <img
            src={img4}
            alt="Breezy Fits"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-2 text-center text-white">
            <h3 className="clo-section-title text-white">
              Breezy
              <br />
              Fits
            </h3>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="group relative h-[35vh] overflow-hidden md:h-[75vh]">
          <img
            src={img7}
            alt="Elevated Ease"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-2 text-center text-white">
            <h3 className="clo-section-title text-white">
              Elevated
              <br />
              Ease
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByTrends;
