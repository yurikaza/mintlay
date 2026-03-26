import React from "react";
import { LegalLayout } from "../../components/layout/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy"
      subtitle="Data sovereignty and immutable user privacy protocols."
      lastUpdated="MAR_2026"
    >
      <div className="space-y-8">
        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          01 / Data_Collection
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          Mintlay operates on a zero-knowledge architecture. We do not store
          personal identifiers. All session data is encrypted at the edge and
          purged upon protocol termination.
        </p>

        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          02 / Sovereignty
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          You retain 100% ownership of all blueprints and architectural logic
          generated within the engine. Mintlay does not claim rights to your
          intellectual constructs.
        </p>
      </div>
    </LegalLayout>
  );
}
