import { motion } from "framer-motion";

const endpoints = [
  {
    method: "GET",
    path: "/v1/blueprint/:id",
    desc: "Retrieve structural metadata",
  },
  {
    method: "POST",
    path: "/v1/synthesis/init",
    desc: "Initialize new architecture",
  },
  {
    method: "PUT",
    path: "/v1/node/sync",
    desc: "Force global node synchronization",
  },
  {
    method: "DELETE",
    path: "/v1/layer/:id",
    desc: "Deconstruct specific logic layer",
  },
];

export default function ApiReference() {
  return (
    <div className="pt-32 pb-24 px-8 md:px-24 max-w-7xl mx-auto min-h-screen">
      <div className="mb-20">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.5em]">
          Protocol_Interface
        </span>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-2 text-white">
          API_Endpoints
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {endpoints.map((ep, i) => (
          <motion.div
            key={ep.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col md:flex-row items-center gap-8 p-6 border border-white/5 bg-zinc-900/10 hover:border-purple-500/50 transition-all cursor-none"
          >
            <span
              className={`font-mono text-[10px] px-3 py-1 rounded-sm ${
                ep.method === "GET"
                  ? "bg-blue-500/10 text-blue-400"
                  : ep.method === "POST"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-purple-500/10 text-purple-400"
              }`}
            >
              {ep.method}
            </span>
            <code className="text-[12px] text-zinc-300 font-mono tracking-wider flex-1">
              {ep.path}
            </code>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
              {ep.desc}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-8 border-t border-white/5 font-mono">
        <p className="text-[9px] text-zinc-700 uppercase tracking-[0.4em]">
          Handshake_Required // All requests must include X-MINTLAY-AUTH-KEY
          header.
        </p>
      </div>
    </div>
  );
}
