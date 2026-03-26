import { motion, MotionValue } from "framer-motion";
import Balatro from "../../reactbits/Balatro";
import Dither from "../../reactbits/Dither";

interface HeroProps {
  scrollYProgress: MotionValue<number>;
}

export const Hero = ({ scrollYProgress }: HeroProps) => {
  return (
    <section className="relative min-h-screen bg-transparent overflow-hidden flex flex-col z-10">
      {/* 1. DITHER BACKGROUND LAYER */}
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-60">
        <Dither
          // Dark Purple/Indigo tones to match your reference
          waveColor={[0.15, 0.05, 0.3]}
          disableAnimation={false}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.4}
          waveFrequency={5}
          waveSpeed={0.02}
        />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 relative flex items-center justify-center px-12 z-10">
        {/* Floating Description (Left) */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-[300px]">
          <p className="text-[11px] leading-relaxed uppercase tracking-wide text-zinc-500 font-mono">
            Mintlay provides a decentralized <br /> workspace for digital
            architects.
          </p>
        </div>

        {/* The Center Asset Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-[400px] h-[400px]"
        />

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 right-12">
          {/* ... your existing SVG code ... */}
        </div>
      </div>

      {/* 3. THE MASSIVE FOOTER TITLE */}
      <div className="w-full px-4 pb-4 z-10">
        <h1 className="text-[22vw] leading-[0.8] font-black uppercase tracking-tighter text-white border-b-4 border-white inline-block w-full mix-blend-difference">
          MINTLAY
        </h1>
      </div>
    </section>
  );
};
