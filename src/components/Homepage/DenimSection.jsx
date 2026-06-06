import img from "../../assets/banner1.webp";
const DenimSection = () => {
  return (
    <>
      <section className="flex min-h-screen w-full items-center justify-center bg-clo-soft px-6 py-10 md:px-16">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <p className="clo-eyebrow text-gray-500">Discover Clo Denim</p>

            <h2 className="clo-section-title text-black max-w-xl">
              Denim That Defines Your Style
            </h2>

            <p className="text-gray-600 text-xl max-w-lg leading-relaxed">
              Everyday comfort. Effortless style. Crafted for modern looks.
            </p>

            <button className="bg-black text-white px-10 py-4 rounded-full text-lg font-semibold hover:scale-105 transition duration-300">
              Shop Denim
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-163 overflow-hidden rounded-[28px] shadow-lg">
              <img
                src={img}
                alt="Denim Fashion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DenimSection;
