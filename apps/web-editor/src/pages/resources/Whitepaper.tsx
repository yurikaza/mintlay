import { motion } from "framer-motion";

export default function Whitepaper() {
  return (
    <div className="pt-32 pb-24 px-8 md:px-24 max-w-4xl mx-auto min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-l border-purple-600/30 pl-8 md:pl-16"
      >
        <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.6em]">
          Scientific_Thesis // v1.0.4
        </span>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mt-4 leading-none">
          The_Sovereign <br /> Architecture
          <span className="text-purple-600">.</span>
        </h1>

        <div className="mt-20 space-y-16">
          <section>
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">
              01 // Abstract
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed tracking-wide uppercase">
              Mintlay introduces a decentralized synthesis engine for digital
              structures. By leveraging non-linear processing, we eliminate the
              latency between design intent and protocol deployment.
            </p>
          </section>

          <section className="p-8 bg-zinc-900/20 border border-white/5 italic">
            <p className="text-[11px] text-zinc-500 leading-loose">
              "The transition from static code to fluid architectural logic
              represents the final stage of digital sovereignty. We no longer
              build pages; we deploy living environments."
            </p>
          </section>

          <section>
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">
              02 // Consensus_Logic
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed tracking-wide uppercase">
              Our Proof-of-Architecture (PoA) consensus ensures that every node
              in the network validates the structural integrity of the blueprint
              before the final handshake is committed.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
