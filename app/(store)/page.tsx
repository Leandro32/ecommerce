import HomePageClient from "../../src/components/home-page-client";

// The new Next.js page is an async Server Component
export default async function HomePage() {
  // Data fetching and processing logic for products, new arrivals, best sellers, and categories
  // has been removed due to simplified Product model.
  // The HomePageClient will render a basic layout for now.

  return (
    <HomePageClient />
  );
}