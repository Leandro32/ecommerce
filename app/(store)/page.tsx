import HomePageClient from "@/components/home-page-client";
import { Product } from "@/types/product";

// The new Next.js page is an async Server Component
export default async function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Fallback URL
  let heroData = null;
  let products: Product[] = [];

  try {
    const [heroResponse, productsResponse] = await Promise.all([
      fetch(`${API_URL}/api/v1/hero`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/v1/products`, { cache: 'no-store' })
    ]);

    if (heroResponse.ok) {
      heroData = await heroResponse.json();
    } else {
      console.error("Failed to fetch hero data:", heroResponse.status, heroResponse.statusText);
    }

    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      products = productsData.data;
    } else {
      console.error("Failed to fetch products:", productsResponse.status, productsResponse.statusText);
    }

  } catch (error) {
    console.error("Error fetching page data:", error);
  }

  return (
    <HomePageClient heroData={heroData} products={products.slice(0, 4)} />
  );
}