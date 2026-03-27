import { Outlet, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

import { CustomCursor } from "../ui/CustomCursor";
import { NavbarDashboard } from "./NavbarDashboard";
import { NavbarPublic } from "./NavbarPublic";

import { AuthProvider } from "../../context/AuthContext";
import { Footer } from "./Footer";

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
      <AuthProvider>
        <div className="min-h-screen bg-black">
          {!isDashboard && <CustomCursor />}
          {/* Navigation Switch */}
          {isConnected ? <NavbarDashboard /> : <NavbarPublic />}
          <main>
            <Outlet />
          </main>
          <Footer />{" "}
          {/* Consistent footer across all pages, including dashboard */}
        </div>
      </AuthProvider>
    </div>
  );
};
