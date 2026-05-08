import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  basePath: '/safetron',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/safetron',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
