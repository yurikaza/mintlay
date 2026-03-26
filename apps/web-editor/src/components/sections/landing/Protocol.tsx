import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Dither from "../../reactbits/Dither";

export const Protocol = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Cursor "Automator" Logic
  const cursorX = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2, 0.4, 0.6, 0.8],
      [400, 100, 100, 900, 900],
    ),
  );
  const cursorY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2, 0.4, 0.6, 0.8],
      [400, 200, 400, 400, 150],
    ),
  );

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-black">
      {/* 1. ATMOSPHERIC BACKGROUND (RESTORED) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Dither
          waveColor={[0.15, 0.02, 0.35]}
          disableAnimation={false}
          colorNum={4}
          waveAmplitude={0.4}
          waveFrequency={5}
          waveSpeed={0.02}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4b0082_0%,transparent_80%)] opacity-30" />
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center z-10 p-6">
        {/* THE MAIN INTERFACE WINDOW */}
        <div className="relative w-full h-[85vh] max-w-7xl border border-white/10 rounded-xl bg-[#050505]/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex">
          {/* --- LEFT PANEL: NAVIGATOR & COMPONENTS (WEBFLOW STYLE) --- */}
          <div className="w-64 border-r border-white/5 bg-black/40 p-4 flex flex-col gap-6 text-[10px] font-mono">
            <div className="text-zinc-500 tracking-widest uppercase">
              Elements
            </div>
            <div className="space-y-2">
              <motion.div
                style={{
                  borderColor: useTransform(
                    scrollYProgress,
                    [0.1, 0.2],
                    ["rgba(255,255,255,0.1)", "rgba(139,92,246,1)"],
                  ),
                }}
                className="p-2 border rounded bg-white/5 flex items-center gap-2"
              >
                <div className="w-3 h-3 border border-purple-500/50" />
                <span className="text-zinc-300">HERO_SECTION</span>
              </motion.div>
              <div className="p-2 border border-white/10 rounded bg-white/5 opacity-40">
                MINT_BUTTON
              </div>
            </div>

            <div className="mt-8 text-zinc-500 tracking-widest uppercase">
              Web3 Layer
            </div>
            <div className="p-3 border border-purple-500/20 rounded bg-purple-500/5 text-purple-400">
              CONTRACT_V1.SOL
            </div>
          </div>

          {/* --- CENTER: THE VISUAL CANVAS --- */}
          <div className="flex-1 relative bg-[#080808] overflow-hidden">
            {/* Dot Grid */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* LIVE SITE PREVIEW (What they are building) */}
            <div className="absolute inset-10 border border-white/5 bg-black/50 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <motion.div
                style={{
                  scale: useTransform(scrollYProgress, [0.3, 0.5], [0.9, 1]),
                  opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
                }}
                className="text-center"
              >
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">
                  Protocol_01
                </h1>
                <div className="mt-6 px-8 py-3 bg-purple-600 text-white font-black text-xs rounded-full">
                  CONNECT_FORGE
                </div>
              </motion.div>
            </div>

            {/* CURSOR-HELD PREVIEW */}
            <motion.div
              style={{
                x: cursorX,
                y: cursorY,
                opacity: useTransform(
                  scrollYProgress,
                  [0.1, 0.15, 0.25, 0.3],
                  [0, 1, 1, 0],
                ),
              }}
              className="absolute z-50 p-2 border-2 border-purple-500 bg-purple-500/20 backdrop-blur-md rounded text-[9px] text-white font-bold"
            >
              DRAG_ELEMENT
            </motion.div>
          </div>

          {/* --- RIGHT PANEL: STYLE & CONTRACT MANAGER (THE PRO PART) --- */}
          <div className="w-72 border-l border-white/5 bg-black/40 p-5 flex flex-col gap-6 text-[10px] font-mono">
            <div className="flex justify-between text-zinc-500">
              <span>STYLE</span>
              <span className="text-purple-500 tracking-widest">WEB3</span>
            </div>

            {/* Style Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-zinc-600 uppercase">Background_Color</div>
                <div className="h-8 w-full bg-zinc-900 rounded border border-white/10 flex items-center px-2 justify-between">
                  <span className="text-white">#050505</span>
                  <div className="w-4 h-4 bg-purple-600 rounded-sm" />
                </div>
              </div>

              {/* Smart Contract Hook (The unique Web3 part) */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="text-zinc-600 uppercase">
                  Contract_Integration
                </div>
                <motion.div
                  style={{
                    backgroundColor: useTransform(
                      scrollYProgress,
                      [0.6, 0.7],
                      ["rgba(39,39,42,1)", "rgba(139,92,246,0.2)"],
                    ),
                  }}
                  className="p-3 border border-white/10 rounded flex flex-col gap-2"
                >
                  <span className="text-purple-400">ERC-721_MAINNET</span>
                  <div className="flex justify-between items-center opacity-50">
                    <span>Gas_Limit</span>
                    <span>21000</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* MINT BUTTON (BOTTOM RIGHT) */}
            <div className="mt-auto">
              <motion.button
                style={{
                  backgroundColor: useTransform(
                    scrollYProgress,
                    [0.8, 0.9],
                    ["rgba(255,255,255,0.05)", "rgba(139,92,246,1)"],
                  ),
                  color: useTransform(
                    scrollYProgress,
                    [0.8, 0.9],
                    ["rgba(255,255,255,0.3)", "rgba(255,255,255,1)"],
                  ),
                }}
                className="w-full py-3 rounded border border-white/10 font-black uppercase tracking-widest"
              >
                Deploy_To_Forge
              </motion.button>
            </div>
          </div>

          {/* THE MASTER CURSOR */}
          <motion.div
            style={{ x: cursorX, y: cursorY }}
            className="absolute z-[100] pointer-events-none"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M1 1L7 19L10 11L18 8L1 1Z"
                fill="white"
                stroke="black"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
