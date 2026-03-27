import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const ProtectedRoute = () => {
  // In v2, we monitor 'status' to distinguish between
  // 'reconnecting' (don't kick out) and 'disconnected' (kick out).
  const { isConnected, status } = useAccount();
  const { isAuthenticated, isVerifying } = useSelector(
    (state: RootState) => state.auth,
  );
  const { login } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    // Only login if we are connected, have NO token, and aren't already verifying
    if (status === "connected" && !token && !isVerifying) {
      login();
    }
  }, [status, isVerifying, login]);
  // 1. Handle the "Loading/Handshake" state
  // This prevents the "Flash of Home Page" while Wagmi remembers the wallet
  if (status === "reconnecting" || status === "connecting") {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center font-mono text-[10px] text-zinc-700 uppercase tracking-[0.5em]">
        Authenticating_Node...
      </div>
    );
  }

  // 2. The Security Ejection
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  // 3. Handshake Verified -> Render Dashboard Content
  return <Outlet />;
};
