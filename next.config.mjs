/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.heroui.chat',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
