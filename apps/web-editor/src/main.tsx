import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, polygonMumbai, base, baseSepolia, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { injected, walletConnect } from "wagmi/connectors";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

// 1. Create the QueryClient
const queryClient = new QueryClient();

// 2. Create the Wagmi Config — all major EVM chains
// Public RPC endpoints that support CORS from browser origins.
// These are stable, rate-limit-friendly public nodes — swap for Alchemy/Infura
// URLs in production by setting VITE_RPC_* env vars.
const rpc = {
  mainnet:       import.meta.env.VITE_RPC_MAINNET       ?? "https://cloudflare-eth.com",
  sepolia:       import.meta.env.VITE_RPC_SEPOLIA        ?? "https://ethereum-sepolia-rpc.publicnode.com",
  polygon:       import.meta.env.VITE_RPC_POLYGON        ?? "https://polygon-rpc.com",
  polygonMumbai: import.meta.env.VITE_RPC_MUMBAI         ?? "https://rpc-mumbai.maticvigil.com",
  base:          import.meta.env.VITE_RPC_BASE           ?? "https://mainnet.base.org",
  baseSepolia:   import.meta.env.VITE_RPC_BASE_SEPOLIA   ?? "https://sepolia.base.org",
  arbitrum:      import.meta.env.VITE_RPC_ARBITRUM       ?? "https://arb1.arbitrum.io/rpc",
  optimism:      import.meta.env.VITE_RPC_OPTIMISM       ?? "https://mainnet.optimism.io",
};

const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai, base, baseSepolia, arbitrum, optimism],
  connectors: [
    injected(),                                    // MetaMask, Rabby, Brave, etc.
    walletConnect({ projectId: "mintlay-builder" }), // WalletConnect v2
  ],
  transports: {
    [mainnet.id]:       http(rpc.mainnet),
    [sepolia.id]:       http(rpc.sepolia),
    [polygon.id]:       http(rpc.polygon),
    [polygonMumbai.id]: http(rpc.polygonMumbai),
    [base.id]:          http(rpc.base),
    [baseSepolia.id]:   http(rpc.baseSepolia),
    [arbitrum.id]:      http(rpc.arbitrum),
    [optimism.id]:      http(rpc.optimism),
  },
});

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>,
  );
}
