import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag, User, X, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Topbar from "./Topbar";
import NavbarSearch from "./NavbarSearch";
import MegaMenu from "./MegaMenu";

import logo from "../assets/nobgLOGO.png";

import { getCategories } from "../api/category/categories";

const staticNavbarLinks = [
  { id: "just-in", title: "JUST IN", slug: "just-in", path: "/just-in" },
  { id: "sale", title: "SALE", slug: "sale", path: "/sale" },
];

const createNavbarMenuFromCategories = (apiCategories) => {
  const categoryMenus = apiCategories
    .filter((category) => category?.slug)
    .map((category) => ({
      id: category.id,
      title: category.name,
      slug: category.slug,
      path: `/categories/${category.slug}`,
      sections: (category.children || []).map((section) => ({
        id: section.id,
        title: section.name,
        items: section.children?.length
          ? section.children
          : [
              {
                id: section.id,
                name: section.name,
                slug: section.slug,
              },
            ],
      })),
    }));

  return [...categoryMenus, ...staticNavbarLinks];
};

const menuItems = [
  { title: "Home", path: "/" },
  { title: "About Us", path: "/about" },
  { title: "Contact Us", path: "/contact" },
  { title: "FAQs", path: "/faqs" },
  { title: "Track Your Order", path: "/track-order" },
  { title: "Terms & Conditions", path: "/terms-condition" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  // Desktop Mega Menu
  const [activeMenu, setActiveMenu] = useState(null);

  const navigate = useNavigate();
  const desktopNavbarMenu = useMemo(
    () => createNavbarMenuFromCategories(categories),
    [categories],
  );

  const accountHref = localStorage.getItem("token")
    ? "/account"
    : "/account/login";

  // Cart
  const handleCartClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/cart");
    } else {
      navigate("/account/login");
    }
  };

  // Navbar scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 10;

      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled,
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      {/* ================= TOPBAR ================= */}

      <Topbar hidden={isScrolled} />

      {/* ================= NAVBAR ================= */}

      <header
        onMouseLeave={() => setActiveMenu(null)}
        className={`fixed left-0 z-40 w-full bg-white text-black shadow-sm transition-all duration-300 ${
          isScrolled ? "top-0" : "top-10"
        }`}>
        {/* Main Navbar */}

        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* ================= LEFT SIDE ================= */}

            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5 md:gap-6">
              {/* Desktop Navigation */}

              <nav className="hidden items-center gap-6 lg:flex">
                {desktopNavbarMenu.map((menu) => (
                  <div
                    key={menu.id}
                    onMouseEnter={() => setActiveMenu(menu.slug)}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(menu.slug)}
                      onFocus={() => setActiveMenu(menu.slug)}
                      className={`block cursor-pointer border-b-2 bg-transparent py-6 text-sm uppercase tracking-wider transition-colors ${
                        activeMenu === menu.slug
                          ? "border-black"
                          : "border-transparent"
                      }`}>
                      {menu.title}
                    </button>
                  </div>
                ))}
              </nav>

              {/* Search */}

              <NavbarSearch />
            </div>

            {/* ================= LOGO ================= */}

            <Link
              to="/"
              className="flex shrink-0 items-center justify-center px-2">
              <img
                src={logo}
                alt="CLO Logo"
                className="h-20 w-auto object-contain sm:h-24 md:h-30 lg:h-32"
              />
            </Link>

            {/* ================= RIGHT SIDE ================= */}

            <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4 md:gap-6">
              <Link
                to="/contact"
                className="hidden text-sm uppercase tracking-wider lg:block">
                Contact Us
              </Link>

              {/* Account */}

              <Link
                to={accountHref}
                aria-label="Account"
                className="flex items-center justify-center">
                <User size={22} />
              </Link>

              {/* Wishlist */}

              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="flex items-center justify-center">
                <Heart size={22} />
              </Link>

              {/* Cart */}

              <button
                onClick={handleCartClick}
                aria-label="Cart"
                className="flex items-center justify-center">
                <ShoppingBag size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP MEGA MENU ================= */}

        {desktopNavbarMenu.map(
          (menu) =>
            activeMenu === menu.slug &&
            menu.sections?.length > 0 && (
              <MegaMenu
                key={menu.id}
                menu={menu}
                onClose={() => setActiveMenu(null)}
              />
            ),
        )}
      </header>

      {/* ================= MOBILE OVERLAY ================= */}

      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isMenuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* ================= SIDE CANVAS MENU ================= */}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[min(320px,86vw)] bg-[#f8f4ef] shadow-2xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Side Menu Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="clo-card-title">CLO</h2>

          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="rounded-full p-1 transition hover:bg-black/5">
            <X size={24} />
          </button>
        </div>

        {/* Side Menu Content */}

        <div className="hide-scrollbar flex h-[calc(100%-80px)] flex-col justify-between overflow-y-auto">
          <div className="px-6 py-5">
            <ul className="space-y-1">
              {/* Shop By Categories */}

              <li>
                <button
                  onClick={() => setShowCategories((current) => !current)}
                  className="flex w-full items-center justify-between border-b border-gray-200 py-4 text-[15px] uppercase tracking-wide">
                  <span>Shop By Categories</span>

                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-300 ${
                      showCategories ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Category Dropdown */}

                {showCategories && (
                  <ul className="ml-4 border-l border-gray-200">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to={`/categories/${category.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-3 pl-4 text-sm uppercase transition hover:text-gray-500">
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* Static Menu Items */}

              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-gray-200 py-4 text-[15px] uppercase tracking-wide">
                    <span>{item.title}</span>

                    <ChevronRight
                      size={18}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Side Menu Footer */}

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

export default Navbar;
