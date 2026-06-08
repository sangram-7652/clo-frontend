import BestSellerProducts from "../components/Homepage/BestSellerProducts";
import CategorySection from "../components/Homepage/CategorySection";
// import CollectionsSection from "../components/Homepage/CollectionsSection";
import CustomerReview from "../components/Homepage/CustomerReview";
import DenimSection from "../components/Homepage/DenimSection";
import HeroSection from "../components/Homepage/HeroSection";
import NewLaunches from "../components/Homepage/NewLaunches";
import ShopByTrends from "../components/Homepage/ShopByTrends";
import ShopNow from "../components/Homepage/ShopNow";
import WeddingProducts from "../components/Homepage/WeddingProducts";
import WatchVideos from "../components/Homepage/WatchVideos";

const Home = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <NewLaunches />
      <WatchVideos />
      <BestSellerProducts />
      <WeddingProducts />
      <ShopByTrends />
      {/* <CollectionsSection /> */}
      <ShopNow type="women" />
      <ShopNow type="men" />
      <DenimSection />
      <CustomerReview />
    </>
  );
};

export default Home;
