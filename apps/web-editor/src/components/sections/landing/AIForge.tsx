import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Dither from "../../reactbits/Dither";

export const AIForge = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // AI "Neural" pulse effect
  const neuralGlow = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    [0.1, 0.8, 0.2],
  );

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-black">
      {/* 1. DEEP NEURAL PURPLE BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Dither
          waveColor={[0.15, 0.02, 0.35]} // Back to the dark pearl pearl
          disableAnimation={false}
          colorNum={6}
          waveAmplitude={0.4}
          waveFrequency={10}
          waveSpeed={0.03}
        />
        <motion.div
          style={{ opacity: neuralGlow }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#8b5cf6_0%,transparent_70%)] blur-[150px]"
        />
      </div>

      {/* 2. THE STICKY COMMAND CENTER */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center z-10 p-4 md:p-12 gap-20">
        {/* --- LEFT SIDE: THE EXPLANATION --- */}
        <div className="w-1/3 space-y-24 z-20">
          {/* Act 1: The AI Foundation */}
          <motion.div
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0, 0.1, 0.25, 0.35],
                [0, 1, 1, 0],
              ),
            }}
          >
            <span className="text-[10px] font-mono text-purple-500 uppercase tracking-widest mb-2 block">
              System Phase // 03
            </span>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">
              AI_Forge<span className="text-purple-500">.</span>
            </h2>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed uppercase mt-4">
              Our proprietary builder integrates Google's Gemini Pro API to turn
              intent into immutable architecture.
            </p>
          </motion.div>

          {/* Act 2: Gemini Integration */}
          <motion.div
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0.4, 0.5, 0.65, 0.75],
                [0, 1, 1, 0],
              ),
            }}
          >
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              Real-Time <br /> Synthesis<span className="text-blue-500">.</span>
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed uppercase mt-4">
              Gemini translates prompts into React code, Solidity contracts, and
              design tokens instantly.
            </p>
          </motion.div>
        </div>

        {/* --- CENTER: THE AI WORKSPACE --- */}
        <div className="flex-1 relative aspect-video flex items-center justify-center">
          {/* ACT 1: GEMINI INPUT BAR (0% - 40%) */}
          <motion.div
            style={{
              scale: useTransform(scrollYProgress, [0.05, 0.1], [0.8, 1]),
              opacity: useTransform(scrollYProgress, [0.35, 0.45], [1, 0]),
              filter: `blur(${useTransform(scrollYProgress, [0.3, 0.45], [0, 20])}px)`,
            }}
            className="absolute z-50 w-full max-w-2xl p-[1px] rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
          >
            <div className="bg-black/90 rounded-full px-8 py-5 flex items-center gap-4">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse" />
              <div className="flex-1 text-zinc-400 font-mono text-sm tracking-tight italic">
                <TypewriterText progress={scrollYProgress} />
              </div>
            </div>
          </motion.div>

          {/* ACT 2: THE GENERATED OUTPUT (50% - 100%) */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.45, 0.6], [0, 1]),
              scale: useTransform(scrollYProgress, [0.45, 0.6], [0.9, 1]),
              filter: `blur(${useTransform(scrollYProgress, [0.45, 0.5], [10, 0])}px)`,
            }}
            className="w-full max-w-5xl aspect-video border border-white/10 rounded-2xl bg-[#030303]/80 backdrop-blur-3xl overflow-hidden flex"
          >
            {/* Left: Code Output (Solidity Contract + React) */}
            <div className="w-[350px] border-r border-white/5 p-8 font-mono text-[9px] text-purple-300 space-y-2 overflow-hidden bg-black/40">
              <p className="text-zinc-600 uppercase tracking-widest text-[7px] mb-4">
                _mintlay_engine // Gemini_Response
              </p>
              <CodeStream progress={scrollYProgress} />
            </div>

            {/* Right: Visual Result */}
            <div className="flex-1 relative p-12 flex flex-col items-center justify-center bg-[#050505]">
              <div className="absolute top-6 left-6 flex gap-1.5 opacity-10">
                <div className="w-2 h-2 rounded-full bg-white" />
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <motion.div
                style={{
                  y: useTransform(scrollYProgress, [0.7, 0.85], [20, 0]),
                }}
                className="text-center"
              >
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Genesis_NFTs
                </h3>
                <p className="text-[10px] text-purple-300 mt-2">
                  DEPLOYING: ERC-721 HANDSHAKE
                </p>
                <motion.button
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [0.92, 0.98],
                      [0, 1],
                    ),
                  }}
                  className="mt-8 px-12 py-3 bg-purple-600 text-white font-bold rounded-full shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                >
                  Verify Mint on Mainnet
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Helper Components for Animation ---

const TypewriterText = ({ progress }: { progress: any }) => {
  const text =
    "Build a luxury NFT marketplace with dark purple glassmorphism and real-time smart contract integration";
  const textX = useSpring(useTransform(progress, [0.05, 0.3], [0, -750]), {
    stiffness: 100,
    damping: 20,
  });

  return (
    <div className="overflow-hidden whitespace-nowrap mask-gradient w-full relative">
      <motion.span style={{ x: textX }} className="inline-block relative">
        {text}
        {/* Virtual Cursor */}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute -right-2 top-0 bottom-0 w-[2px] bg-purple-500"
        />
      </motion.span>
    </div>
  );
};

const CodeStream = ({ progress }: { progress: any }) => {
  const lines = [
    "<Contract_Header id='0x71...'><// Solidity //> ",
    "  <// Define ERC-721 Collection //>",
    "  contract LuxuryNFTs is ERC721 {'{'}",
    "    string public collection_name = 'Genesis_NFTs';",
    "    uint256 public constant MINT_PRICE = 0.5 ether;",
    "  {'}'}",
    "<// End Contract //>",
    "export const App = () => { <// React //>",
    "  return (",
    "    <MintContainer theme='luxury_purple'>",
    "      <NFTGallery contractId='LuxuryNFTs' />",
    "    </MintContainer>",
    "  );",
    "};",
  ];
  return (
    <>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className={
            line.includes("<//")
              ? "text-zinc-600"
              : line.includes("ether")
                ? "text-white"
                : "text-purple-300"
          }
          style={{
            opacity: useTransform(
              progress,
              [0.55 + i * 0.02, 0.6 + i * 0.02],
              [0, 1],
            ),
          }}
        >
          {line}
        </motion.p>
      ))}
    </>
  );
};
