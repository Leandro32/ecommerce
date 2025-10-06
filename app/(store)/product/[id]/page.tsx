import ProductDetailPageClient from '../../../../src/components/product-detail-page-client';
import { transformApiProduct, transformApiProducts } from '../../../../src/utils/productUtils';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/products/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }
  const json = await res.json();
  return json.data;
}

async function getRelatedProducts() {
  const res = await fetch('http://localhost:3000/api/v1/products', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch related products');
  }
  const json = await res.json();
  return json.data;
}

// The new Next.js page is an async Server Component
export default async function ProductDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // Fetch the main product and related products in parallel
  const [productData, relatedProductsData] = await Promise.all([
    getProduct(id),
    getRelatedProducts(),
  ]);

  // If no product is found, render the 404 page
  if (!productData) {
    notFound();
  }

  // Transform the data for the components
  const product = transformApiProduct(productData);
  const relatedProducts = transformApiProducts(relatedProductsData)
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
