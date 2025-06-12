// Create the missing NotFoundPage component
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-8xl font-bold text-primary mb-4">404</div>
      <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-default-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          as={Link}
          to="/"
          color="primary"
          size="lg"
          startContent={<Icon icon="lucide:home" />}
        >
          Go to Homepage
        </Button>
        <Button 
          as={Link}
          to="/products"
          variant="flat"
          size="lg"
        >
          Browse Products
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;