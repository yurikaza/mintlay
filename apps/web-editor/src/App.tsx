"use client";
import { MotionValue, useScroll } from "framer-motion";
import { Hero } from "./components/sections/landing/Hero";
import { Protocol } from "./components/sections/landing/Protocol";
import { GlobalScene } from "./components/three/GlobalScene";
import { Showcase } from "./components/sections/landing/Showcase";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative bg-black">
      {/* 1. The 3D background */}
      <GlobalScene scrollYProgress={scrollYProgress} />

      {/* 2. The UI Layers */}
      <Hero scrollYProgress={scrollYProgress} />
      <Protocol scrollYProgress={scrollYProgress} />
      <Showcase />
    </main>
  );
}
