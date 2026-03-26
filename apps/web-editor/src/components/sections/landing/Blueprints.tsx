import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Dither from "../../reactbits/Dither";
import { CustomCursor } from "../../ui/CustomCursor";

const blueprints = [
  {
    id: "01",
    title: "THE_MOVEMENT",
    code: "const DAO = () => <Gov alpha={0.8} />",
    details: {
      framework: "REACT 19 / NEXT.JS",
      protocol: "ERC-20 VOTING",
      latency: "14ms GATEWAY",
      engine: "GEMINI_PRO_V4",
    },
    abstract:
      "A high-performance community engine designed for rapid organizational scaling and transparent governance.",
  },
  {
    id: "02",
    title: "GENESIS_NFT",
    code: "contract NFT is ERC721 { ... }",
    details: {
      framework: "SOLIDITY 0.8.20",
      protocol: "ERC-721A (GAS OPTIMIZED)",
      latency: "8ms RPC",
      engine: "GEMINI_CODER",
    },
    abstract:
      "Optimized for high-concurrency minting events. Features built-in IPFS routing and automated metadata forging.",
  },
  {
    id: "03",
    title: "DEFI_GRID",
    code: "useSwap(tokenA, tokenB, slippage)",
    details: {
      framework: "TYPESCRIPT / WAGMI",
      protocol: "UNISWAP_V3_SDK",
      latency: "22ms LIQUIDITY",
      engine: "GEMINI_ANALYTICS",
    },
    abstract:
      "A data-dense liquidity interface with real-time slippage calculation and multi-wallet bridging protocols.",
  },
];

export const Blueprints = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      {" "}
      <CustomCursor />
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        {" "}
        {/* SECTION HEADER: MINIMALIST */}
        <div className="px-16 mb-12 flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono text-purple-600 uppercase tracking-[0.6em]">
              Infrastructure // Library
            </span>
            <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic mt-2">
              System_Assets<span className="text-purple-600">.</span>
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-zinc-600 font-mono uppercase">
              Total_Modules: 03
            </p>
            <p className="text-[10px] text-zinc-600 font-mono uppercase">
              Sync_Status: Optimized
            </p>
          </div>
        </div>
        {/* HORIZONTAL TRACK */}
        <motion.div style={{ x }} className="flex gap-24 px-16 w-[300vw]">
          {blueprints.map((item, idx) => (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative w-[850px] h-[520px] flex-shrink-0 cursor-crosshair"
            >
              {/* THE BLUEPRINT CARD */}
              <div className="absolute inset-0 bg-[#050505] border border-white/5 rounded-lg overflow-hidden flex shadow-2xl transition-colors duration-700 group">
                {/* 1. LEFT SIDE: THE VISUAL/DITHER SIDE */}
                <div className="w-1/3 border-r border-white/5 relative bg-black">
                  <div
                    className={`absolute inset-0 transition-opacity duration-1000 ${hoveredIndex === idx ? "opacity-30" : "opacity-10"}`}
                  >
                    <Dither
                      waveColor={[0.4, 0.1, 0.8]}
                      colorNum={2}
                      waveSpeed={0.02}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] font-black text-white/5 select-none">
                      {item.id}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase">
                      Status: Ready
                    </span>
                    <div className="w-12 h-[1px] bg-purple-500/50" />
                  </div>
                </div>

                {/* 2. RIGHT SIDE: THE DATA SIDE */}
                <div className="flex-1 p-12 flex flex-col">
                  {/* Top Bar: Specs */}
                  <div className="grid grid-cols-2 gap-8 mb-12 border-b border-white/5 pb-8">
                    {Object.entries(item.details).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                          {key}
                        </span>
                        <span className="text-[10px] text-zinc-300 font-bold mt-1 uppercase tracking-tight">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Center: Headline & Abstract */}
                  <div className="flex-1">
                    <h3 className="text-6xl font-black text-white tracking-tighter leading-none mb-6">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 uppercase leading-relaxed tracking-wider max-w-md">
                      {item.abstract}
                    </p>
                  </div>

                  {/* Bottom: Interactive Code Trigger */}
                  <div className="mt-auto flex items-end justify-between">
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono text-purple-500 uppercase tracking-widest">
                        Active_Synthesis_Logic:
                      </span>
                      <div className="p-3 bg-black rounded border border-white/5 font-mono text-[10px] text-purple-300/80">
                        {item.code}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded"
                    >
                      Initialize_Build
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* OUTSIDE DECORATION: Blueprint Dimensions */}
              <div className="absolute -top-6 left-0 text-[8px] font-mono text-zinc-800 uppercase tracking-[0.5em]">
                W: 850PX // H: 520PX // SCALE: 1.0
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
