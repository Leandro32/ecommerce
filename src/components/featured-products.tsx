'use client';

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import ProductGrid from "./product-grid";
import type { Product } from "../types/product";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  viewAllHref,
}) => {
  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-default-500 text-sm">{subtitle}</p>}
        </div>

        {viewAllHref && (
          <Button
            as={Link}
            href={viewAllHref}
            variant="light"
            color="primary"
            size="sm"
            endContent={<Icon icon="lucide:arrow-right" className="text-sm" />}
            className="mt-2 sm:mt-0"
          >
            View All
          </Button>
        )}
      </div>

      <ProductGrid products={products} isLoading={false} />
    </section>
  );
};

export default FeaturedProducts;
