import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Dither from "../../reactbits/Dither";

export const Manifesto = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start end" = Animation starts as soon as the section enters the bottom of the screen
    // "end start" = Animation ends when the section leaves the top
    offset: ["start end", "end start"],
  });

  // TIGHTENED TRANSFORM RANGES (0.2 - 0.5 is the "Sweet Spot" for visibility)
  const missionOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const missionY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);

  const visionOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const visionY = useTransform(scrollYProgress, [0.45, 0.65], [40, 0]);

  // Purple spotlight follow
  const spotlightY = useTransform(scrollYProgress, [0, 1], ["20%", "80%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-black overflow-hidden"
    >
      {/* 1. CLASSIC BACKGROUND (KEEPING DITHER) */}
      <div className="fixed inset-0 z-0">
        <Dither
          waveColor={[0.15, 0.02, 0.35]} // Your architectural purple
          disableAnimation={false}
          enableMouseInteraction={false}
          colorNum={4}
          waveAmplitude={0.4}
          waveFrequency={5}
          waveSpeed={0.02}
        />
        <motion.div
          style={{ top: spotlightY }}
          className="absolute left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"
        />
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-6 md:px-24 z-10">
        {/* --- ACT 1: THE MISSION --- */}
        <motion.div
          style={{ opacity: missionOpacity, y: missionY }}
          className="max-w-5xl mb-40"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.4em]">
              Section_05 // Intent
            </span>
            <div className="h-[1px] w-20 bg-purple-500/30" />
          </div>

          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-[0.85]">
            Architecting <br />
            <span className="text-zinc-600">Digital Sovereignty.</span>
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <p className="text-xs text-zinc-400 uppercase leading-relaxed tracking-widest max-w-sm">
              Our mission is to bridge the gap between abstract design and
              immutable protocol. We provide the tools to build a web that is
              owned by its creators, not its hosts.
            </p>
            <div className="border-l border-white/10 pl-8 flex flex-col justify-center">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">
                Core_Values:
              </span>
              <span className="text-[10px] text-white font-bold uppercase mt-1 tracking-tighter">
                Transparency // Performance // Decentralization
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- ACT 2: THE VISION --- */}
        <motion.div
          style={{ opacity: visionOpacity, y: visionY }}
          className="max-w-5xl self-end text-right"
        >
          <div className="flex items-center gap-4 mb-6 justify-end">
            <div className="h-[1px] w-20 bg-purple-500/30" />
            <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.4em]">
              Section_06 // Future
            </span>
          </div>

          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-[0.85]">
            Beyond the <br />
            <span className="text-purple-500">Interface.</span>
          </h2>

          <div className="mt-8 flex flex-col md:flex-row-reverse gap-12 items-start">
            <p className="text-xs text-zinc-400 uppercase leading-relaxed tracking-widest max-w-sm">
              We see a future where every digital interaction is a verified
              asset. Mintlay is the foundation for the tokenized economy of
              2030.
            </p>
            <div className="border-r border-white/10 pr-8 flex flex-col justify-center md:text-right">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">
                Projection:
              </span>
              <span className="text-[10px] text-white font-bold uppercase mt-1 tracking-tighter">
                100% On-Chain // Global Accessibility // AI-Augmented
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Progress Line */}
      <motion.div
        style={{ scaleY: useTransform(scrollYProgress, [0.1, 0.9], [0, 1]) }}
        className="absolute left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent origin-top hidden md:block"
      />
    </section>
  );
};
