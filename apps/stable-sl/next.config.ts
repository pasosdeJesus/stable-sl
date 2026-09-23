import type {NextConfig} from 'next';
import {config as loadEnv} from 'dotenv';
import path from 'path';

// Carga el .env compartido de apps/.env (un nivel arriba de apps/stable-sl).
// Next.js solo auto-carga .env* desde la raíz del proyecto, así que lo
// cargamos explícitamente para no depender de un symlink.
loadEnv({path: path.join(process.cwd(), '..', '.env')});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ["stable-sl.pdJ.app", "stable-sl.pdj.app", "127.0.0.1"],
  webpack: (config) => {
    // Límite de workers de compilación (OpenBSD: evita OOM con muchos workers).
    config.parallelism = parseInt(process.env.WEBPACK_PARALLELISM || '8', 10)
    // Optional peer deps of @coinbase/cdp-sdk (pulled by wagmi/rainbowkit) are
    // not installed; resolve them to empty modules so the build does not fail.
    // Prefix alias matches every @x402/* subpath.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@x402': false,
    }
    // WASM SWC (@next/swc-wasm-nodejs) usa `#async_hooks`, que webpack no
    // puede resolver en OpenBSD.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '#async_hooks': false,
    }
    return config
  },
};

export default nextConfig;
