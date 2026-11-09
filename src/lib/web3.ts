import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Warp Prophets' }),
  ],
  pollingInterval: 200, // Denim 200ms canonical blocks
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 100,
    }),
  },
});
