import { Outlet, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

import { CustomCursor } from "../ui/CustomCursor";
import { NavbarDashboard } from "./NavbarDashboard";
import { NavbarPublic } from "./NavbarPublic";

export const RootLayout = () => {
  const { isConnected } = useAccount();
  const location = useLocation();

  // Determine if we are inside the dashboard environment
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div
      className={`relative min-h-screen bg-black antialiased ${isDashboard ? "cursor-auto" : ""}`}
    >
      {" "}
      {/* PROTOCOL: Only render the CustomCursor if we are NOT in the dashboard.
          This ensures the dashboard feels like a standard, high-speed utility tool.
      */}
      {!isDashboard && <CustomCursor />}
      {/* Navigation Switch */}
      {isConnected ? <NavbarDashboard /> : <NavbarPublic />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
