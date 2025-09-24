"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

interface CategorySliderProps {
  categories: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
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
              <Link href={`/products?category=${category.slug}`}>
                <Card
                  className="w-[140px] h-[180px] sm:w-[160px] sm:h-[200px]"
                  isPressable
                  disableRipple
                >
                  <CardBody className="p-0 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={160}
                      height={140}
                      className="w-full h-[70%] object-cover"
                    />
                    <div className="p-3 flex items-center justify-center h-[30%]">
                      <h3 className="font-medium text-center">
                        {category.name}
                      </h3>
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
