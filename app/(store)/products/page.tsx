import ProductListPageClient from '../../../src/components/product-list-page-client';

// The new Next.js page is now a simple Server Component that renders the client component.
export default function ProductsPage() {
  return <ProductListPageClient />;
}
