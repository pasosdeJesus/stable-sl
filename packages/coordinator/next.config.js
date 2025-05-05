/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  allowedDevOrigins: ["stable-sl.pdJ.app", "stable-sl.pdj.app", "stable-sl-coordinator.pdj.app"],
};

export default nextConfig
//module.exports = nextConfig;
