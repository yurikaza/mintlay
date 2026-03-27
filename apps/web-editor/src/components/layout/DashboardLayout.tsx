import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export const DashboardLayout = () => {
  const { isConnected } = useAccount();

  // 1. If wallet is not even connected, the HandshakeMonitor will handle the redirect.
  if (!isConnected) return null;

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
