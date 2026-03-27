import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export const HandshakeMonitor = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    const isDashboard = location.pathname.startsWith("/dashboard");

    // PROTOCOL: Only redirect if we are NOT on the dashboard but connected AND verified
    if (isConnected && token && !isDashboard) {
      navigate("/dashboard");
    }

    // PROTOCOL: Only kick out if we are on dashboard but disconnected
    if (!isConnected && isDashboard) {
      navigate("/");
    }

    // Notice: We do NOT redirect if we have a wallet but NO token.
    // We stay on /dashboard and show the "Authorize" button instead.
  }, [isConnected, token, location.pathname]);

  return null;
};
