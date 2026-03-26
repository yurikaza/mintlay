import { useConnect, useAccount } from "wagmi";

export const ConnectButtonHero = () => {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();

  if (isConnected) {
    return (
      <div className="group relative px-6 py-2 border border-mint/30 bg-mint/5 overflow-hidden">
        <div className="absolute inset-0 bg-mint/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative font-mono text-[11px] text-mint tracking-widest">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="group relative px-8 py-2 border border-white/20 hover:border-mint transition-all duration-500 overflow-hidden"
    >
      {/* The "Scanner" Hover Effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-mint shadow-[0_0_15px_#00ffcc] -translate-y-full group-hover:translate-y-[40px] transition-transform duration-700 ease-in-out" />

      <span className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-white group-hover:text-mint transition-colors">
        Connect_Wallet
      </span>
    </button>
  );
};
