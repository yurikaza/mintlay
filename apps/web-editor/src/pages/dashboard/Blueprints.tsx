import { motion } from "framer-motion";

export default function BlueprintsPage() {
  return (
    <div className="px-12 pb-20">
      <div className="mb-12">
        <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.6em]">
          System_Files
        </span>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mt-2">
          Stored_Blueprints
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="p-8 border border-white/5 bg-zinc-900/10 hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start mb-12">
              <span className="text-[9px] font-mono text-zinc-700 uppercase">
                Schema_0{i}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <h4 className="text-lg font-black uppercase italic tracking-tighter mb-2">
              Alpha_Protocol_v{i}
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8">
              Last handshake: 14:02 UTC
            </p>
            <button className="w-full py-3 border border-purple-600/30 text-[9px] font-mono text-purple-400 uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">
              Initialize_Edit
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
