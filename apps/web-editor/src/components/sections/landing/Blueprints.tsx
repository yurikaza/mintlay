import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const blueprints = [
  {
    id: "01",
    title: "THE MOVEMENT",
    category: "Community & DAO",
    description:
      "Built for scale. High-contrast typography with integrated membership forms and decentralized governance hooks.",
  },
  {
    id: "02",
    title: "GENESIS DROP",
    category: "ERC-721 Launchpad",
    description:
      "Immersive gallery layouts optimized for high-volume minting phases with built-in gas optimization.",
  },
  {
    id: "03",
    title: "LIQUIDITY",
    category: "DeFi Protocol",
    description:
      "Data-dense, minimalist financial interfaces. Real-time chart integration and secure wallet routing.",
  },
];

export const Blueprints = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#020202]">
      {/* STICKY CONTAINER */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* SECTION HEADER */}
        <div className="px-8 md:px-24 mb-12">
          <span className="text-[10px] font-mono text-purple-500 tracking-[0.4em] uppercase">
            Phase 05 // Infrastructure
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mt-4">
            Architectural <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-zinc-600">
              Blueprints.
            </span>
          </h2>
        </div>

        {/* HORIZONTAL SCROLL TRACK */}
        <motion.div
          style={{ x }}
          className="flex gap-12 px-8 md:px-24 w-[300vw]"
        >
          {blueprints.map((blueprint) => (
            <div
              key={blueprint.id}
              className="relative w-[80vw] md:w-[45vw] h-[50vh] flex-shrink-0 group"
            >
              {/* THE GLASS CARD */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl bg-[#080808] overflow-hidden transition-colors duration-500 group-hover:border-purple-500/50">
                {/* Simulated UI inside the card */}
                <div className="absolute inset-4 border border-white/5 bg-black rounded-xl p-8 flex flex-col justify-between overflow-hidden">
                  {/* Abstract UI Elements */}
                  <div className="flex justify-between items-start opacity-50">
                    <div className="w-12 h-4 bg-white/20 rounded-full" />
                    <div className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500/50" />
                      <div className="w-4 h-4 rounded-full bg-white/20" />
                    </div>
                  </div>

                  {/* Massive Typography inside the template */}
                  <div className="text-center transform transition-transform duration-700 group-hover:scale-105">
                    <h3 className="text-4xl md:text-6xl font-black text-white/10 uppercase tracking-tighter">
                      {blueprint.title}
                    </h3>
                  </div>

                  {/* Footer UI */}
                  <div className="w-full h-12 border border-white/10 rounded-lg bg-white/5 mt-auto flex items-center px-4">
                    <div className="w-1/3 h-2 bg-purple-500/40 rounded-full" />
                  </div>
                </div>
              </div>

              {/* OUTSIDE CARD INFO */}
              <div className="absolute -bottom-16 left-0 right-0 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-500">
                      [{blueprint.id}]
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      {blueprint.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase mt-2 max-w-xs leading-relaxed">
                    {blueprint.description}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full bg-purple-500/10">
                  {blueprint.category}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
