import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export const DashboardSidebar = () => {
  const [mouseY, setMouseY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { pathname } = useLocation();

  // Tracks the mouse position specifically within the sidebar
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseY(e.clientY - rect.top);
  };

  const navLinks = [
    { name: "Console", path: "/dashboard" },
    { name: "Blueprints", path: "/dashboard/blueprints" },
    { name: "Nodes", path: "/dashboard/nodes" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <aside
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-64 border-r border-white/5 h-full pt-24 pb-8 flex flex-col overflow-hidden bg-[#050505]"
    >
      {/* THE SCANNER LINE */}
      <motion.div
        animate={{
          top: mouseY,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200, mass: 0.2 }}
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none z-50"
      />

      {/* SIDEBAR CONTENT */}
      <div className="px-8 mb-12">
        <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.4em]">
          System_Nav
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group relative flex items-center py-3 px-4 transition-all duration-300 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-full bg-purple-600"
                />
              )}

              <span className="text-[10px] font-mono uppercase tracking-[0.2em] z-10">
                {link.name}
              </span>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-300" />
            </Link>
          );
        })}
      </nav>

      {/* METADATA FOOTER */}
      <div className="px-8 pt-8 border-t border-white/5">
        <div className="flex justify-between items-center text-[8px] font-mono text-zinc-700">
          <span>SCAN_MODE</span>
          <span className="text-purple-900">ACTIVE</span>
        </div>
      </div>
    </aside>
  );
};
