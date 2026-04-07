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
const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai, base, baseSepolia, arbitrum, optimism],
  connectors: [
    injected(),                                    // MetaMask, Rabby, Brave, etc.
    walletConnect({ projectId: "mintlay-builder" }), // WalletConnect v2
  ],
  transports: {
    [mainnet.id]:       http(),
    [sepolia.id]:       http(),
    [polygon.id]:       http(),
    [polygonMumbai.id]: http(),
    [base.id]:          http(),
    [baseSepolia.id]:   http(),
    [arbitrum.id]:      http(),
    [optimism.id]:      http(),
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
