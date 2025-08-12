import type { NextConfig } from "next";
import { config } from 'dotenv';

config({ path: './config/.env.development' });

const nextConfig: NextConfig = {
  env: {},
};

export default nextConfig;
