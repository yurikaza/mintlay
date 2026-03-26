import { motion, MotionValue } from "framer-motion";

interface HeroProps {
  scrollYProgress: MotionValue<number>;
}

export const Hero = ({ scrollYProgress }: HeroProps) => {
  return (
    <section className="relative min-h-screen bg-transparent overflow-hidden flex flex-col z-10">
      <div className="flex-1 relative flex items-center justify-center px-12">
        {/* Floating Description (Left) */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-[300px]">
          <p className="text-[11px] leading-relaxed uppercase tracking-wide text-zinc-400">
            Mintlay provides a decentralized <br /> workspace for digital
            architects.
          </p>
        </div>

        {/* Top Centered Description */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 max-w-[300px] text-center">
          <p className="text-[11px] leading-relaxed uppercase tracking-wide text-zinc-400 font-mono">
            EST. 2026 // PROTOCOL V.1
          </p>
        </div>

        {/* The Hero Asset Frame (Center) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-[400px] h-[400px] flex items-center justify-center"
        >
          {/* The 3D Cube is actually behind this in the GlobalScene.
             This empty div ensures our layout remains consistent.
          */}
        </motion.div>

        {/* Scroll Indicator (Bottom Right) */}
        <div className="absolute bottom-12 right-12">
          <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group cursor-pointer hover:border-mint transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-y-1 transition-transform"
            >
              <path
                d="M7 13l5 5 5-5M12 6v12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. The Massive Footer Title */}
      <div className="w-full px-4 pb-4">
        <h1 className="text-[22vw] leading-[0.8] font-black uppercase tracking-tighter text-white border-b-4 border-white inline-block w-full mix-blend-difference">
          MINTLAY
        </h1>
      </div>
    </section>
  );
};
