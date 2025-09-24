import HomePageClient from '../src/components/home-page-client';
// Removed imports from lib/googleSheetsService
import {
  transformGoogleSheetsProducts,
  getAvailableCategories,
  getAvailableBrands,
  getPriceRange,
  getDisplayPrice,
  sortProducts,
} from '../src/utils/productUtils';
import {
  MOCK_PRODUCTS,
  getMockFeaturedProducts,
} from '../src/data/mockProducts'; // Import mock data functions

// The new Next.js page is an async Server Component
export default async function HomePage() {
  // Fetch all necessary data in parallel for performance
  // Replaced getProducts() and getFeaturedProducts() with mock data
  const allProductsData = MOCK_PRODUCTS;
  const featuredProductsData = getMockFeaturedProducts();

  // The data transformation logic that was in the component now lives on the server
  const allProducts = transformGoogleSheetsProducts(allProductsData);
  const featuredProducts = transformGoogleSheetsProducts(featuredProductsData);

  // Recreate the logic for "New Arrivals" and "Best Sellers" on the server
  const newArrivals = allProducts
    .filter((p) => p.isNew || p.featured)
    .slice(0, 8);
    
  const bestSellers = [...allProducts] // Create a new array to avoid mutating the original
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  // Fetch categories for CategorySlider
  const categoryNames = getAvailableCategories(allProducts);
  const categories = categoryNames.map(name => ({
    id: name,
    name: name,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  }));

  // Pass the server-fetched data to the client component for rendering
  return (
    <HomePageClient
      featuredProducts={featuredProducts.slice(0, 8)}
      newArrivals={newArrivals}
      bestSellers={bestSellers}
      categories={categories} // Pass categories
    />
  );
}