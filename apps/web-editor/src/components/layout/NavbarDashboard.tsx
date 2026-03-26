import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

export const NavbarDashboard = () => {
  const { address } = useAccount();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-zinc-900 border-b border-white/5">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-black text-mint text-xs">
          MINTLAY_OS
        </Link>
        <div className="h-4 w-[1px] bg-white/10" />
        <span className="text-[10px] text-zinc-500 font-mono uppercase">
          Project: Untitled_Artifact
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-[10px] font-mono bg-black px-2 py-1 rounded border border-white/10 text-zinc-400">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <button className="bg-mint text-black text-[10px] font-bold px-3 py-1 rounded hover:bg-white transition-colors">
          DEPLOY
        </button>
      </div>
    </nav>
  );
};
