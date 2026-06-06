import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, User, X, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import NavbarSearch from "./NavbarSearch";
import logo from "../assets/nobgLOGO.png";
const menuItems = [
  "Sale",
  "Spring Summer 2026",
  "Shop By Categories",
  "Special Offer",
  "What's New",
  "CLO Collection",
  "Store Locator",
  "Track Your Order",
  "Raise Return",
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountHref = localStorage.getItem("token")
    ? "/account"
    : "/account/login";

  const navigate = useNavigate();

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/account/login");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 10;
      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled,
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Topbar */}
      <Topbar hidden={isScrolled} />

      {/* Header */}
      <header
        className={`fixed left-0 z-40 w-full bg-white text-black shadow-sm transition-all duration-300 ${
          isScrolled ? "top-0" : "top-10"
        }`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Left Side */}
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5 md:gap-6">
              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer">
                <Menu size={22} />
                <span className="hidden md:block">Menu</span>
              </button>

              {/* Search */}
              <NavbarSearch />
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="flex shrink-0 items-center justify-center px-2">
              <img
                src={logo}
                alt="Logo"
                className="h-14 w-auto object-contain sm:h-16 md:h-20 lg:h-22"
              />
            </Link>

            {/* Right Side */}
            <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4 md:gap-6">
              <Link
                to="/contact"
                className="hidden text-sm uppercase tracking-wider lg:block">
                Contact Us
              </Link>

              <Link
                to={accountHref}
                aria-label="Account"
                className="flex items-center justify-center">
                <User size={22} />
              </Link>

              <Link to="/wishlist">
                <Heart size={22} />
              </Link>

              <div>
                <button onClick={handleCartClick} aria-label="Cart" className="flex items-center">
                  <ShoppingBag size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* Side Canvas Menu */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[min(320px,86vw)] bg-[#f8f4ef] shadow-2xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Top */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="clo-card-title">CLO</h2>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-full p-1 transition hover:bg-black/5">
            <X size={24} />
          </button>
        </div>

        {/* Menu List */}
        <div className="hide-scrollbar flex h-[calc(100%-80px)] flex-col justify-between overflow-y-auto">
          <div className="px-6 py-5">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-gray-200 py-4 text-[15px] uppercase tracking-wide">
                    <span>{item}</span>

                    <ChevronRight
                      size={18}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 px-6 py-5">
            <p className="text-sm text-gray-500">
              &copy; 2026 CLO Fashion House
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
