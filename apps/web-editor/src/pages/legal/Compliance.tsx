import React from "react";
import { LegalLayout } from "../../components/layout/LegalLayout";

export default function Compliance() {
  return (
    <LegalLayout
      title="Compliance"
      subtitle="Regulatory adherence and structural standard verification."
      lastUpdated="FEB_2026"
    >
      <div className="space-y-8">
        <h3 className="text-lg font-black uppercase tracking-widest text-white">
          01 / Global_Standards
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed tracking-wide">
          Mintlay architecture complies with GDPR, CCPA, and SOC2 Type II
          standards. Our deployment engine automatically injects required
          compliance headers into every blueprint.
        </p>

        <div className="p-6 border border-white/5 bg-zinc-900/20 font-mono text-[10px] text-zinc-500">
          VERIFICATION_ID: 8829-X-MINTLAY <br />
          STATUS: FULLY_COMPLIANT <br />
          REGION: GLOBAL_EDGE
        </div>
      </div>
    </LegalLayout>
  );
}
