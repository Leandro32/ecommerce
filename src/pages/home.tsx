// Create the missing HomePage component
import React from "react";
import { motion } from "framer-motion";
import HeroBanner from "../components/hero-banner";
import CategorySlider from "../components/category-slider";
import FeaturedProducts from "../components/featured-products";

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
        title="New Arrivals"
        subtitle="Check out our latest products"
        type="new-arrivals"
      />
      <FeaturedProducts
        title="Best Sellers"
        subtitle="Our most popular products"
        type="best-sellers"
      />
    </motion.div>
  );
};

export default HomePage;
