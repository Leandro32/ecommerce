// Create the missing HomePage component
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import HeroBanner from "../components/hero-banner";
import CategorySlider from "../components/category-slider";
import FeaturedProducts from "../components/featured-products";
import DevStatus from "../components/DevStatus";

const HomePage: React.FC = () => {
  const { t } = useTranslation('products');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <HeroBanner />

      <CategorySlider />
      <FeaturedProducts
        title={t('sections.featuredProducts')}
        subtitle={t('sections.featuredSubtitle')}
        type="featured"
        limit={8}
      />
      <FeaturedProducts
        title={t('sections.newArrivals')}
        subtitle={t('sections.newArrivalsSubtitle')}
        type="new-arrivals"
        limit={8}
      />
      <FeaturedProducts
        title={t('sections.bestSellers')}
        subtitle={t('sections.bestSellersSubtitle')}
        type="best-sellers"
        limit={8}
      />

      <DevStatus />
    </motion.div>
  );
};

export default HomePage;
