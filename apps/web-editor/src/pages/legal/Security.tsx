import React from "react";
import { LegalLayout } from "../../components/layout/LegalLayout";

export default function Security() {
  return (
    <LegalLayout
      title="Security"
      subtitle="Immutable layer security and encryption handshakes."
      lastUpdated="MAR_2026"
    >
      <div className="space-y-8">
        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          01 / Encryption_Logic
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          All data transitions are secured via AES-256-GCM. Our handshake
          protocol requires multi-layered verification before any architectural
          change is committed to the main branch.
        </p>

        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          02 / Threat_Detection
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          Real-time node monitoring prevents injection attacks. If a breach is
          detected, the affected layer is automatically isolated and rolled back
          to the last known secure state.
        </p>
      </div>
    </LegalLayout>
  );
}
