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

export default nextConfig;