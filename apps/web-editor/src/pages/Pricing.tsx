import { motion } from "framer-motion";
import { CustomCursor } from "../components/ui/CustomCursor";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "DRAFT",
    price: "0",
    path: "/register", // Or wherever your sign-up is
    specs: [
      "01 Active Project",
      "Standard AI Helper",
      "Mintlay Shared CDN",
      "Read-Only Docs",
    ],
    tag: "Open_Source_Entry",
    buttonText: "Initialize_Draft",
  },
  {
    name: "ARCHITECT",
    price: "49",
    path: "/register", // Or wherever your sign-up is
    specs: [
      "03 Active Slots",
      "Enhanced AI Synthesis",
      "Private CDN Nodes",
      "Community Discord",
    ],
    tag: "Protocol_Start",
    buttonText: "Deploy_Architect",
  },
  {
    name: "INFRASTRUCTURE",
    path: "/register", // Or wherever your sign-up is
    price: "199",
    specs: [
      "Unlimited Slots",
      "Priority AI Synthesis",
      "Custom Protocol Logic",
      "24/7 Node Support",
    ],
    tag: "Professional_Node",
    featured: true,
    buttonText: "Secure_Infrastructure",
  },
  {
    name: "SOVEREIGN",
    path: "/enterprise", // THIS LINKS TO YOUR NEW FORM
    price: "Custom",
    specs: [
      "Private AI Training",
      "Immutable White-label",
      "Governance Voting",
      "Dedicated Architect",
    ],
    tag: "Enterprise_Identity",
    buttonText: "Request_Handshake",
  },
];

export default function Pricing() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <CustomCursor />
      <section className="pt-40 pb-24 px-8 md:px-12 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="mb-24 border-l-2 border-purple-600 pl-8">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.6em]">
            Tier_Assessment // 2026
          </span>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase mt-4 leading-none">
            System_Access<span className="text-purple-600">.</span>
          </h1>
        </div>

        {/* 4-COLUMN PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 border ${
                tier.featured
                  ? "border-purple-500 bg-purple-500/5 shadow-[0_0_40px_rgba(139,92,246,0.1)]"
                  : "border-white/5 bg-zinc-900/10"
              } rounded-sm flex flex-col group hover:border-white/20 transition-all duration-500`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-6 bg-purple-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Optimal_Selection
                </span>
              )}

              <div className="mb-10">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                  {tier.tag}
                </span>
                <h3 className="text-2xl font-black mt-2 italic tracking-tighter text-white group-hover:text-purple-400 transition-colors">
                  {tier.name}
                </h3>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black tracking-tighter">
                    {tier.price === "Custom" ? tier.price : `$${tier.price}`}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-zinc-600 font-mono text-[9px] ml-2 uppercase tracking-widest">
                      / Month
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {tier.specs.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-start gap-3 text-[9px] text-zinc-500 uppercase tracking-[0.2em] leading-tight"
                  >
                    <div className="w-1 h-1 bg-purple-600 mt-1 shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>

              <Link to={tier.path} className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 text-[9px] font-black uppercase tracking-[0.4em] transition-all border ${
                    tier.featured
                      ? "bg-white text-black border-white hover:bg-transparent hover:text-white"
                      : "bg-transparent text-white border-white/10 hover:border-purple-500 hover:text-purple-500"
                  }`}
                >
                  {tier.buttonText}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM METADATA */}
        <div className="mt-32 flex justify-between items-center border-t border-white/5 pt-8 font-mono text-[8px] text-zinc-700 uppercase tracking-[0.5em]">
          <span>All_Tiers_Include_SSL_Encryption</span>
          <span className="hidden md:block">
            Immutable_Protocol_Standards // v4.0.1
          </span>
          <span>Secure_Origin_Verified</span>
        </div>
      </section>
    </main>
  );
}
