import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative rounded-lg overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 z-10" />
      
      <img 
        src="https://img.heroui.chat/image/fashion?w=1200&h=600&u=1" 
        alt="New Collection"
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 max-w-md">
            Summer Collection 2025
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md">
            Discover our latest arrivals designed for the modern lifestyle. Sustainable materials meet innovative design.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              as={Link}
              to="/products/new-arrivals"
              color="primary"
              size="lg"
              className="font-medium"
            >
              Shop Now
            </Button>
            <Button 
              as={Link}
              to="/products"
              variant="flat"
              color="default"
              size="lg"
              className="bg-white/20 text-white font-medium"
            >
              View All
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;