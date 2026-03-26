import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

const BlockchainPhase = ({ scrollY }: { scrollY: any }) => {
  // 1. Load the OBJ file (Ensure Cube.obj is in /public)
  const obj = useLoader(OBJLoader, "/Cube.obj");
  const groupRef = useRef<THREE.Group>(null);

  // 2. Prepare random movement data for each sub-mesh in the OBJ
  const blocksData = useMemo(() => {
    // OBJ files usually have children directly under the main object
    const children = obj.children || [];
    return children.map((child) => ({
      originalPos: child.position.clone(),
      // Explode outward with a slight spin
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
      ),
      rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
    }));
  }, [obj]);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scrollY.get();

    // Animation timing: shatter happens between 5% and 35% scroll
    const disperseFactor = THREE.MathUtils.smoothstep(progress, 0.05, 0.35);

    groupRef.current.children.forEach((child, i) => {
      const data = blocksData[i];
      if (!data) return;

      // Position: Start at center, move to random dir based on scroll
      child.position.x = data.originalPos.x + data.dir.x * disperseFactor;
      child.position.y = data.originalPos.y + data.dir.y * disperseFactor;
      child.position.z = data.originalPos.z + data.dir.z * disperseFactor;

      // Rotation: Add a chaotic spin as they fly
      child.rotation.x += disperseFactor * data.rot.x * 0.04;
      child.rotation.y += disperseFactor * data.rot.y * 0.04;

      // Fade out effect
      if (child instanceof THREE.Mesh) {
        // OBJs don't always come with transparent materials, so we force it
        child.material.transparent = true;
        child.material.opacity =
          1 - THREE.MathUtils.smoothstep(progress, 0.3, 0.4);

        // Let's give them that neon glow
        if (
          child.material instanceof THREE.MeshStandardMaterial ||
          child.material instanceof THREE.MeshPhongMaterial
        ) {
          child.material.color = new THREE.Color("#00ffcc");
          // If using Standard material, we can add emissive glow
          if ("emissive" in child.material) {
            child.material.emissive = new THREE.Color("#00ffcc");
            child.material.emissiveIntensity = disperseFactor * 4;
          }
        }
      }
    });
  });

  // OBJ files often need a significant scale boost depending on export units
  return <primitive ref={groupRef} object={obj} scale={0.05} />;
};

export const ProtocolScene = ({
  scrollYProgress,
}: {
  scrollYProgress: any;
}) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={35} />

          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={3} color="#00ffcc" />

          <BlockchainPhase scrollY={scrollYProgress} />

          <Environment preset="night" />
          <ContactShadows
            position={[0, -5, 0]}
            opacity={0.4}
            scale={30}
            blur={2.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
