import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAccount } from "wagmi"; // Example wallet hook

export const AuthRedirector = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Replace with your actual wallet connection hook
  const { isConnected } = { isConnected: true };

  useEffect(() => {
    // LOGIC A: User just connected -> Send to Dashboard
    if (isConnected && pathname === "/") {
      navigate("/dashboard/console");
    }

    // LOGIC B: User disconnected while inside Dashboard -> Send to Home
    if (!isConnected && pathname.startsWith("/dashboard")) {
      navigate("/");
    }
  }, [isConnected, pathname, navigate]);

  return null; // This component is invisible
};
