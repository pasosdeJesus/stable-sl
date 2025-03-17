'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  celo,
  celoAlfajores
} from 'wagmi/chains';

export default function AppProvider({wcid, testnet, children }) {
  const config = getDefaultConfig({
    appName: 'Stable-SL',
    projectId: wcid,
    chains: [
      celo,
      ...(testnet ? [celoAlfajores] : []),
    ],
    ssr: true,
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
