import ProductListPageClient from '../../../src/components/product-list-page-client';
import {
  getPriceRange,
  getDisplayPrice,
  sortProducts,
} from '../../../src/utils/productUtils';
import { Product } from '../../../src/types/product';

async function getProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:3000/api/v1/products', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  const json = await res.json();
  return json;
}

// The new Next.js page is an async Server Component
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { price_min, price_max, sort, page, search } = searchParams;

  // 1. Fetch all products once
  const allProducts = await getProducts();

  // 2. Calculate filter options from the complete dataset
  const priceRange = getPriceRange(allProducts);

  // 3. Apply filters based on searchParams
  let filteredProducts = [...allProducts];

  const priceMin = Number(price_min || priceRange.min);
  const priceMax = Number(price_max || priceRange.max);
  const currentSort = typeof sort === 'string' ? sort : 'newest';
  const currentPage = Number(page || '1');
  const currentSearch = typeof search === 'string' ? search : undefined;
  const productsPerPage = 12;

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  filteredProducts = filteredProducts.filter(p => {
    const price = getDisplayPrice(p);
    return price >= priceMin && price <= priceMax;
  });

  // 4. Apply sorting
  const sortedProducts = sortProducts(filteredProducts, sort);

  // 5. Apply pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // 6. Render the client component with the prepared data
  return (
    <ProductListPageClient
      products={paginatedProducts}
      totalProducts={totalProducts}
      totalPages={totalPages}
      availableCategories={[]} // Categories are no longer part of the product model
      availableBrands={[]} // Brands are no longer part of the product model
      priceRange={priceRange}
    />
  );
}