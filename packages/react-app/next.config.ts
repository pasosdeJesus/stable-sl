import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  allowedDevOrigins: ["stable-sl.pdJ.app", "stable-sl.pdj.app"]
};

export default nextConfig;
