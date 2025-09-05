import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // protocol: 'http', //Must remove this in production
        hostname: 'smartcoderrahis.pythonanywhere.com',
        // hostname: 'localhost',
        // port: '8000',  //Must remove this in production
        pathname: '/media/**',
      },
      {
        // protocol: 'https',
        protocol: 'http', //Must remove this in production
        // hostname: 'rahis.pythonanywhere.com',
        hostname: 'localhost',
        port: '8000',  //Must remove this in production
        pathname: '/media/**',
      },

    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint during build
  },  
};

export default nextConfig;
