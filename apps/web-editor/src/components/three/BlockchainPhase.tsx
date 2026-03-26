import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";

export const BlockchainPhase = ({ scrollY }: { scrollY: any }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const progress = scrollY.get();
    const time = state.clock.getElapsedTime();

    // 1. LIQUID MOTION:
    // We rotate it slowly, but the "DistortMaterial" handles the wobbling.
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.z = time * 0.1;

    // 2. SCROLL TRANSITION:
    // As you scroll, the liquid "evaporates" (scales down and fades)
    const activeRange = 1 - THREE.MathUtils.smoothstep(progress, 0.2, 0.45);
    meshRef.current.scale.setScalar(activeRange * 2.5); // Adjust size here

    // 3. SHAPE SHIFT:
    // Make it more "Oval" by stretching the Y axis
    meshRef.current.scale.y = activeRange * 3.5;

    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.opacity = activeRange;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* High detail sphere (64x64) makes the liquid look smooth */}
      <sphereGeometry args={[1, 64, 64]} />

      {/* MeshDistortMaterial is a "Magic" material from Drei 
        that handles the liquid wobble automatically.
      */}
      <MeshDistortMaterial
        color="#2b0057" // Deep Purple Base
        emissive="#4b0082" // Purple Glow
        emissiveIntensity={2}
        roughness={0} // Highly reflective like liquid
        metalness={1} // Metallic look
        distort={0.5} // Strength of the liquid wobble
        speed={2} // Speed of the liquid ripples
        transparent
      />
    </mesh>
  );
};
