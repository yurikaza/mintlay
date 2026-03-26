import { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

export const EditorPhase = ({ scrollY }: { scrollY: any }) => {
  const obj = useLoader(OBJLoader, "/Laptop.obj");
  const laptopRef = useRef<THREE.Group>(null);

  // Debugging: Log the object scale to the console
  useEffect(() => {
    if (obj) {
      console.log("Laptop Loaded!");
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log("Laptop Original Size:", size);
    }
  }, [obj]);

  useFrame((state) => {
    if (!laptopRef.current) return;

    const progress = scrollY.get();

    // DEBUG: Force it to be visible immediately to see if it's a timing issue
    // Once you see it, change '1' back to 'appearance * disappearance'
    const visibility = 1;

    // Adjust this scale based on what you see in the console log!
    // If 'Original Size' was very small, make this bigger (e.g., 5).
    // If 'Original Size' was huge (e.g., 1000), make this 0.001.
    laptopRef.current.scale.setScalar(0.5);

    laptopRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;

    laptopRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Force a bright color for debugging
        child.material = new THREE.MeshStandardMaterial({
          color: "purple",
          emissive: "purple",
          emissiveIntensity: 2,
          side: THREE.DoubleSide, // Shows both sides of the mesh
        });
      }
    });
  });

  return <primitive ref={laptopRef} object={obj} position={[0, 0, 0]} />;
};
