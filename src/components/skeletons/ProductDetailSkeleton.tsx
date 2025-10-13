'use client';

import React from 'react';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="py-6 md:py-10 animate-pulse">
      <div className="h-6 w-2/5 bg-default-300 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <div>
          <div className="w-full aspect-square bg-default-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-5 gap-2">
            <div className="w-full aspect-square bg-default-200 rounded-md"></div>
            <div className="w-full aspect-square bg-default-200 rounded-md"></div>
            <div className="w-full aspect-square bg-default-200 rounded-md"></div>
            <div className="w-full aspect-square bg-default-200 rounded-md"></div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-1/4 bg-default-300 rounded"></div>
          <div className="h-10 w-4/5 bg-default-300 rounded"></div>
          <div className="h-6 w-1/3 bg-default-300 rounded"></div>
          <div className="h-10 w-1/2 bg-default-200 rounded"></div>
          <div className="h-8 w-1/4 bg-default-200 rounded"></div>
          <div className="h-px w-full bg-default-200 my-6"></div>
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-default-200 rounded-lg"></div>
            <div className="h-12 flex-grow bg-default-300 rounded-lg"></div>
          </div>
          <div className="h-px w-full bg-default-200 my-6"></div>
          <div className="space-y-4">
            <div className="h-12 w-full bg-default-200 rounded-lg"></div>
            <div className="h-12 w-full bg-default-200 rounded-lg"></div>
            <div className="h-12 w-full bg-default-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
