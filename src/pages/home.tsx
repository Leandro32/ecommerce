// Create the missing HomePage component
import React from "react";
import { motion } from "framer-motion";
import HeroBanner from "../components/hero-banner";
import CategorySlider from "../components/category-slider";
import FeaturedProducts from "../components/featured-products";
import DevStatus from "../components/DevStatus";

const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <HeroBanner />

      <CategorySlider />
      <FeaturedProducts
        title="Featured Products"
        subtitle="Our handpicked favorites"
        type="featured"
        limit={8}
      />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Check out our latest products"
        type="new-arrivals"
        limit={8}
      />
      <FeaturedProducts
        title="Best Sellers"
        subtitle="Our most popular products"
        type="best-sellers"
        limit={8}
      />

      <DevStatus />
    </motion.div>
  );
};

export default HomePage;
