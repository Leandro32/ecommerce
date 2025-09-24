"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import HeroBanner from "./hero-banner";
import CategorySlider from "./category-slider";
import FeaturedProducts from "./featured-products";
import type { Product } from "../types/product";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HomePageClientProps {
  featuredProducts: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  categories: Category[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({
  featuredProducts,
  newArrivals,
  bestSellers,
  categories,
}) => {
  const { t } = useTranslation("products");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <HeroBanner />

      <CategorySlider categories={categories} />
      <FeaturedProducts
        title={t("sections.featuredProducts")}
        subtitle={t("sections.featuredSubtitle")}
        products={featuredProducts}
        viewAllHref="/products/featured"
      />
      <FeaturedProducts
        title={t("sections.newArrivals")}
        subtitle={t("sections.newArrivalsSubtitle")}
        products={newArrivals}
        viewAllHref="/products/new-arrivals"
      />
      <FeaturedProducts
        title={t("sections.bestSellers")}
        subtitle={t("sections.bestSellersSubtitle")}
        products={bestSellers}
        viewAllHref="/products/best-sellers"
      />
    </motion.div>
  );
};


export default HomePageClient;
