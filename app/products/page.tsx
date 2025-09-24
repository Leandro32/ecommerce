import ProductListPageClient from '../../src/components/product-list-page-client';
import { 
  transformGoogleSheetsProducts,
  getAvailableCategories,
  getAvailableBrands,
  getPriceRange,
  getDisplayPrice,
  sortProducts,
} from '../../src/utils/productUtils';
import { MOCK_PRODUCTS } from '../../src/data/mockProducts'; // Import mock data

// The new Next.js page is an async Server Component
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 1. Fetch and transform all products once
  const allProductsData = MOCK_PRODUCTS; // Replaced getProducts() with MOCK_PRODUCTS
  const allProducts = transformGoogleSheetsProducts(allProductsData);

  // 2. Calculate filter options from the complete dataset
  const availableCategories = getAvailableCategories(allProducts);
  const availableBrands = getAvailableBrands(allProducts);
  const priceRange = getPriceRange(allProducts);

  // 3. Apply filters based on searchParams
  let filteredProducts = [...allProducts];

  const categories = typeof searchParams.category === 'string' ? [searchParams.category] : searchParams.category;
  const brands = typeof searchParams.brand === 'string' ? [searchParams.brand] : searchParams.brand;
  const ratings = typeof searchParams.rating === 'string' ? [searchParams.rating] : searchParams.rating;
  const priceMin = Number(searchParams.price_min || priceRange.min);
  const priceMax = Number(searchParams.price_max || priceRange.max);
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  const page = Number(searchParams.page || '1');
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const productsPerPage = 12;

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  if (categories && categories.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.categories.some(cat => categories.includes(cat))
    );
  }

  if (brands && brands.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.brand && brands.includes(p.brand)
    );
  }
  
  if (ratings && ratings.length > 0) {
    const numRatings = ratings.map(r => Number(r));
    filteredProducts = filteredProducts.filter(p => 
      p.rating && numRatings.includes(Math.floor(p.rating))
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
      availableCategories={availableCategories}
      availableBrands={availableBrands}
      priceRange={priceRange}
    />
  );
}
