import ProductDetailPageClient from "@/components/product-detail-page-client";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<Product | null> {
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/products/${slug}`, { cache: "no-store" });
  console.log({ res });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch product");
  }
  const json = await res.json();
  return json.data;
}

async function getRelatedProducts(
  currentProductId: string,
): Promise<Product[]> {
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/products`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch related products");
  }
  const json = await res.json();
  return json.data
    .filter((p: Product) => p.id !== currentProductId)
    .slice(0, 4);
}

export default async function ProductDetailPage(props: {
  params: { slug: string };
}) {
  const { slug } = props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id);

  return (
    <ProductDetailPageClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
