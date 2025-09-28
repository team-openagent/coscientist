import type { NextConfig } from "next";
import { config } from 'dotenv';

config({ path: './.env.development' });

const nextConfig: NextConfig = {
  env: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

};

export default nextConfig;
