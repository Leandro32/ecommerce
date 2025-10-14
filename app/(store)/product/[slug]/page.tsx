import ProductDetailPageClient from "@/components/product-detail-page-client";
import { getProductBySlug, getRelatedProducts } from "@/lib/api"; // Assuming these functions exist
import { getAllBrands } from "@/lib/api"; // Assuming this function exists

async function fetchProductData(slug: string) {
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { product: null, relatedProducts: [], allBrands: [] };

    const [relatedProducts, allBrands] = await Promise.all([
      getRelatedProducts(product.brand, product.id),
      getAllBrands(),
    ]);

    return { product, relatedProducts, allBrands };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return { product: null, relatedProducts: [], allBrands: [] };
  }
}

export default async function ProductDetailPage(props: {
  params: { slug: string };
}) {
  const { slug } = props.params;
  const { product, relatedProducts, allBrands } = await fetchProductData(slug);

  if (!product) {
    return <div>Product not found.</div>; // Or a proper 404 page
  }

  return (
    <ProductDetailPageClient
      product={product}
      relatedProducts={relatedProducts}
      allBrands={allBrands}
    />
  );
}
