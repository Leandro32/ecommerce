'use client';

import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="aspect-square w-full bg-default-200 rounded-lg animate-pulse"></div>
      <div className="mt-2 space-y-2">
        <div className="h-4 w-3/4 bg-default-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-default-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
