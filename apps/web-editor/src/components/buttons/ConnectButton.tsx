// apps/web-editor/src/components/ConnectButtonHero.tsx
import { useConnect, useAccount } from "wagmi";
import { api } from "../../lib/api";

export const ConnectButtonHero = () => {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();

  const handleConnect = async () => {
    // 1. Connect the Wallet
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  if (isConnected) {
    return (
      <div className="group relative px-6 py-2 border border-mint/30 bg-mint/5 overflow-hidden">
        <span className="relative font-mono text-[11px] text-mint tracking-widest">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect} // Use our new handler
      className="group relative px-8 py-2 border border-white/20 hover:border-mint transition-all duration-500 overflow-hidden"
    >
      <span className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-white group-hover:text-mint transition-colors">
        Connect_Wallet
      </span>
    </button>
  );
};
