import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { injected } from "wagmi/connectors"; // <--- Add this import
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";

// 1. Create the QueryClient
const queryClient = new QueryClient();

// 2. Create the Wagmi Config
const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(), // <--- Add this here!
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>,
  );
}
