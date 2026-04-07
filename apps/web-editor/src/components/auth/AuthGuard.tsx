import React from "react";
import { useAccount } from "wagmi";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = () => {
  const { isConnected, status } = useAccount();
  const { login } = useAuth();

  if (status === "reconnecting" || status === "connecting") {
    return <div>Loading...</div>;
  }

  if (status === "disconnected") {
    return <Navigate to="/" replace />;
  }

  if (!isConnected) {
    console.log(isConnected);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
