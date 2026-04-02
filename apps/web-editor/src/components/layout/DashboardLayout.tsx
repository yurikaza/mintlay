import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export const DashboardLayout = () => {
  const [loading, setLoading] = useState(false);
  const { isConnected } = useAccount();
  const dispatch = useDispatch();

  const { login } = useAuth();
  useEffect(() => {
    const hasLocalToken = !!localStorage.getItem("auth_token");

    if (!hasLocalToken) {
      login()
        .then(() => {
          console.log("DASHBOARD_LAYOUT_LOGIN_SUCCESS");
          setLoading(true);
        })
        .catch((err) => {
          console.error("DASHBOARD_LAYOUT_LOGIN_FAILED:", err);
          dispatch(logout());
        });
    } else {
      setLoading(true);
    }
  }, [isConnected]);
  // 1. If wallet is not even connected, the HandshakeMonitor will handle the redirect.
  if (!isConnected) return null;

  if (!loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505] text-white">
        <p className="text-xl">Verification...</p>
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
