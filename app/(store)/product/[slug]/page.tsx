import ProductDetailPageClient from "@/components/product-detail-page-client";

export default function ProductDetailPage(props: {
  params: { slug: string };
}) {
  const { slug } = props.params;

  return (
    <ProductDetailPageClient
      slug={slug}
      relatedProducts={[]}
    />
  );
}