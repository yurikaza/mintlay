import { Link } from "react-router-dom";
import { ConnectButtonHero } from "../buttons/ConnectButton";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAccount } from "wagmi";

export const NavbarPublic = () => {
  const { isConnected } = useAccount();
  const { login } = useAuth();

  // Trigger the backend sync as soon as the wallet connects
  useEffect(() => {
    if (isConnected && !localStorage.getItem("auth_token")) {
      login();
    }
  }, [isConnected]);

  return (
    <nav className="flex justify-between items-center p-8 z-50 bg-transparent absolute top-0 w-full">
      <Link
        to="/"
        className="font-bold tracking-tighter text-sm uppercase text-white"
      >
        MINTLAY
      </Link>
      <div className="flex items-center gap-12">
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
          <Link to="/showcase" className="hover:text-white transition-colors">
            Showcase
          </Link>
          <Link
            to="/resources/docs"
            className="hover:text-white transition-colors"
          >
            Docs
          </Link>
          <Link to="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>
        <ConnectButtonHero />
      </div>
    </nav>
  );
};
