import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
};

// Dynamically add remotePatterns based on NEXT_PUBLIC_APP_URL
if (process.env.NEXT_PUBLIC_APP_URL) {
  try {
    const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL);
    nextConfig.images.remotePatterns.push({
      protocol: appUrl.protocol.replace(':', ''), // Remove colon from protocol
      hostname: appUrl.hostname,
      port: appUrl.port || '', // Ensure port is an empty string if not present
      pathname: "/uploads/products/**",
    });
  } catch (error) {
    console.error("Invalid NEXT_PUBLIC_APP_URL in next.config.mjs:", error);
  }
}

// Dynamically add remotePatterns based on NEXT_PUBLIC_IMAGE_CDN_URL for MinIO or other CDNs
if (process.env.NEXT_PUBLIC_IMAGE_CDN_URL) {
  try {
    const cdnUrl = new URL(process.env.NEXT_PUBLIC_IMAGE_CDN_URL);
    nextConfig.images.remotePatterns.push({
      protocol: cdnUrl.protocol.replace(':', ''),
      hostname: cdnUrl.hostname,
      port: cdnUrl.port || '',
      pathname: '/**', // Allow any path from this CDN
    });
  } catch (error) {
    console.error("Invalid NEXT_PUBLIC_IMAGE_CDN_URL in next.config.mjs:", error);
  }
}

export default withBundleAnalyzer(nextConfig);
