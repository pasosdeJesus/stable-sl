import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  allowedDevOrigins: ["stable-sl.pdJ.app", "stable-sl.pdj.app", "127.0.0.1"]
};

export default nextConfig;
