import ProductListPageClient from '../../../src/components/product-list-page-client';
import {
  getPriceRange,
  getDisplayPrice,
  sortProducts,
} from '../../../src/utils/productUtils';
import { Product } from '../../../src/types/product';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/products?include=fragranceNotes,reviews`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  const json = await res.json();
  return json.data;
}

// The new Next.js page is an async Server Component
export default async function ProductsPage(props: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { searchParams } = props;
  const { price_min, price_max, sort, page, search } = searchParams;

  // 1. Fetch all products once
  const allProducts = await getProducts();

  // 2. Calculate filter options from the complete dataset
  const priceRange = getPriceRange(allProducts);
  const availableBrands = [...new Set(allProducts.map(p => p.brand))];
  const availableBottleSizes = [...new Set(allProducts.map(p => p.bottleSize.toString()))].sort((a, b) => Number(a) - Number(b));

  // 3. Apply filters based on searchParams
  let filteredProducts = [...allProducts];

  const priceMin = Number(price_min || priceRange.min);
  const priceMax = Number(price_max || priceRange.max);
  const currentSort = typeof sort === 'string' ? sort : 'newest';
  const currentPage = Number(page || '1');
  const currentSearch = typeof search === 'string' ? search : undefined;
  const productsPerPage = 12;
  const selectedSexes = typeof searchParams.sex === 'string' ? [searchParams.sex] : Array.isArray(searchParams.sex) ? searchParams.sex : [];
  const selectedBrands = typeof searchParams.brand === 'string' ? [searchParams.brand] : Array.isArray(searchParams.brand) ? searchParams.brand : [];
  const selectedBottleSizes = typeof searchParams.bottleSize === 'string' ? [searchParams.bottleSize] : Array.isArray(searchParams.bottleSize) ? searchParams.bottleSize : [];

  if (currentSearch) {
    const searchTerm = currentSearch.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedSexes.length > 0) {
    filteredProducts = filteredProducts.filter(p => selectedSexes.includes(p.sex));
  }

  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(p => selectedBrands.includes(p.brand));
  }

  if (selectedBottleSizes.length > 0) {
    filteredProducts = filteredProducts.filter(p => selectedBottleSizes.includes(p.bottleSize.toString()));
  }

  filteredProducts = filteredProducts.filter(p => {
    const price = getDisplayPrice(p);
    return price >= priceMin && price <= priceMax;
  });

  // 4. Apply sorting
  const sortedProducts = sortProducts(filteredProducts, currentSort);

  // 5. Apply pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // 6. Render the client component with the prepared data
  return (
    <ProductListPageClient
      products={paginatedProducts}
      totalProducts={totalProducts}
      totalPages={totalPages}
      productsPerPage={productsPerPage}
      availableBrands={availableBrands}
      availableBottleSizes={availableBottleSizes}
      priceRange={priceRange}
    />
  );
}