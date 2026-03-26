"use client";
import { useScroll } from "framer-motion";
import { Hero } from "../components/sections/landing/Hero";
import { Protocol } from "../components/sections/landing/Protocol";
import { AIForge } from "../components/sections/landing/AIForge";
import { Analytics } from "../components/sections/landing/Analytics";
import { Blueprints } from "../components/sections/landing/Blueprints";
import { Ignition } from "../components/sections/landing/Ignition";
import { Footer } from "../components/layout/Footer";

import "./home.css";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative">
      {/* 1. The 3D background */}

      {/* 2. The UI Layers */}
      <Hero />
      <Protocol />
      <AIForge />
      <Analytics />
      <Blueprints />
      <Ignition />
    </main>
  );
}
