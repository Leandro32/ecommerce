import React from 'react';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../services/googleSheetsService';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-48 bg-default-100 overflow-hidden">
        <ProductImage
          src={product.images}
          alt={product.name}
          className="w-full h-full"
          fallbackSrc="/placeholder-image.jpg"
          onError={() => {
            console.warn(`Failed to load image for product: ${product.name}`);
          }}
          loading="lazy"
        />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              Sale
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className={`px-2 py-1 rounded text-xs font-medium ${
            product.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
            {product.categories.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        <button
          className={`w-full py-2 px-4 rounded font-medium transition-colors duration-200 ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>

        {product.sku && (
          <p className="text-xs text-gray-400 mt-2">SKU: {product.sku}</p>
        )}
      </div>
    </div>
  );
};

const ProductList: React.FC = () => {
  const { products, loading, error, refetch } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600 mb-4">
            No products are currently available in the store.
          </p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="text-gray-600 mt-2">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={refetch}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center space-x-2"
          title="Refresh products"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
