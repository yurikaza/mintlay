import React from "react";
import { Monitor, Tablet, Smartphone, Play, Loader2, Link } from "lucide-react";

interface TopNavbarProps {
  projectName: string;
  loading?: boolean;
}

export const TopNavbar = ({ projectName, loading }: TopNavbarProps) => {
  return (
    <div className="w-full h-full px-4 flex items-center justify-between text-xs font-medium text-zinc-400">
      {/* Left: Branding & Project Name */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <div className="text-white font-bold tracking-widest">MINTLAY_OS</div>
        </Link>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-2">
          <span>PROJECT:</span>
          <span className="text-zinc-300 uppercase">{projectName}</span>
        </div>
      </div>

      {/* Center: Viewport Controls */}
      <div className="flex items-center bg-zinc-900 rounded p-1 border border-zinc-800">
        <button className="p-1.5 rounded bg-zinc-800 text-white shadow-sm">
          <Monitor className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded hover:text-white transition-colors">
          <Tablet className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded hover:text-white transition-colors">
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>SYNCING</span>
          </div>
        ) : (
          <div className="text-emerald-500/80">SAVED</div>
        )}
        <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors flex items-center gap-2">
          <Play className="w-3 h-3 fill-current" />
          DEPLOY
        </button>
      </div>
    </div>
  );
};
