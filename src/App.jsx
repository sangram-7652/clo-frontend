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
import Home from "./pages/Home";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import CategoryProducts from "./pages/CategoryProducts";
import ScrollToTop from "./components/reusable/ScrollToTop";
import CheckoutPage from "./pages/Checkout";
import PaymentPage from "./pages/PaymentPage";
import Confirmation from "./pages/Confirmation";
import FAQ from "./components/FAQ";
import TermsandConditions from "./components/TermsandConditions";
import TrackOrder from "./components/TrackOrder";
import ProtectedRoute from "./components/ProtectedRoute";

const PageFrame = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header />
      <main className={`min-h-screen ${!isHomePage ? "pt-28" : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageFrame />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route path="contact" element={<Contact />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="account/login" element={<Login />} />
          <Route path="categories/:slug" element={<CategoryProducts />} />
          <Route path="product-detail/:slug" element={<ProductDetail />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="order-success" element={<Confirmation />} />
          <Route path="order-confirmed" element={<Confirmation />} />
          <Route path="faqs" element={<FAQ />} />
          <Route path="terms-condition" element={<TermsandConditions />} />
          <Route path="track-order" element={<TrackOrder />} />

          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
