import { MotionValue, useScroll } from "framer-motion";
import { useRef } from "react";
import { ProtocolScene } from "../../three/ProtocolScene";

interface ProtocolProps {
  scrollYProgress: MotionValue<number>;
}

export const Protocol = ({ scrollYProgress }: ProtocolProps) => {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <ProtocolScene scrollYProgress={scrollYProgress} />

      {/* HTML Content Overlay */}
      <div className="relative z-10">
        <div className="h-screen flex items-center px-20">
          <div className="max-w-xl">
            <h2 className="text-8xl font-black italic uppercase tracking-tighter">
              01_The_Block
            </h2>
            <p className="text-zinc-500 font-mono mt-4">
              REPRESENTING THE FRAGMENTED STATE OF WEB3 INFRASTRUCTURE.
            </p>
          </div>
        </div>

        <div className="h-screen flex items-center justify-end px-20">
          <div className="max-w-xl text-right">
            <h2 className="text-8xl font-black italic uppercase tracking-tighter">
              02_The_Editor
            </h2>
            <p className="text-zinc-500 font-mono mt-4">
              A HIGH-FIDELITY WORKSPACE FOR DECENTRALIZED DESIGNERS.
            </p>
          </div>
        </div>

        <div className="h-screen flex items-center px-20">
          <div className="max-w-xl">
            <h2 className="text-8xl font-black italic uppercase tracking-tighter">
              03_The_Artifact
            </h2>
            <p className="text-zinc-500 font-mono mt-4">
              YOUR PROJECT IS NOW A PERMANENT, MINTED NODE ON THE ETHEREUM
              NETWORK.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
