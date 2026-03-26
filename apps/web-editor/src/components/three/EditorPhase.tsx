import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const EditorPhase = ({ scrollY }: { scrollY: any }) => {
  // 1. Explicitly type the ref to a THREE.Group
  const laptopRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // 2. The Guard Clause: If laptopRef.current is null, exit the function early.
    // This satisfies the TS(18047) error.
    if (!laptopRef.current) return;

    const progress = scrollY.get();

    // Scale Logic: Appear between 45% and 60% scroll, vanish after 85%
    const appearance = THREE.MathUtils.smoothstep(progress, 0.45, 0.6);
    const disappearance = 1 - THREE.MathUtils.smoothstep(progress, 0.85, 0.95);

    const finalScale = appearance * disappearance;

    // Now TypeScript knows laptopRef.current is NOT null here
    laptopRef.current.scale.setScalar(finalScale * 1.8);

    // Slow cinematic rotation
    laptopRef.current.rotation.y =
      state.clock.getElapsedTime() * 0.3 + progress * 2;
  });

  return (
    <group ref={laptopRef}>
      {/* Placeholder: A high-end dark mesh to represent the laptop.
         We'll replace this with your real model later.
      */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.2, 2.5]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, -1.2]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[4, 2.5, 0.1]} />
        <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};
