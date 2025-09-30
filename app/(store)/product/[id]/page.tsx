import ProductDetailPageClient from '../../../../src/components/product-detail-page-client';
// Removed imports from lib/googleSheetsService
import { transformGoogleSheetsProduct, transformGoogleSheetsProducts } from '../../../../src/utils/productUtils';
import { notFound } from 'next/navigation';
import {
  getMockProductById,
  getMockFeaturedProducts,
} from '../../../../src/data/mockProducts'; // Import mock data functions

// The new Next.js page is an async Server Component
export default async function ProductDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // Fetch the main product and related products in parallel
  const productData = getMockProductById(id); // Replaced getProduct
  const relatedProductsData = getMockFeaturedProducts(); // Replaced getFeaturedProducts

  // If no product is found, render the 404 page
  if (!productData) {
    notFound();
  }

  // Transform the data for the components
  const product = transformGoogleSheetsProduct(productData);
  const relatedProducts = transformGoogleSheetsProducts(relatedProductsData)
    .filter(p => p.id !== product.id) // Exclude the main product from related
    .slice(0, 4); // Limit to 4 related products

  // Pass the server-fetched data to the client component for rendering
  return (
    <ProductDetailPageClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
