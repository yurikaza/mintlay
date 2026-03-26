import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { BlockchainPhase } from "./BlockchainPhase";
import { EditorPhase } from "./EditorPhase";
export const GlobalScene = ({ scrollYProgress }: { scrollYProgress: any }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={35} />

          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00ffcc" />

          {/* Phase 1: Cube.obj (Starts in Hero) */}
          <BlockchainPhase scrollY={scrollYProgress} />

          {/* Phase 2: Laptop Forge (Appears in Protocol) */}
          <EditorPhase scrollY={scrollYProgress} />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};
