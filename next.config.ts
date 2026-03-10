import type { NextConfig } from 'next';

// Backend API URL (no trailing slash). Start backend with: cd backend && npm run start:dev
const API_BACKEND = process.env.API_BACKEND_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_BACKEND}/api/:path*` }];
  },
};

export default nextConfig;
