import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export const HandshakeMonitor = () => {
  const navigate = useNavigate();
  const { isConnected, status } = useAccount();

  useEffect(() => {
    // If the status flips to 'connected', we push them to the console
    if (isConnected && status === "connected") {
      navigate("/dashboard", { replace: true });
    }
  }, [isConnected, status, navigate]);

  return null; // This component has no UI, it just watches the protocol
};
