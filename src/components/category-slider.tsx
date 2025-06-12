import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/use-categories';

const CategorySlider: React.FC = () => {
  const { categories } = useCategories();
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>
      <div className="overflow-x-auto hide-scrollbar pb-4">
        <div className="flex gap-4 min-w-max">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/products/${category.slug}`}>
                <Card 
                  className="w-[140px] h-[180px] sm:w-[160px] sm:h-[200px]"
                  isPressable
                  disableRipple
                >
                  <CardBody className="p-0 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-[70%] object-cover"
                    />
                    <div className="p-3 flex items-center justify-center h-[30%]">
                      <h3 className="font-medium text-center">{category.name}</h3>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;