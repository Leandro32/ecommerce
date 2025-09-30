/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.heroui.chat",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "broken-image-url.com",
      },
      {
        protocol: "https",
        hostname: "invalid-domain-that-does-not-exist.xyz",
      },
      {
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
