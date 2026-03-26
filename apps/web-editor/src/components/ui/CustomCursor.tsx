import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
  const [hovered, setHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  // Inside CustomCursor.tsx

  // Smooth spring physics for a high-end feel
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const sx = useSpring(cursorX, springConfig);
  const sy = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      setHovered(!!target.closest("button, .cursor-crosshair, a"));
      document.body.style.cursor = "none";
      return () => {
        document.body.style.cursor = "auto"; // Restore default mouse on unmount
      };
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 1. HORIZONTAL ENDLESS LINE (X-AXIS) */}
      <motion.div
        style={{ y: sy }}
        animate={{
          backgroundColor: hovered
            ? "rgba(139, 92, 246, 0.5)"
            : "rgba(255, 255, 255, 0.1)",
        }}
        className="absolute left-0 right-0 h-[1px] w-full"
      />

      {/* 2. VERTICAL ENDLESS LINE (Y-AXIS) */}
      <motion.div
        style={{ x: sx }}
        animate={{
          backgroundColor: hovered
            ? "rgba(139, 92, 246, 0.5)"
            : "rgba(255, 255, 255, 0.1)",
        }}
        className="absolute top-0 bottom-0 w-[1px] h-full"
      />

      {/* 3. CENTRAL HUB (The Pointer) */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        {/* The Core Dot */}
        <motion.div
          animate={{
            scale: hovered ? 1.5 : 1,
            backgroundColor: hovered ? "#8b5cf6" : "#fff",
          }}
          className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
        />

        {/* Floating ID Tag */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: 15, y: 15 }}
          className="absolute whitespace-nowrap bg-black/80 px-2 py-1 border border-white/10 rounded"
        >
          <span className="text-[7px] font-mono text-purple-400 tracking-tighter uppercase">
            System_Focus_Active
          </span>
        </motion.div>

        {/* Subtle Ring */}
        <motion.div
          animate={{ scale: hovered ? 3 : 0.8, opacity: hovered ? 0.8 : 0.2 }}
          className="absolute w-6 h-6 border border-white rounded-full"
        />
      </motion.div>
    </div>
  );
};
