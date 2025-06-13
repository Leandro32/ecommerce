import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavigation from "../components/mobile-navigation";
import NotificationToast from "../components/notifications";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex-grow pt-16 pb-20 md:pb-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </div>
      </motion.main>
      <Footer />
      <MobileNavigation />
      <NotificationToast />
    </div>
  );
};

export default MainLayout;
