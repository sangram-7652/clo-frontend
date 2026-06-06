import {
  FaShieldAlt,
  FaUndoAlt,
  FaTruck,
  FaLock,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden bg-[#f7f2eb] px-4 pb-8 pt-14 sm:px-6 md:px-12 md:pt-20 lg:px-20">
      {/* TOP FEATURES */}
      <div className="mb-16 rounded-md border border-[#d7c8b8] bg-white/40 px-6 py-8 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md group-hover:-translate-y-1 transition duration-300">
              <FaShieldAlt className="text-[#b18d43] text-xl" />
            </div>

            <span className="text-sm md:text-base text-gray-800 font-medium">
              Secure Shopping
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md group-hover:-translate-y-1 transition duration-300">
              <FaUndoAlt className="text-[#b18d43] text-xl" />
            </div>

            <span className="text-sm md:text-base text-gray-800 font-medium">
              Easy 7-Day Returns
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md group-hover:-translate-y-1 transition duration-300">
              <FaTruck className="text-[#b18d43] text-xl" />
            </div>

            <span className="text-sm md:text-base text-gray-800 font-medium">
              Free Shipping Rs. 999+
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md group-hover:-translate-y-1 transition duration-300">
              <FaLock className="text-[#b18d43] text-xl" />
            </div>

            <span className="text-sm md:text-base text-gray-800 font-medium">
              100% Secure Payments
            </span>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="mb-16 rounded-md border border-[#d7c8b8] bg-white/40 px-5 py-8 shadow-sm backdrop-blur-md md:mb-20 md:px-10 md:py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="clo-card-title text-gray-900 text-center lg:text-left">
              Join the CLO Community
            </h3>

            <p className="text-gray-700 mt-2 text-center lg:text-left">
              Get early access to new launches & exclusive offers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-5 outline-none transition focus:border-black sm:w-85 sm:max-w-full"
            />

            <button className="h-12 w-full rounded-md bg-black px-8 text-sm uppercase tracking-[2px] text-white transition hover:bg-[#222] sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER LINKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
        {/* ABOUT */}
        <div>
          <h3 className="clo-eyebrow mb-6">About CLO</h3>

          <p className="text-sm md:text-base text-gray-700 leading-7 mb-6">
            Premium fashion brand delivering modern Indian & global styles with
            elegance, comfort, and timeless aesthetics.
          </p>

          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:-translate-y-1 transition duration-300 shadow-sm">
              <FaInstagram size={18} />
            </div>

            <div className="w-11 h-11 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:-translate-y-1 transition duration-300 shadow-sm">
              <FaFacebookF size={18} />
            </div>
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="clo-eyebrow mb-6">Explore</h3>

          <ul className="space-y-4 text-sm md:text-base text-gray-800">
            <li>
              <a href="/" className="hover:text-black transition duration-300">
                Home
              </a>
            </li>

            <li>
              <a href="/" className="hover:text-black transition duration-300">
                New Launches
              </a>
            </li>

            <li>
              <a
                href="/about"
                className="hover:text-black transition duration-300">
                About Us
              </a>
            </li>

            <li>
              <a
                href="/contact"
                className="hover:text-black transition duration-300">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h3 className="clo-eyebrow mb-6">Customer Care</h3>

          <ul className="space-y-4 text-sm md:text-base text-gray-800">
            <li>
              <a
                href="/faqs"
                className="hover:text-black transition duration-300">
                FAQ
              </a>
            </li>

            <a href="/track-order">
              <li className="cursor-pointer hover:text-black transition duration-300">
                Track Order
              </li>
            </a>

            <li className="cursor-pointer hover:text-black transition duration-300">
              Returns / Exchange
            </li>

            <li>
              <a
                href="/terms-condition"
                className="hover:text-black transition duration-300">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* INFORMATION */}
        <div>
          <h3 className="clo-eyebrow mb-6">Information</h3>

          <ul className="space-y-4 text-sm md:text-base text-gray-800">
            <li className="cursor-pointer hover:text-black transition duration-300">
              Privacy Policy
            </li>

            <li className="cursor-pointer hover:text-black transition duration-300">
              Shipping Policy
            </li>

            <li className="cursor-pointer hover:text-black transition duration-300">
              Size Guide
            </li>

            <li className="cursor-pointer hover:text-black transition duration-300">
              Careers
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="clo-eyebrow mb-6">Contact</h3>

          <div className="space-y-5 text-sm md:text-base text-gray-800 leading-7">
            <p>+91 7042727387</p>
            <p>info@clo.co.in</p>
            <p>2nd Floor, XYZ Building, Delhi</p>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-400/50 pt-6 text-center text-sm md:text-base text-gray-700 tracking-wide">
        Copyright 2026 CLO Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
