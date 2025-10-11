export function getImageUrl(relativePath: string): string {
  if (!relativePath) {
    return '/placeholder-product.svg'; // Return a default placeholder if path is empty
  }

  if (relativePath.startsWith('http')) {
    return relativePath; // Already a full URL
  }

  const cdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || '';
  // Use URL constructor for safe joining
  return new URL(relativePath, cdnUrl).href;
}
