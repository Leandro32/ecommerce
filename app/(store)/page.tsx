import HomePageClient from "../../src/components/home-page-client";

// The new Next.js page is an async Server Component
export default async function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Fallback URL
  let heroData = null;

  try {
    const response = await fetch(`${API_URL}/api/v1/hero`, { cache: 'no-store' });
    if (response.ok) {
      heroData = await response.json();
    } else {
      console.error("Failed to fetch hero data:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error fetching hero data:", error);
  }

  return (
    <HomePageClient heroData={heroData} />
  );
}