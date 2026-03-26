import { motion } from "framer-motion";

export const Showcase = () => {
  return (
    <section className="bg-black py-24 px-8 border-t border-white/10 relative overflow-hidden">
      {/* Background Label */}
      <div className="absolute top-10 right-10 opacity-5 font-mono text-[15vw] pointer-events-none select-none italic font-black">
        SHOWCASE
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-md">
            <span className="text-mint font-mono text-xs tracking-[0.4em] mb-4 block">
              FEATURED_BUILD // 01
            </span>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              The Hyper-Object <br /> Landing Page
            </h2>
          </div>

          <div className="flex flex-col items-end text-right">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">
              Deployed_to: Mainnet
            </p>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              Storage: IPFS // CID_V1
            </p>
          </div>
        </div>

        {/* The "Viewport" Frame */}
        <motion.div
          {...({
            whileHover: { scale: 0.98 },
            transition: { duration: 0.8, ease: "circOut" },
            className:
              "relative aspect-video bg-zinc-900 border border-white/10 group cursor-crosshair overflow-hidden",
          } as any)}
        >
          {/* Decorative Corner Brackets */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-mint/50" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-mint/50" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-mint/50" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-mint/50" />

          {/* Placeholder for the project image */}
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
            alt="Showcase Project"
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          />

          {/* Overlay Tag */}
          <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md border border-white/10 p-4">
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-mono">
                <span className="text-zinc-500">TYPE:</span>{" "}
                <span className="text-white uppercase">Decentralized_App</span>
              </div>
              <div className="h-3 w-[1px] bg-white/20" />
              <button className="text-mint text-[10px] font-bold uppercase tracking-widest hover:underline">
                View_Artifact
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
