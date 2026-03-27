import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";

import { useAccount } from "wagmi";

export const DashboardLayout = () => {
  const { isConnected } = useAccount();
  const token = localStorage.getItem("auth_token");

  // 1. If wallet is not even connected, the HandshakeMonitor will handle the redirect.
  if (!isConnected) return null;

  // 2. If connected but no backend session, show the "Gate"
  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="text-center border border-white/10 p-12 bg-white/5 backdrop-blur-xl">
          <h2 className="text-mint font-mono text-xs mb-8 tracking-[0.5em]">
            IDENTITY_VERIFICATION_REQUIRED
          </h2>
          <button
            onClick={() => window.location.reload()} // Simple way to re-trigger the login flow
            className="px-8 py-3 border border-mint text-mint hover:bg-mint hover:text-black transition-all font-mono text-[10px]"
          >
            INITIALIZE_HANDSHAKE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* 1. THE SCANNING SIDEBAR */}
      {/* This stays fixed on the left while you navigate */}
      <DashboardSidebar />

      {/* 2. THE MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {/* The top padding (pt-24) ensures content starts below the PrivateNavbar */}
        <div className="pt-24 px-12 pb-20">
          <Outlet />
        </div>

        {/* OPTIONAL: Ambient Background Scan Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />
      </main>
    </div>
  );
};
