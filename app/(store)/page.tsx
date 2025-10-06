import HomePageClient from "../../src/components/home-page-client";

// The new Next.js page is an async Server Component
export default async function HomePage() {
  // Data fetching and processing logic for products, new arrivals, best sellers, and categories
  // has been removed due to simplified Product model.
  // The HomePageClient will render a basic layout for now.

  const heroData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/hero`, { cache: 'no-store' }).then(res => res.json());

  return (
    <HomePageClient heroData={heroData} />
  );
}