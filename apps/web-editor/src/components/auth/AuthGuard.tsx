import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import type { RootState } from "../../store";

export const ProtectedRoute = () => {
  const { isConnected, status } = useAccount();
  const { isAuthenticated, isVerifying } = useSelector(
    (state: RootState) => state.auth,
  );
  const { login } = useAuth();

  useEffect(() => {
    const hasLocalToken = !!localStorage.getItem("auth_token");
    console.log(status, isAuthenticated, isVerifying, hasLocalToken);

    // ONLY trigger MetaMask if:
    // 1. Wallet is connected
    // 2. Redux does NOT have a token (isAuthenticated is false)
    // 3. We aren't already mid-signature (isVerifying is false)
    if (status === "connected" && !hasLocalToken && !isVerifying) {
      login();
    }
  }, [status, isAuthenticated, isVerifying]);

  if (status === "reconnecting" || status === "connecting") {
    return <div className="h-screen bg-black" />; // Prevent flicker
  }

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
