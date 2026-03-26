import { motion } from "framer-motion";

const categories = [
  {
    id: "01",
    name: "INITIALIZATION",
    items: ["Core_Setup", "Handshake_Auth", "Environment_Vars"],
  },
  {
    id: "02",
    name: "SYNTHESIS",
    items: ["AI_Forge_API", "Blueprint_Logic", "Metadata_Mapping"],
  },
  {
    id: "03",
    name: "DEPLOYMENT",
    items: ["Global_Edge", "Immutable_Hashing", "SSL_Tunneling"],
  },
];

export default function Docs() {
  return (
    <div className="flex pt-20 h-screen bg-black overflow-hidden">
      {/* 1. LEFT SIDEBAR: THE FILE SYSTEM */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 overflow-y-auto hidden lg:flex">
        <div className="mb-12">
          <span className="text-[10px] font-mono text-purple-600 uppercase tracking-[0.4em]">
            Directory_Root
          </span>
        </div>

        <nav className="space-y-10">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col">
              <h4 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-purple-500">{cat.id} /</span> {cat.name}
              </h4>
              <ul className="space-y-4 pl-4 border-l border-white/5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="text-[11px] text-zinc-500 hover:text-white cursor-none uppercase tracking-widest transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* 2. CENTER: THE TECHNICAL MANUAL */}
      <main className="flex-1 overflow-y-auto p-8 md:p-20 custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-16 border-b border-white/5 pb-12">
            <span className="text-[9px] font-mono text-purple-500 uppercase tracking-[0.6em]">
              Doc_Type // Core_Initialization
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-4 text-white">
              Core_Setup<span className="text-purple-600">.</span>
            </h1>
          </div>

          <div className="space-y-12">
            <p className="text-zinc-500 text-sm leading-relaxed tracking-wide uppercase">
              The Mintlay Core Engine requires a secure handshake before
              architectural synthesis can begin. Initialize the protocol via the
              CLI or the Sovereign Dashboard.
            </p>

            {/* CODE BLOCK COMPONENT */}
            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-sm font-mono relative group">
              <span className="absolute top-2 right-4 text-[8px] text-zinc-700 uppercase tracking-widest">
                bash
              </span>
              <pre className="text-[12px] text-purple-400 overflow-x-auto">
                <code>{`$ npx mintlay-init --secure --tier=sovereign
> Initializing Handshake...
> AES_256 Encryption Active.
> System_Ready.`}</code>
              </pre>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                Requirements_Checklist
              </h3>
              <ul className="space-y-3">
                {[
                  "Valid Node_Key",
                  "SSL_Certificate_V3",
                  "Protocol_Authorization",
                ].map((req) => (
                  <li
                    key={req}
                    className="flex items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest"
                  >
                    <div className="w-1 h-1 bg-purple-600" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 3. RIGHT SIDEBAR: THE MANIFEST (METADATA) */}
      <aside className="w-64 border-l border-white/5 p-8 hidden xl:flex flex-col">
        <div className="mb-12">
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em]">
            On_This_Page
          </span>
        </div>

        <ul className="space-y-6 mb-20">
          {["System_Overview", "Quick_Install", "Node_Activation"].map(
            (link) => (
              <li
                key={link}
                className="text-[9px] text-zinc-500 uppercase tracking-widest hover:text-purple-500 transition-colors"
              >
                {link}
              </li>
            ),
          )}
        </ul>

        {/* STATUS READOUT */}
        <div className="mt-auto p-4 bg-zinc-900/40 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-mono text-zinc-600 uppercase">
              Latency
            </span>
            <span className="text-[9px] text-green-500 font-mono">14ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono text-zinc-600 uppercase">
              Sync
            </span>
            <span className="text-[9px] text-white font-mono">100%</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
