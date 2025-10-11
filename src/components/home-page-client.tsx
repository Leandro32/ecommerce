"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import HeroBanner from "./hero-banner";
// import CategorySlider from "./category-slider"; // Removed
import FeaturedProducts from "./featured-products"; // Removed
import type { HeroData } from "@/types/hero";
import { Product } from "@/types/product";

interface HomePageClientProps {
  heroData: HeroData;
  products: Product[];

}

const HomePageClient: React.FC<HomePageClientProps> = ({ heroData, products }) => {
  const { t } = useTranslation("products");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <HeroBanner heroData={heroData} />

      <FeaturedProducts
        title={t("sections.featuredProducts")}
        subtitle={t("sections.featuredSubtitle")}
        products={products}
        viewAllHref="/products"
      />
    </motion.div>
  );
};


export default HomePageClient;