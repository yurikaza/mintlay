import { motion, type MotionProps } from "framer-motion";
import type { HTMLAttributes } from "react";

// Create a combined type to satisfy React 19
type MotionHeadingProps = MotionProps & HTMLAttributes<HTMLHeadingElement>;
type MotionSpanProps = MotionProps & HTMLAttributes<HTMLSpanElement>;

export const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group cursor-none">
      {/* Main Text */}
      <motion.h1
        {...({
          className:
            "relative z-10 text-8xl font-black italic uppercase tracking-tighter text-white",
          whileHover: { x: -2, y: 1 },
        } as MotionHeadingProps)}
      >
        {text}
      </motion.h1>

      {/* Red Glitch Layer */}
      <motion.span
        {...({
          className:
            "absolute top-0 left-0 z-0 text-8xl font-black italic uppercase tracking-tighter text-[#ff0055] opacity-0 group-hover:opacity-70",
          animate: { x: [0, -4, 2, 0], y: [0, 2, -2, 0] },
          transition: { repeat: Infinity, duration: 0.1 },
        } as MotionSpanProps)}
      >
        {text}
      </motion.span>

      {/* Cyan Glitch Layer */}
      <motion.span
        {...({
          className:
            "absolute top-0 left-0 z-0 text-8xl font-black italic uppercase tracking-tighter text-mint opacity-0 group-hover:opacity-70",
          animate: { x: [0, 4, -2, 0], y: [0, -2, 2, 0] },
          transition: { repeat: Infinity, duration: 0.1, delay: 0.05 },
        } as MotionSpanProps)}
      >
        {text}
      </motion.span>
    </div>
  );
};
