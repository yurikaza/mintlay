import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Console from "./Console";

export default function Dashboard() {
  const { isConnected } = useAccount(); // REPLACE WITH: useAccount();
  useEffect(() => {
    console.log("Is Connected:", isConnected);
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-8 md:px-12">
      {/* 1. TOP STATUS BAR */}

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ACTIVE BLUEPRINTS */}
        <Console />

        {/* ANALYTICS / NODE HEALTH */}
        <div className="space-y-8">
          <div className="p-8 border border-white/5 bg-zinc-900/10">
            <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-8">
              Node_Health
            </h3>
            <div className="space-y-6">
              {[
                { label: "Synthesis_Load", val: "42%", color: "bg-purple-600" },
                { label: "Memory_Buffer", val: "18%", color: "bg-zinc-700" },
                {
                  label: "Handshake_Freq",
                  val: "99.9%",
                  color: "bg-green-500",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase mb-2">
                    <span>{stat.label}</span>
                    <span>{stat.val}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stat.val }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => {
              /* Call your disconnect function */
            }}
            className="w-full py-4 border border-red-900/30 text-red-900 hover:bg-red-900 hover:text-white transition-all text-[9px] font-mono uppercase tracking-[0.4em]"
          >
            Terminate_Session
          </button>
        </div>
      </div>
    </div>
  );
}
