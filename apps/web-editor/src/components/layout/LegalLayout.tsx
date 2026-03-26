import { motion } from "framer-motion";

interface LegalProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalLayout = ({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalProps) => {
  return (
    <section className="pt-40 pb-32 px-8 md:px-24 max-w-5xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-l border-white/10 pl-8 md:pl-16"
      >
        {/* Header Metadata */}
        <div className="mb-20">
          <span className="text-[10px] font-mono text-purple-600 uppercase tracking-[0.6em]">
            Protocol_Documentation // {lastUpdated}
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mt-4 text-white">
            {title}
            <span className="text-purple-600">.</span>
          </h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-[0.3em] mt-6 max-w-md leading-loose">
            {subtitle}
          </p>
        </div>

        {/* Content Area */}
        <div className="prose prose-invert max-w-none space-y-16">
          {children}
        </div>
      </motion.div>
    </section>
  );
};
