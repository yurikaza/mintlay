import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Dither from "../../reactbits/Dither";

export const Analytics = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-black">
      {/* 1. THE SIGNATURE PURPLE BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <Dither waveColor={[0.1, 0.0, 0.2]} colorNum={4} waveSpeed={0.01} />
        {/* Subtle grid for a "Financial" look */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-10 p-6 md:p-12">
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <motion.span
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
            className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.5em]"
          >
            Phase 04 // Intelligence
          </motion.span>
          <motion.h2
            style={{
              y: useTransform(scrollYProgress, [0, 0.2], [20, 0]),
              opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
            }}
            className="text-6xl font-black text-white uppercase tracking-tighter italic"
          >
            Protocol <span className="text-zinc-500">Yield.</span>
          </motion.h2>
        </div>

        {/* THE ANALYTICS DASHBOARD FRAME */}
        <div className="relative w-full max-w-6xl aspect-21/9 border border-white/10 rounded-2xl bg-zinc-950/50 backdrop-blur-3xl overflow-hidden flex p-8 gap-8">
          {/* LEFT: VOLUME CHART */}
          <div className="flex-2 border border-white/5 rounded-xl bg-black/40 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">
                  Transaction_Volume
                </p>
                <h4 className="text-2xl font-bold text-white tracking-tighter">
                  1,284.42 ETH
                </h4>
              </div>
              <div className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[8px] font-mono">
                +12.4%
              </div>
            </div>

            {/* THE ANIMATED SVG GRAPH */}
            <svg className="w-full h-32 overflow-visible">
              <motion.path
                d="M 0 100 Q 50 80 100 90 T 200 40 T 300 60 T 400 10 T 500 30 T 600 0"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                style={{
                  pathLength: useTransform(scrollYProgress, [0.2, 0.8], [0, 1]),
                }}
              />
              {/* Gradient glow under the line */}
              <motion.path
                d="M 0 100 Q 50 80 100 90 T 200 40 T 300 60 T 400 10 T 500 30 T 600 0 V 132 H 0 Z"
                fill="url(#purpleGradient)"
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.8], [0, 0.2]),
                }}
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* RIGHT: TREASURY STATUS */}
          <div className="flex-1 space-y-4">
            <div className="h-1/2 border border-white/5 rounded-xl bg-black/40 p-6">
              <p className="text-[10px] text-zinc-500 uppercase mb-4">
                Mint_Success_Rate
              </p>
              <div className="relative h-24 w-24 mx-auto">
                {/* Circular Progress (Radar look) */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#8b5cf6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    style={{
                      strokeDashoffset: useTransform(
                        scrollYProgress,
                        [0.3, 0.7],
                        [251.2, 25.1],
                      ),
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
                  90%
                </div>
              </div>
            </div>

            <div className="h-1/2 border border-purple-500/20 rounded-xl bg-purple-500/5 p-6">
              <p className="text-[10px] text-purple-400 uppercase mb-1">
                Live_Status
              </p>
              <p className="text-[9px] text-zinc-500 font-mono italic">
                Broadcasting to Mainnet...
              </p>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.1,
                    }}
                    className="w-1 bg-purple-500/40 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
