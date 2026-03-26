import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import {
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { BlockchainPhase } from "./BlockchainPhase";
import { EditorPhase } from "./EditorPhase";
import * as THREE from "three";

export const GlobalScene = ({ scrollYProgress }: { scrollYProgress: any }) => {
  return (
    <div className="fixed inset-0 z-[0] pointer-events-none bg-[#05000a]">
      {/* 1. Added a very dark purple-black background hex */}

      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={35} />

          {/* 2. Ambient Light: Deep Indigo base so shadows aren't pure black */}
          <ambientLight intensity={0.2} color="#2b0057" />

          {/* 3. Key Light: The "Hero" Purple Light */}
          <pointLight
            position={[10, 10, 10]}
            intensity={5}
            color="#8a2be2" // Blue-Violet
            decay={2}
          />

          {/* 4. Rim Light: Deep Magenta/Purple from the side to catch the cube edges */}
          <spotLight
            position={[-15, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={3}
            color="#4b0082" // Indigo
          />

          {/* 5. Fill Light: A subtle teal or cold blue to contrast the purple (Optional) */}
          <pointLight position={[0, -5, 5]} intensity={0.5} color="#00ffff" />

          <BlockchainPhase scrollY={scrollYProgress} />
          <EditorPhase scrollY={scrollYProgress} />

          {/* 6. Environment: "Night" preset helps keep reflections dark and moody */}
          <Environment preset="night" />

          {/* 7. Shadows: Soft purple shadows on the floor */}
          <ContactShadows
            position={[0, -6, 0]}
            opacity={0.4}
            scale={40}
            blur={2}
            far={10}
            color="#1a0033"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
