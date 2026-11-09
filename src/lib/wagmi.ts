import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Base Denim Upgrade Configuration (Activated Nov 5, 2026 on Base Mainnet)
// Flashblocks have been retired in favor of native 200ms canonical blocks.
export const BASE_DENIM_CONFIG = {
  chainId: 8453,
  name: 'Base Mainnet (Denim)',
  blockTimeMs: 200,
  upgrade: 'Denim 200ms Native Blocks',
  activatedAt: '2026-11-05T18:00:00Z',
  rpcUrl: 'https://mainnet.base.org',
  status: 'active'
} as const;

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  pollingInterval: 200, // 200ms block polling matching Denim's canonical 200ms block time
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 100,
    }),
  },
});
