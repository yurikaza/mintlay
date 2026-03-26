import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { useEffect } from "react";
import Home from "./pages/Home";

export default function App() {
  // This hook forces the page to refresh its scroll position
  // so Framer Motion knows where the "water" is.
  useLenis(({ scroll }) => {
    // Optional: add custom logic here if needed
  });

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1 }}>
      <main className="bg-black">
        <Home />
      </main>
    </ReactLenis>
  );
}
