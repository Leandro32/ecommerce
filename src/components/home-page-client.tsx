"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import HeroBanner from "./hero-banner";
// import CategorySlider from "./category-slider"; // Removed
// import FeaturedProducts from "./featured-products"; // Removed
// import type { Product } from "../types/product"; // Removed as not directly used here anymore

interface HomePageClientProps {
  // featuredProducts: Product[]; // Removed
  // newArrivals: Product[]; // Removed
  // bestSellers: Product[]; // Removed
  // categories: Category[]; // Removed
}

const HomePageClient: React.FC<HomePageClientProps> = ({}) => {
  const { t } = useTranslation("products");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <HeroBanner />

      {/* CategorySlider and FeaturedProducts removed temporarily due to simplified Product model */}
      {/* <CategorySlider categories={categories} /> */}
      {/* <FeaturedProducts
        title={t("sections.featuredProducts")}
        subtitle={t("sections.featuredSubtitle")}
        products={featuredProducts}
        viewAllHref="/products/featured"
      /> */}
      {/* <FeaturedProducts
        title={t("sections.newArrivals")}
        subtitle={t("sections.newArrivalsSubtitle")}
        products={newArrivals}
        viewAllHref="/products/new-arrivals"
      /> */}
      {/* <FeaturedProducts
        title={t("sections.bestSellers")}
        subtitle={t("sections.bestSellersSubtitle")}
        products={bestSellers}
        viewAllHref="/products/best-sellers"
      /> */}
    </motion.div>
  );
};


export default HomePageClient;