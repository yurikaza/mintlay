import React from "react";
import { LegalLayout } from "../../components/layout/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      title="Terms"
      subtitle="Usage parameters for the Mintlay architectural engine."
      lastUpdated="JAN_2026"
    >
      <div className="space-y-8">
        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          01 / Core_License
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          Usage of the Mintlay engine is granted under a single-node license.
          Reverse engineering of the AI synthesis core is strictly prohibited
          under the Sovereign Handshake agreement.
        </p>

        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          02 / Liability
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          The architect is solely responsible for the structural integrity of
          deployed web instances. Mintlay is a tool for synthesis, not a final
          authority on code compliance.
        </p>
      </div>
    </LegalLayout>
  );
}
