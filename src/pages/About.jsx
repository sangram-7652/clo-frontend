import AboutUsImg from "../assets/Aboutus.png";

const About = () => {
  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#3e3124]">
      {/* Hero Section */}
      <section className="px-4 py-10 sm:px-6 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <img
            src={AboutUsImg}
            alt=""
            className="mx-auto h-auto w-full max-w-4xl"
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="max-w-6xl mx-auto  items-center">
          <div>
            <h2 className="clo-section-title mb-6">
              Our Story & Philosophy
            </h2>
            <p className="mb-4 leading-7 text-[#6f6256]">
              Founded with a vision to make online shopping simple, stylish, and
              accessible, CLO has grown into a trusted e-commerce platform
              serving thousands of happy customers. Our journey began with a
              simple idea-to create a shopping experience where quality,
              affordability, and customer satisfaction come together seamlessly.
              At CLO, we carefully curate every collection to ensure the perfect
              balance of modern style, premium quality, and everyday comfort.
              From trending essentials to timeless fashion pieces, every product
              is selected with our customers in mind. Your satisfaction remains
              at the heart of everything we do, inspiring us to continuously
              improve and innovate.
              <br />
              We believe in stories over seasons, personal style over trends,
              and comfort over appearance. Every collection is thoughtfully
              designed to combine modern style with everyday comfort, helping
              people express themselves with confidence.
            </p>

            <button className="mt-4 rounded-md bg-black px-6 py-3 text-sm uppercase tracking-[2px] text-white transition hover:bg-[#222]">
              Explore Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
