import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Dither from "../../reactbits/Dither";

export const Ignition = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // UI Element animations
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.8, 0.9],
    [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.9, 1]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-black">
      {/* 1. FINAL DITHER INTENSITY */}

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-10 px-6">
        {/* THE MISSION CONTROL TERMINAL */}
        <motion.div
          style={{ opacity, scale }}
          className="w-full max-w-2xl border border-white/10 bg-black/80 backdrop-blur-3xl rounded-xl p-8 shadow-[0_0_100px_rgba(139,92,246,0.15)]"
        >
          {/* Header Specs */}
          <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
            <span className="text-[9px] font-mono text-purple-500 uppercase tracking-widest">
              Final_Sequence // Phase_07
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">
                System_Ready
              </span>
            </div>
          </div>

          {/* Center Call to Action */}
          <div className="text-center py-12">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
              Ready for <br /> <span className="text-purple-600">Mainnet.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] max-w-xs mx-auto mb-12">
              All architectural modules verified. Gemini API synthesis complete.
            </p>

            {/* THE DEPLOY BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-xs rounded-full overflow-hidden transition-all duration-300 hover:bg-purple-600 hover:text-white"
            >
              <span className="relative z-10">Deploy_Protocol</span>
              <motion.div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>

          {/* Footer Metadata */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between font-mono text-[8px] text-zinc-600 uppercase">
            <span>Build_ID: ML-2026-X</span>
            <span>Handshake: AES-256</span>
            <span>Deployment: Immutable</span>
          </div>
        </motion.div>

        {/* BACKGROUND DECOR: COORDINATES TRACKING THE CURSOR */}
        <div className="absolute bottom-12 left-12 flex flex-col gap-2 opacity-20">
          <div className="h-[1px] w-32 bg-white/20" />
          <span className="text-[8px] font-mono text-white tracking-widest uppercase italic">
            Secure Connection Established
          </span>
        </div>
      </div>
    </section>
  );
};
