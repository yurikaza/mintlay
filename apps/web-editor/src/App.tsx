"use client";
import { useScroll } from "framer-motion";
import { Hero } from "./components/sections/landing/Hero";
import { Protocol } from "./components/sections/landing/Protocol";
import { GlobalScene } from "./components/three/GlobalScene";
import { Showcase } from "./components/sections/landing/Showcase";
import { AIForge } from "./components/sections/landing/AIForge";
import { Analytics } from "./components/sections/landing/Analytics";
import { Manifesto } from "./components/sections/landing/Manifesto";
import { Blueprints } from "./components/sections/landing/Blueprints";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative">
      {/* 1. The 3D background */}
      <div className="fixed inset-0 z-[0]">
        <GlobalScene scrollYProgress={scrollYProgress} />
      </div>

      {/* 2. The UI Layers */}
      <Hero scrollYProgress={scrollYProgress} />
      <Protocol />
      <AIForge />
      <Analytics />
      <Blueprints />
      <Showcase />
    </main>
  );
}
