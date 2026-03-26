import { motion } from "framer-motion";
import { CustomCursor } from "../components/ui/CustomCursor";
export default function Enterprise() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <CustomCursor />
      <section className="pt-40 pb-24 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* LEFT COLUMN: THE PROTOCOL SPECS (Sticky) */}
          <div className="lg:sticky lg:top-40 h-fit">
            <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.6em]">
              Layer_04 // Private_Access
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mt-6 leading-none">
              Sovereign <br /> Handshake
              <span className="text-purple-600">.</span>
            </h1>

            <div className="mt-12 space-y-8 max-w-sm">
              <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
                The Sovereign tier is reserved for entities requiring private AI
                training, immutable white-label architecture, and dedicated node
                infrastructure.
              </p>

              {/* Technical Status Box */}
              <div className="p-6 border border-white/5 bg-zinc-900/20 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">
                    Encryption
                  </span>
                  <span className="text-[9px] text-green-500 font-mono italic">
                    AES_256_ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">
                    Priority
                  </span>
                  <span className="text-[9px] text-white font-mono">
                    CRITICAL_PATH
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">
                    Handshake
                  </span>
                  <span className="text-[9px] text-white font-mono">
                    READY_FOR_INIT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: THE FORM */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/10 p-1 border-l border-white/5"
          >
            <form className="p-8 space-y-12">
              {/* Field 01: Entity Name */}
              <div className="group relative">
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-focus-within:text-purple-500 transition-colors">
                  01 // Entity_Identity
                </label>
                <input
                  type="text"
                  placeholder="Organization_Name"
                  className="w-full bg-transparent border-b border-white/10 py-4 text-sm uppercase tracking-widest focus:outline-none focus:border-purple-600 transition-all placeholder:text-zinc-800"
                />
              </div>

              {/* Field 02: Architectural Scope */}
              <div className="group relative">
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-focus-within:text-purple-500 transition-colors">
                  02 // Architectural_Scope
                </label>
                <select className="w-full bg-transparent border-b border-white/10 py-4 text-sm uppercase tracking-widest focus:outline-none focus:border-purple-600 transition-all text-zinc-400">
                  <option className="bg-black">Full_Protocol_Deployment</option>
                  <option className="bg-black">Private_AI_Nodes</option>
                  <option className="bg-black">
                    White_Label_Infrastructure
                  </option>
                  <option className="bg-black">Governance_Integration</option>
                </select>
              </div>

              {/* Field 03: Projected Node Load */}
              <div className="group relative">
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-focus-within:text-purple-500 transition-colors">
                  03 // Projected_Node_Load
                </label>
                <input
                  type="text"
                  placeholder="Est_Monthly_Requests"
                  className="w-full bg-transparent border-b border-white/10 py-4 text-sm uppercase tracking-widest focus:outline-none focus:border-purple-600 transition-all placeholder:text-zinc-800"
                />
              </div>

              {/* Field 04: Custom Requirements */}
              <div className="group relative">
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-focus-within:text-purple-500 transition-colors">
                  04 // Custom_Directives
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail_Technical_Needs..."
                  className="w-full bg-transparent border-b border-white/10 py-4 text-sm uppercase tracking-widest focus:outline-none focus:border-purple-600 transition-all placeholder:text-zinc-800 resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-12">
                <button className="relative w-full group overflow-hidden border border-purple-600 py-6">
                  <div className="absolute inset-0 bg-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.6em] group-hover:text-black transition-colors">
                    Establish_Connection
                  </span>
                </button>
                <p className="text-[8px] font-mono text-zinc-700 uppercase mt-4 text-center tracking-widest">
                  Secure_Handshake_Requires_Manual_Verification
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
