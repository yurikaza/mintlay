import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Use 'next/link' if using Next.js

export const Footer = () => {
  const footerData = [
    {
      id: "02",
      title: "ECOSYSTEM",
      links: [
        { name: "GOVERNANCE", path: "/governance" },
        { name: "STAKING", path: "/staking" },
        { name: "DAO", path: "/dao" },
        { name: "TOKENOMICS", path: "/tokenomics" },
      ],
    },
    {
      id: "03",
      title: "RESOURCES",
      links: [
        { name: "DOCS", path: "/resources/docs" },
        { name: "WHITEPAPER", path: "/resources/whitepaper" },
        { name: "API", path: "/resources/api" },
        { name: "GITHUB", path: "https://github.com/yurikaza/mintlay" }, // External example
      ],
    },
    {
      id: "04",
      title: "LEGAL",
      links: [
        { name: "PRIVACY", path: "/legal/privacy" },
        { name: "TERMS", path: "/legal/terms" },
        { name: "COMPLIANCE", path: "/legal/compliance" },
        { name: "SECURITY", path: "/legal/security" },
      ],
    },
  ];

  return (
    <footer className="relative bg-black pt-32 pb-16 px-12 md:px-24 overflow-hidden border-t border-white/5">
      {/* BACKGROUND WATERMARK */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none overflow-hidden">
        <h2 className="text-[28vw] font-black text-white/[0.03] leading-none uppercase italic tracking-tighter translate-y-1/4">
          Mintlay
        </h2>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,black_50%)] bg-[length:100%_4px] opacity-20" />
      </div>

      {/* GRID CONTENT */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl">
        {footerData.map((section) => (
          <div
            key={section.id}
            className="flex flex-col border-l border-white/5 pl-8"
          >
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] font-mono text-purple-600 tracking-widest">
                {section.id} /
              </span>
              <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em]">
                {section.title}
              </h4>
            </div>

            <ul className="space-y-6">
              {section.links.map((link) => (
                <li key={link.name}>
                  {/* Logic: If path starts with 'http', use <a>, otherwise use <Link> */}
                  {link.path.startsWith("http") ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.path} className="block">
                      <motion.span
                        whileHover={{ x: 5, color: "#ffffff" }}
                        className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] transition-colors cursor-none"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 mt-40 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
        <p>© 2026 MINTLAY_PROTOCOL // ALL_SYSTEMS_GO</p>
        <div className="flex gap-8">
          <span>LAT: 40.7128° N</span>
          <span>LNG: 74.0060° W</span>
        </div>
      </div>
    </footer>
  );
};
