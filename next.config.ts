  import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary is already serving optimized assets; skip Next's proxy optimizer
    // to avoid upstream timeout errors in development/runtime.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
