import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";

export const ProtectedRoute = () => {
  // The modern hook usage
  const { isConnected, isConnecting, isReconnecting } = useAccount();

  // IMPORTANT: Wait for the handshake to finish.
  // If we don't check 'isReconnecting', the app might kick the user out
  // for a split second while it remembers their previous session.
  if (isConnecting || isReconnecting) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center font-mono text-[10px] text-purple-500 uppercase tracking-[0.5em]">
        Authenticating_Node...
      </div>
    );
  }

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
