/** @type {import('next').NextConfig} */
const nextConfig = {
 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    'https://9002-firebase-studio-1747033166930.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev',
  ],
};

module.exports = nextConfig;
