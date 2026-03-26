import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

export const BlockchainPhase = ({ scrollY }: { scrollY: any }) => {
  const obj = useLoader(OBJLoader, "/Cube.obj");
  const groupRef = useRef<THREE.Group>(null);

  const blocksData = useMemo(() => {
    return obj.children.map((child) => ({
      originalPos: child.position.clone(),
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
      ),
      rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
    }));
  }, [obj]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const progress = scrollY.get();

    // Shatter starts at 15% scroll and finishes by 40%
    const disperseFactor = THREE.MathUtils.smoothstep(progress, 0.15, 0.4);

    // Idle floating animation for Hero
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    groupRef.current.rotation.y += 0.002;

    groupRef.current.children.forEach((child, i) => {
      const data = blocksData[i];
      if (!data) return;

      child.position.x = data.originalPos.x + data.dir.x * disperseFactor;
      child.position.y = data.originalPos.y + data.dir.y * disperseFactor;
      child.position.z = data.originalPos.z + data.dir.z * disperseFactor;

      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        // Fade out as the blocks fly away
        mat.opacity = 1 - THREE.MathUtils.smoothstep(progress, 0.35, 0.45);
        mat.color = new THREE.Color("#00ffcc");
      }
    });
  });

  return <primitive ref={groupRef} object={obj} scale={0.06} />;
};
