import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/reusable/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Eager imports (small, always needed) ─────────────────────────────────
import Home from "./pages/Home";

// ── Lazy imports (loaded only when route is visited) ─────────────────────
const About            = lazy(() => import("./pages/About"));
const ProductDetail    = lazy(() => import("./pages/ProductDetail"));
const Login            = lazy(() => import("./pages/Login"));
const UserProfile      = lazy(() => import("./pages/UserProfile"));
const Orders           = lazy(() => import("./pages/Orders"));
const OrderDetail      = lazy(() => import("./pages/OrderDetail"));
const Contact          = lazy(() => import("./pages/Contact"));
const Wishlist         = lazy(() => import("./pages/Wishlist"));
const Cart             = lazy(() => import("./pages/Cart"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const CheckoutPage     = lazy(() => import("./pages/Checkout"));
const Confirmation     = lazy(() => import("./pages/Confirmation"));
const FAQ              = lazy(() => import("./components/FAQ"));
const TermsConditions  = lazy(() => import("./components/TermsandConditions"));
const TrackOrder       = lazy(() => import("./components/TrackOrder"));
const TrendDetail = lazy(() => import("./pages/TrendDetail"));

// ── 404 ──────────────────────────────────────────────────────────────────
const NotFound = () => (
  <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f2eb] px-4 text-center text-[#3e3124]">
    <p className="clo-eyebrow mb-3 text-[#8f765b]">404</p>
    <h1 className="clo-card-title mb-3">Page Not Found</h1>
    <p className="mb-6 text-sm text-[#6f6256]">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <a
      href="/"
      className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#222]"
    >
      Back to Home
    </a>
  </section>
);

// ── Page loading fallback ─────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f2eb]">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3e3124] border-t-transparent" />
  </div>
);

// ── Shell layout ──────────────────────────────────────────────────────────
const PageFrame = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header />
      <main className={`min-h-screen ${!isHomePage ? "pt-28" : ""}`}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

// ── App ───────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageFrame />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="account/login" element={<Login />} />
          <Route path="categories/:slug" element={<CategoryProducts />} />
          <Route path="product-detail/:slug" element={<ProductDetail />} />
          <Route path="order-success" element={<Confirmation />} />
          <Route path="order-confirmed" element={<Confirmation />} />
          <Route path="faqs" element={<FAQ />} />
          <Route path="terms-condition" element={<TermsConditions />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="trends/:slug" element={<TrendDetail />} />

          {/* Protected routes — require auth token */}
          <Route
            path="account"
            element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
          />
          <Route
            path="account/orders"
            element={<ProtectedRoute><Orders /></ProtectedRoute>}
          />
          <Route
            path="account/orders/:orderId"
            element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}
          />
          <Route
            path="wishlist"
            element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
          />
          <Route
            path="cart"
            element={<ProtectedRoute><Cart /></ProtectedRoute>}
          />
          <Route
            path="checkout"
            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
          />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
