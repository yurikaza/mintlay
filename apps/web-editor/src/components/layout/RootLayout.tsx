import { Outlet, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { NavbarPublic } from "./NavbarPublic";
import { NavbarDashboard } from "./NavbarDashboard";
import { Footer } from "./Footer";

export const RootLayout = () => {
  const { isConnected } = useAccount();
  const location = useLocation();

  // Logic: Use Dashboard nav if on /editor route OR if connected on home
  const isEditorPath = location.pathname.startsWith("/editor");
  const showDashboardNav = isEditorPath && isConnected;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {showDashboardNav ? <NavbarDashboard /> : <NavbarPublic />}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
