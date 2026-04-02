import React from "react";

import { useAccount } from "wagmi";
import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = () => {
  const { isConnected, status } = useAccount();
  if (status === "reconnecting" || status === "connecting") {
    return <div className="h-screen bg-black" />; // Prevent flicker
  }

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
