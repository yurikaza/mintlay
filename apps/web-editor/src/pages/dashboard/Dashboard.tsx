import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { isConnected } = useAccount(); // REPLACE WITH: useAccount();
  useEffect(() => {
    console.log("Is Connected:", isConnected);
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-8 md:px-12">
      {/* 1. TOP STATUS BAR */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 mb-12">
        <div>
          <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.6em]">
            System_Active // Node_01
          </span>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mt-2">
            Architect_Console
          </h1>
        </div>
        <div className="flex gap-12 mt-6 md:mt-0 font-mono text-[9px] text-zinc-500">
          <div className="flex flex-col">
            <span className="text-zinc-700 mb-1">NETWORK_STATUS</span>
            <span className="text-green-500 italic uppercase">
              Mainnet_Linked
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-700 mb-1">BLUEPRINT_SLOTS</span>
            <span className="text-white uppercase">03 / 10 Active</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ACTIVE BLUEPRINTS */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            Active_Blueprints
          </h3>
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-zinc-900/20 border border-white/5 hover:border-purple-600/30 transition-all flex justify-between items-center group"
            >
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-mono text-xs">
                  0{i}
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                    Project_Mintlay_v4
                  </h4>
                  <p className="text-[9px] text-zinc-600 font-mono mt-1 uppercase">
                    Hash: 0x82...f92 // Deployed: 2h ago
                  </p>
                </div>
              </div>
              <button className="text-[9px] font-mono border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all uppercase">
                Manage_Node
              </button>
            </motion.div>
          ))}

          <button className="w-full py-8 border-2 border-dashed border-white/5 text-zinc-700 hover:text-purple-500 hover:border-purple-500/20 transition-all text-[10px] font-mono uppercase tracking-[0.4em]">
            + Initialize_New_Blueprint
          </button>
        </div>

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
