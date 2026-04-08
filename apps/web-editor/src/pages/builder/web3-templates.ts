// web3-templates.ts — Award-level Web3 website templates
// Design language: dark, editorial, glassmorphism, mesh gradients, bento grids
import type { NodeData, ContractConfig } from "../../types/builder";
import { PRESET_ABIS } from "../../types/builder";
import { MINTLAY_NFT_ABI } from "../../contracts";

// ── Template node definition (uses parentRef index for tree building) ─────────

interface TemplateNodeDef {
  type: string;
  parentRef: number | null;
  props?: Record<string, any>;
  style?: Record<string, string>;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  tagline: string;
  category: "NFT" | "DeFi" | "DAO" | "Token" | "Portfolio" | "Blank";
  description: string;
  thumbnail: { bg: string; accent: string; secondary: string; emoji: string };
  contracts?: Omit<ContractConfig, "id">[];
  pages: Array<{
    name: string;
    slug: string;
    isDynamic?: boolean;
    dynamicParam?: string;
    nodes: TemplateNodeDef[];
  }>;
}

// ── Instantiation helper ──────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();

export function instantiateTemplate(
  template: WebsiteTemplate,
  pageIndex: number,
  overrideParentId: string | null = null,
): NodeData[] {
  const page = template.pages[pageIndex];
  if (!page) return [];
  const ids = page.nodes.map(() => uid());
  return page.nodes.map((def, i) => ({
    id: ids[i],
    type: def.type,
    parentId: def.parentRef === null ? overrideParentId : ids[def.parentRef],
    props: { ...(def.props ?? {}) },
    style: { ...(def.style ?? {}) },
  }));
}

export const TEMPLATE_CATEGORIES = ["All", "NFT", "DeFi", "DAO", "Token", "Portfolio", "Blank"] as const;

// ── Shared design tokens ──────────────────────────────────────────────────────

const GLASS = {
  backgroundColor: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(20px)",
  borderTopWidth: "1px",
  borderRightWidth: "1px",
  borderBottomWidth: "1px",
  borderLeftWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.07)",
  borderRadius: "16px",
};

const GLASS_HOVER = {
  ...GLASS,
  backgroundColor: "rgba(255,255,255,0.05)",
};

const GLOW_PURPLE = { boxShadow: "0 0 40px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.08)" };
const GLOW_CYAN   = { boxShadow: "0 0 40px rgba(34,211,238,0.2), inset 0 1px 0 rgba(255,255,255,0.08)" };
const GLOW_EMERALD = { boxShadow: "0 0 40px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.08)" };
const GLOW_AMBER  = { boxShadow: "0 0 40px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.08)" };

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — NFT NEXUS
// Category: NFT | Colors: #8b5cf6 / #ec4899 / #0a0a0f
// Layout: Full-bleed dark, glassmorphism cards, bento collection grid
// Dynamic page: /nft/:id
// ─────────────────────────────────────────────────────────────────────────────
const NFT_NEXUS_HOME: TemplateNodeDef[] = [
  // 0 — Page root
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#08080f", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" } },

  // ── Ambient glow blobs ──
  // 1 — purple blob top-left
  { type: "Div", parentRef: 0, props: {}, style: { position: "absolute", top: "-200px", left: "-200px", width: "600px", height: "600px", borderRadius: "9999px", backgroundColor: "rgba(139,92,246,0.12)", filter: "blur(120px)", pointerEvents: "none" } },
  // 2 — pink blob top-right
  { type: "Div", parentRef: 0, props: {}, style: { position: "absolute", top: "-100px", right: "-200px", width: "500px", height: "500px", borderRadius: "9999px", backgroundColor: "rgba(236,72,153,0.1)", filter: "blur(100px)", pointerEvents: "none" } },

  // ── NAVBAR ──
  // 3 — Nav
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", paddingBottom: "24px", paddingLeft: "64px", paddingRight: "64px", position: "sticky", top: "0px", zIndex: "100", backgroundColor: "rgba(8,8,15,0.8)", backdropFilter: "blur(20px)", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.06)" } },
  // 4 — Logo
  { type: "H3", parentRef: 3, props: { text: "NEXUS" }, style: { fontSize: "20px", fontWeight: "800", letterSpacing: "-0.04em", background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" } },
  // 5 — Nav links row
  { type: "Div", parentRef: 3, props: {}, style: { display: "flex", alignItems: "center", gap: "32px" } },
  { type: "Link", parentRef: 5, props: { text: "Explore", href: "#" }, style: { color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: "500", textDecoration: "none", cursor: "pointer" } },
  { type: "Link", parentRef: 5, props: { text: "Mint", href: "#" }, style: { color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: "500", textDecoration: "none", cursor: "pointer" } },
  { type: "Link", parentRef: 5, props: { text: "Roadmap", href: "#" }, style: { color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: "500", textDecoration: "none", cursor: "pointer" } },
  // 9 — Connect button
  { type: "Button", parentRef: 3, props: { text: "Connect Wallet" }, style: { display: "inline-flex", alignItems: "center", justifyContent: "center", paddingTop: "10px", paddingRight: "20px", paddingBottom: "10px", paddingLeft: "20px", background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)", color: "#fff", fontSize: "13px", fontWeight: "600", borderRadius: "100px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 20px rgba(139,92,246,0.4)" } },

  // ── HERO ──
  // 10 — Hero section
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "120px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", textAlign: "center", position: "relative" } },
  // 11 — Eyebrow
  { type: "Div", parentRef: 10, props: {}, style: { display: "inline-flex", alignItems: "center", gap: "8px", paddingTop: "6px", paddingBottom: "6px", paddingLeft: "16px", paddingRight: "16px", borderRadius: "100px", backgroundColor: "rgba(139,92,246,0.15)", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(139,92,246,0.3)", marginBottom: "32px" } },
  { type: "Text", parentRef: 11, props: { text: "✦" }, style: { color: "#a78bfa", fontSize: "12px" } },
  { type: "Text", parentRef: 11, props: { text: "Season 2 Now Live" }, style: { color: "#c4b5fd", fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" } },
  // 14 — Hero headline
  { type: "H1", parentRef: 10, props: { text: "Own the\nFuture of Art" }, style: { fontSize: "88px", fontWeight: "900", lineHeight: "0.95", letterSpacing: "-0.04em", color: "#ffffff", marginBottom: "0px", whiteSpace: "pre-line", maxWidth: "800px" } },
  // 15 — Gradient word span
  { type: "Div", parentRef: 10, props: {}, style: { marginTop: "8px", marginBottom: "0px" } },
  { type: "H1", parentRef: 15, props: { text: "On-Chain." }, style: { fontSize: "88px", fontWeight: "900", lineHeight: "1", letterSpacing: "-0.04em", background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", display: "inline-block" } },
  // 17 — Sub
  { type: "Paragraph", parentRef: 10, props: { text: "10,000 generative artworks living permanently on Ethereum. Each piece is a unique 1-of-1, algorithmically composed from 300+ traits." }, style: { fontSize: "18px", lineHeight: "1.6", color: "rgba(255,255,255,0.5)", maxWidth: "560px", marginTop: "32px", marginBottom: "48px" } },
  // 18 — CTA row
  { type: "Div", parentRef: 10, props: {}, style: { display: "flex", alignItems: "center", gap: "16px", justifyContent: "center" } },
  { type: "Button", parentRef: 18, props: { text: "Mint Now — 0.08 ETH" }, style: { display: "inline-flex", alignItems: "center", justifyContent: "center", paddingTop: "16px", paddingRight: "32px", paddingBottom: "16px", paddingLeft: "32px", background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)", color: "#fff", fontSize: "15px", fontWeight: "700", borderRadius: "100px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(236,72,153,0.2)" } },
  { type: "Button", parentRef: 18, props: { text: "View Collection →" }, style: { display: "inline-flex", alignItems: "center", justifyContent: "center", paddingTop: "16px", paddingRight: "32px", paddingBottom: "16px", paddingLeft: "32px", backgroundColor: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "15px", fontWeight: "600", borderRadius: "100px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" } },

  // ── STATS BAR ──
  // 21
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "32px", paddingBottom: "32px", paddingLeft: "64px", paddingRight: "64px", borderTopWidth: "1px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" } },
  { type: "Div", parentRef: 21, props: {}, style: { display: "flex", alignItems: "center", gap: "64px", flexWrap: "wrap", justifyContent: "center" } },
  // Stats items
  { type: "Div", parentRef: 22, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } },
  { type: "H2", parentRef: 23, props: { text: "10,000" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px", lineHeight: "1" } },
  { type: "Text", parentRef: 23, props: { text: "Total Supply" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" } },
  { type: "Div", parentRef: 22, props: {}, style: { width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.1)" } },
  { type: "Div", parentRef: 22, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } },
  { type: "H2", parentRef: 27, props: { text: "8,341" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#a78bfa", marginBottom: "0px", lineHeight: "1" } },
  { type: "Text", parentRef: 27, props: { text: "Minted" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" } },
  { type: "Div", parentRef: 22, props: {}, style: { width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.1)" } },
  { type: "Div", parentRef: 22, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } },
  { type: "H2", parentRef: 31, props: { text: "14.2Ξ" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#f472b6", marginBottom: "0px", lineHeight: "1" } },
  { type: "Text", parentRef: 31, props: { text: "Floor Price" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" } },
  { type: "Div", parentRef: 22, props: {}, style: { width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.1)" } },
  { type: "Div", parentRef: 22, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } },
  { type: "H2", parentRef: 35, props: { text: "3,280" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#fb923c", marginBottom: "0px", lineHeight: "1" } },
  { type: "Text", parentRef: 35, props: { text: "Unique Owners" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" } },

  // ── COLLECTION GRID (bento) ──
  // idx 38 — Section
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", flexDirection: "column", gap: "48px" } },
  // idx 39 — header row
  { type: "Div", parentRef: 38, props: {}, style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
  // idx 40 — left col
  { type: "Div", parentRef: 39, props: {}, style: { display: "flex", flexDirection: "column", gap: "8px" } },
  // idx 41
  { type: "Text", parentRef: 40, props: { text: "FEATURED DROPS" }, style: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: "#a78bfa", textTransform: "uppercase" } },
  // idx 42
  { type: "H2", parentRef: 40, props: { text: "Explore the\nCollection" }, style: { fontSize: "48px", fontWeight: "800", lineHeight: "1.1", letterSpacing: "-0.03em", color: "#ffffff", whiteSpace: "pre-line", marginBottom: "0px" } },
  // idx 43
  { type: "Button", parentRef: 39, props: { text: "View All 10K →" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "10px", paddingRight: "20px", paddingBottom: "10px", paddingLeft: "20px", backgroundColor: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", borderRadius: "100px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.15)" } },
  // idx 44 — Bento grid (4 cols × 2 rows)
  { type: "Grid", parentRef: 38, props: {}, style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" } },

  // ── Card 1 — Genesis Void #001 (hero, 2×2) ── idx 45-58
  // idx 45 — card container
  { type: "Div", parentRef: 44, props: {}, style: { gridColumn: "span 2", gridRow: "span 2", backgroundColor: "rgba(139,92,246,0.08)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(139,92,246,0.2)", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" } },
  // idx 46 — image wrapper
  { type: "Div", parentRef: 45, props: {}, style: { flex: "1", position: "relative", minHeight: "280px", overflow: "hidden" } },
  // idx 47 — image
  { type: "Image", parentRef: 46, props: { src: "https://picsum.photos/seed/nft001/600/600", alt: "Genesis Void #001" }, style: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: "0px" } },
  // idx 48 — gradient overlay
  { type: "Div", parentRef: 46, props: {}, style: { position: "absolute", inset: "0px", background: "linear-gradient(to bottom, transparent 40%, rgba(8,8,15,0.9) 100%)" } },
  // idx 49 — badge wrapper
  { type: "Div", parentRef: 46, props: {}, style: { position: "absolute", top: "16px", left: "16px", paddingTop: "4px", paddingBottom: "4px", paddingLeft: "12px", paddingRight: "12px", backgroundColor: "rgba(139,92,246,0.6)", borderRadius: "100px", backdropFilter: "blur(10px)" } },
  // idx 50 — badge text
  { type: "Text", parentRef: 49, props: { text: "⬟ LEGENDARY" }, style: { fontSize: "10px", fontWeight: "800", color: "#ffffff", letterSpacing: "0.1em" } },
  // idx 51 — info section
  { type: "Div", parentRef: 45, props: {}, style: { padding: "20px 24px 24px" } },
  // idx 52 — bottom row
  { type: "Div", parentRef: 51, props: {}, style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
  // idx 53 — left name col
  { type: "Div", parentRef: 52, props: {}, style: { display: "flex", flexDirection: "column", gap: "2px" } },
  // idx 54 — name
  { type: "H3", parentRef: 53, props: { text: "Genesis Void #001" }, style: { fontSize: "22px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0px" } },
  // idx 55 — owner
  { type: "Text", parentRef: 53, props: { text: "Owned by 0x71C7...9f3B" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)" } },
  // idx 56 — right price col
  { type: "Div", parentRef: 52, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" } },
  // idx 57 — price label
  { type: "Text", parentRef: 56, props: { text: "PRICE" }, style: { fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" } },
  // idx 58 — price value
  { type: "Text", parentRef: 56, props: { text: "0.08 ETH" }, style: { fontSize: "20px", fontWeight: "800", color: "#a78bfa", letterSpacing: "-0.02em" } },

  // ── Card 2 — Neon Phantom #002 ── idx 59-67
  // idx 59 — card container
  { type: "Div", parentRef: 44, props: {}, style: { backgroundColor: "rgba(34,211,238,0.06)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.15)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" } },
  // idx 60 — image wrapper
  { type: "Div", parentRef: 59, props: {}, style: { position: "relative", overflow: "hidden", height: "140px" } },
  // idx 61 — image
  { type: "Image", parentRef: 60, props: { src: "https://picsum.photos/seed/nft002/400/400", alt: "Neon Phantom #002" }, style: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: "0px" } },
  // idx 62 — gradient
  { type: "Div", parentRef: 60, props: {}, style: { position: "absolute", inset: "0px", background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,15,0.85) 100%)" } },
  // idx 63 — info row
  { type: "Div", parentRef: 59, props: {}, style: { padding: "12px 16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
  // idx 64 — left col
  { type: "Div", parentRef: 63, props: {}, style: { display: "flex", flexDirection: "column" } },
  // idx 65 — name
  { type: "H3", parentRef: 64, props: { text: "Neon Phantom #002" }, style: { fontSize: "15px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1px" } },
  // idx 66 — owner
  { type: "Text", parentRef: 64, props: { text: "Owned by 0xA4d8...2c1E" }, style: { fontSize: "11px", color: "rgba(255,255,255,0.35)" } },
  // idx 67 — price
  { type: "Text", parentRef: 63, props: { text: "0.08 ETH" }, style: { fontSize: "16px", fontWeight: "800", color: "#22d3ee" } },

  // ── Card 3 — Eclipse Origin #003 ── idx 68-76
  // idx 68 — card container
  { type: "Div", parentRef: 44, props: {}, style: { backgroundColor: "rgba(251,146,60,0.06)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(251,146,60,0.15)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" } },
  // idx 69
  { type: "Div", parentRef: 68, props: {}, style: { position: "relative", overflow: "hidden", height: "140px" } },
  // idx 70
  { type: "Image", parentRef: 69, props: { src: "https://picsum.photos/seed/nft003/400/400", alt: "Eclipse Origin #003" }, style: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: "0px" } },
  // idx 71
  { type: "Div", parentRef: 69, props: {}, style: { position: "absolute", inset: "0px", background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,15,0.85) 100%)" } },
  // idx 72
  { type: "Div", parentRef: 68, props: {}, style: { padding: "12px 16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
  // idx 73
  { type: "Div", parentRef: 72, props: {}, style: { display: "flex", flexDirection: "column" } },
  // idx 74
  { type: "H3", parentRef: 73, props: { text: "Eclipse Origin #003" }, style: { fontSize: "15px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1px" } },
  // idx 75
  { type: "Text", parentRef: 73, props: { text: "Owned by 0x3Bc9...8aF2" }, style: { fontSize: "11px", color: "rgba(255,255,255,0.35)" } },
  // idx 76
  { type: "Text", parentRef: 72, props: { text: "0.12 ETH" }, style: { fontSize: "16px", fontWeight: "800", color: "#fb923c" } },

  // ── Card 4 — Quantum Bloom #004 ── idx 77-85
  // idx 77
  { type: "Div", parentRef: 44, props: {}, style: { backgroundColor: "rgba(16,185,129,0.06)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.15)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" } },
  // idx 78
  { type: "Div", parentRef: 77, props: {}, style: { position: "relative", overflow: "hidden", height: "140px" } },
  // idx 79
  { type: "Image", parentRef: 78, props: { src: "https://picsum.photos/seed/nft004/400/400", alt: "Quantum Bloom #004" }, style: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: "0px" } },
  // idx 80
  { type: "Div", parentRef: 78, props: {}, style: { position: "absolute", inset: "0px", background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,15,0.85) 100%)" } },
  // idx 81
  { type: "Div", parentRef: 77, props: {}, style: { padding: "12px 16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
  // idx 82
  { type: "Div", parentRef: 81, props: {}, style: { display: "flex", flexDirection: "column" } },
  // idx 83
  { type: "H3", parentRef: 82, props: { text: "Quantum Bloom #004" }, style: { fontSize: "15px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1px" } },
  // idx 84
  { type: "Text", parentRef: 82, props: { text: "Owned by 0x9dE4...7b0C" }, style: { fontSize: "11px", color: "rgba(255,255,255,0.35)" } },
  // idx 85
  { type: "Text", parentRef: 81, props: { text: "0.08 ETH" }, style: { fontSize: "16px", fontWeight: "800", color: "#34d399" } },

  // ── Card 5 — Stellar Relic #005 ── idx 86-94
  // idx 86
  { type: "Div", parentRef: 44, props: {}, style: { backgroundColor: "rgba(167,139,250,0.06)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(167,139,250,0.15)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" } },
  // idx 87
  { type: "Div", parentRef: 86, props: {}, style: { position: "relative", overflow: "hidden", height: "140px" } },
  // idx 88
  { type: "Image", parentRef: 87, props: { src: "https://picsum.photos/seed/nft005/400/400", alt: "Stellar Relic #005" }, style: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: "0px" } },
  // idx 89
  { type: "Div", parentRef: 87, props: {}, style: { position: "absolute", inset: "0px", background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,15,0.85) 100%)" } },
  // idx 90
  { type: "Div", parentRef: 86, props: {}, style: { padding: "12px 16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
  // idx 91
  { type: "Div", parentRef: 90, props: {}, style: { display: "flex", flexDirection: "column" } },
  // idx 92
  { type: "H3", parentRef: 91, props: { text: "Stellar Relic #005" }, style: { fontSize: "15px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1px" } },
  // idx 93
  { type: "Text", parentRef: 91, props: { text: "Owned by 0xF2a1...0dE8" }, style: { fontSize: "11px", color: "rgba(255,255,255,0.35)" } },
  // idx 94
  { type: "Text", parentRef: 90, props: { text: "0.10 ETH" }, style: { fontSize: "16px", fontWeight: "800", color: "#c4b5fd" } },

  // ── Card 6 — Void Walker #006 ── idx 95-103
  // idx 95
  { type: "Div", parentRef: 44, props: {}, style: { backgroundColor: "rgba(236,72,153,0.06)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(236,72,153,0.15)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" } },
  // idx 96
  { type: "Div", parentRef: 95, props: {}, style: { position: "relative", overflow: "hidden", height: "140px" } },
  // idx 97
  { type: "Image", parentRef: 96, props: { src: "https://picsum.photos/seed/nft006/400/400", alt: "Void Walker #006" }, style: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: "0px" } },
  // idx 98
  { type: "Div", parentRef: 96, props: {}, style: { position: "absolute", inset: "0px", background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,15,0.85) 100%)" } },
  // idx 99
  { type: "Div", parentRef: 95, props: {}, style: { padding: "12px 16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
  // idx 100
  { type: "Div", parentRef: 99, props: {}, style: { display: "flex", flexDirection: "column" } },
  // idx 101
  { type: "H3", parentRef: 100, props: { text: "Void Walker #006" }, style: { fontSize: "15px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1px" } },
  // idx 102
  { type: "Text", parentRef: 100, props: { text: "Owned by 0x8bC3...5aA9" }, style: { fontSize: "11px", color: "rgba(255,255,255,0.35)" } },
  // idx 103
  { type: "Text", parentRef: 99, props: { text: "0.15 ETH" }, style: { fontSize: "16px", fontWeight: "800", color: "#f472b6" } },

  // ── MINT SECTION ── idx 104+
  // idx 104
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", alignItems: "center", gap: "64px" } },
  // idx 105 — left col
  { type: "Div", parentRef: 104, props: {}, style: { flex: "1", display: "flex", flexDirection: "column", gap: "24px" } },
  // idx 106
  { type: "Text", parentRef: 105, props: { text: "MINT NOW" }, style: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", color: "#a78bfa", textTransform: "uppercase" } },
  // idx 107
  { type: "H2", parentRef: 105, props: { text: "Join 3,280\nCreators Today" }, style: { fontSize: "52px", fontWeight: "900", lineHeight: "1.05", letterSpacing: "-0.04em", color: "#ffffff", whiteSpace: "pre-line", marginBottom: "0px" } },
  // idx 108
  { type: "Paragraph", parentRef: 105, props: { text: "Minting is open. Each Nexus NFT grants access to exclusive airdrops, governance voting, and the Nexus creator residency program." }, style: { fontSize: "16px", lineHeight: "1.7", color: "rgba(255,255,255,0.5)" } },
  // idx 109 — mint card
  { type: "Div", parentRef: 104, props: {}, style: { ...GLASS, ...GLOW_PURPLE, padding: "32px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "400px" } },
  // idx 110 — price row
  { type: "Div", parentRef: 109, props: {}, style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
  // idx 111
  { type: "H3", parentRef: 110, props: { text: "Mint Price" }, style: { fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.6)", marginBottom: "0px" } },
  // idx 112
  { type: "H2", parentRef: 110, props: { text: "0.08 ETH" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#a78bfa", marginBottom: "0px" } },
  // idx 113 — progress section
  { type: "Div", parentRef: 109, props: {}, style: { display: "flex", flexDirection: "column", gap: "8px" } },
  // idx 114 — progress header
  { type: "Div", parentRef: 113, props: {}, style: { display: "flex", justifyContent: "space-between" } },
  // idx 115
  { type: "Text", parentRef: 114, props: { text: "8,341 / 10,000 minted" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.5)" } },
  // idx 116
  { type: "Text", parentRef: 114, props: { text: "83.4%" }, style: { fontSize: "13px", color: "#a78bfa", fontWeight: "700" } },
  // idx 117 — progress bar bg
  { type: "Div", parentRef: 113, props: {}, style: { height: "6px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "100px", overflow: "hidden" } },
  // idx 118 — progress fill
  { type: "Div", parentRef: 117, props: {}, style: { width: "83.4%", height: "100%", background: "linear-gradient(90deg, #7c3aed, #db2777)", borderRadius: "100px" } },
  // idx 119 — mint button
  { type: "Button", parentRef: 109, props: { text: "Mint Your NFT" }, style: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", paddingTop: "16px", paddingBottom: "16px", background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)", color: "#fff", fontSize: "16px", fontWeight: "700", borderRadius: "12px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 30px rgba(139,92,246,0.4)" } },

  // ── FOOTER ── idx 120+
  // idx 120
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "48px", paddingBottom: "48px", paddingLeft: "64px", paddingRight: "64px", borderTopWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" } },
  // idx 121
  { type: "Text", parentRef: 120, props: { text: "© 2025 NEXUS. All Rights Reserved." }, style: { fontSize: "13px", color: "rgba(255,255,255,0.3)" } },
  // idx 122
  { type: "Div", parentRef: 120, props: {}, style: { display: "flex", gap: "24px" } },
  // idx 123
  { type: "Link", parentRef: 122, props: { text: "Twitter", href: "#" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", cursor: "pointer" } },
  // idx 124
  { type: "Link", parentRef: 122, props: { text: "Discord", href: "#" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", cursor: "pointer" } },
  // idx 125
  { type: "Link", parentRef: 122, props: { text: "OpenSea", href: "#" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", cursor: "pointer" } },
];

// NFT detail page (dynamic /nft/:id)
const NFT_NEXUS_DETAIL: TemplateNodeDef[] = [
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#08080f", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", paddingLeft: "64px", paddingRight: "64px", paddingTop: "48px", paddingBottom: "80px", gap: "48px" } },
  { type: "Link", parentRef: 0, props: { text: "← Back to Collection", href: "/" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.4)", textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center" } },
  { type: "Div", parentRef: 0, props: {}, style: { display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap" } },
  // Left — NFT image
  { type: "Div", parentRef: 2, props: {}, style: { width: "480px", flexShrink: "0", borderRadius: "24px", overflow: "hidden", ...GLASS, ...GLOW_PURPLE } },
  { type: "Div", parentRef: 3, props: {}, style: { aspectRatio: "1", backgroundImage: "linear-gradient(135deg, #1a0533 0%, #0d0d1a 50%, #1a0533 100%)", display: "flex", alignItems: "center", justifyContent: "center" } },
  { type: "Text", parentRef: 4, props: { text: "🎨" }, style: { fontSize: "120px", lineHeight: "1" } },
  // Right — NFT info
  { type: "Div", parentRef: 2, props: {}, style: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "320px" } },
  { type: "Div", parentRef: 6, props: {}, style: { display: "flex", alignItems: "center", gap: "8px" } },
  { type: "Text", parentRef: 7, props: { text: "NEXUS COLLECTION" }, style: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: "#a78bfa", textTransform: "uppercase" } },
  { type: "H1", parentRef: 6, props: { text: "Nexus #0001" }, style: { fontSize: "56px", fontWeight: "900", letterSpacing: "-0.04em", color: "#ffffff", marginBottom: "0px" } },
  // Price info
  { type: "Div", parentRef: 6, props: {}, style: { ...GLASS, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
  { type: "Div", parentRef: 10, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px" } },
  { type: "Text", parentRef: 11, props: { text: "Current Price" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" } },
  { type: "H2", parentRef: 11, props: { text: "14.2 ETH" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#a78bfa", marginBottom: "0px" } },
  { type: "Div", parentRef: 10, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px", textAlign: "right" } },
  { type: "Text", parentRef: 14, props: { text: "Last Sale" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" } },
  { type: "H3", parentRef: 14, props: { text: "12.8 ETH" }, style: { fontSize: "24px", fontWeight: "700", letterSpacing: "-0.02em", color: "rgba(255,255,255,0.6)", marginBottom: "0px" } },
  // Traits grid
  { type: "Div", parentRef: 6, props: {}, style: { display: "flex", flexDirection: "column", gap: "12px" } },
  { type: "H3", parentRef: 16, props: { text: "Traits" }, style: { fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.6)", marginBottom: "0px" } },
  { type: "Grid", parentRef: 16, props: {}, style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" } },
  { type: "Div", parentRef: 18, props: {}, style: { ...GLASS, padding: "12px", display: "flex", flexDirection: "column", gap: "2px", borderRadius: "10px" } },
  { type: "Text", parentRef: 19, props: { text: "Background" }, style: { fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" } },
  { type: "Text", parentRef: 19, props: { text: "Void Purple" }, style: { fontSize: "13px", fontWeight: "700", color: "#a78bfa" } },
  { type: "Div", parentRef: 18, props: {}, style: { ...GLASS, padding: "12px", display: "flex", flexDirection: "column", gap: "2px", borderRadius: "10px" } },
  { type: "Text", parentRef: 22, props: { text: "Body" }, style: { fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" } },
  { type: "Text", parentRef: 22, props: { text: "Obsidian" }, style: { fontSize: "13px", fontWeight: "700", color: "#f472b6" } },
  { type: "Div", parentRef: 18, props: {}, style: { ...GLASS, padding: "12px", display: "flex", flexDirection: "column", gap: "2px", borderRadius: "10px" } },
  { type: "Text", parentRef: 24, props: { text: "Eyes" }, style: { fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" } },
  { type: "Text", parentRef: 24, props: { text: "Laser Red" }, style: { fontSize: "13px", fontWeight: "700", color: "#fb923c" } },
  // Buy button
  { type: "Button", parentRef: 6, props: { text: "Buy Now for 14.2 ETH" }, style: { display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "18px", paddingBottom: "18px", background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)", color: "#fff", fontSize: "16px", fontWeight: "700", borderRadius: "12px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 40px rgba(139,92,246,0.5)" } },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — DEFI MATRIX
// Category: DeFi | Colors: #22d3ee / #3b82f6 / #080d14
// Layout: Terminal aesthetic, stat blocks, swap widget, APY table
// Dynamic page: /pool/:address
// ─────────────────────────────────────────────────────────────────────────────
const DEFI_MATRIX_HOME: TemplateNodeDef[] = [
  // 0 — root
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#060d14", minHeight: "100vh", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" } },
  // Ambient
  { type: "Div", parentRef: 0, props: {}, style: { position: "absolute", top: "0px", left: "0px", right: "0px", height: "1px", background: "linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%)" } },
  { type: "Div", parentRef: 0, props: {}, style: { position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "400px", borderRadius: "9999px", backgroundColor: "rgba(34,211,238,0.06)", filter: "blur(100px)", pointerEvents: "none" } },

  // ── NAV ──
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "20px", paddingBottom: "20px", paddingLeft: "64px", paddingRight: "64px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.1)" } },
  { type: "Div", parentRef: 3, props: {}, style: { display: "flex", alignItems: "center", gap: "8px" } },
  { type: "Div", parentRef: 4, props: {}, style: { width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#22d3ee", boxShadow: "0 0 10px #22d3ee" } },
  { type: "H3", parentRef: 4, props: { text: "MATRIX" }, style: { fontSize: "16px", fontWeight: "700", letterSpacing: "0.2em", color: "#22d3ee", marginBottom: "0px" } },
  { type: "Div", parentRef: 3, props: {}, style: { display: "flex", alignItems: "center", gap: "32px" } },
  { type: "Link", parentRef: 7, props: { text: "Swap", href: "#" }, style: { fontSize: "12px", letterSpacing: "0.08em", color: "rgba(34,211,238,0.7)", textDecoration: "none", cursor: "pointer", textTransform: "uppercase" } },
  { type: "Link", parentRef: 7, props: { text: "Earn", href: "#" }, style: { fontSize: "12px", letterSpacing: "0.08em", color: "rgba(34,211,238,0.7)", textDecoration: "none", cursor: "pointer", textTransform: "uppercase" } },
  { type: "Link", parentRef: 7, props: { text: "Govern", href: "#" }, style: { fontSize: "12px", letterSpacing: "0.08em", color: "rgba(34,211,238,0.7)", textDecoration: "none", cursor: "pointer", textTransform: "uppercase" } },
  { type: "Button", parentRef: 3, props: { text: "> Connect_" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "8px", paddingRight: "20px", paddingBottom: "8px", paddingLeft: "20px", backgroundColor: "transparent", color: "#22d3ee", fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", borderRadius: "4px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.4)", boxShadow: "0 0 20px rgba(34,211,238,0.1)" } },

  // ── HERO ──
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "100px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", textAlign: "center", gap: "0px" } },
  { type: "Text", parentRef: 12, props: { text: "// DECENTRALIZED_EXCHANGE v3.0.0" }, style: { fontSize: "11px", letterSpacing: "0.08em", color: "rgba(34,211,238,0.4)", marginBottom: "32px", display: "block" } },
  { type: "H1", parentRef: 12, props: { text: "Trade. Earn." }, style: { fontSize: "96px", fontWeight: "900", lineHeight: "0.9", letterSpacing: "-0.04em", color: "#ffffff", marginBottom: "0px" } },
  { type: "H1", parentRef: 12, props: { text: "Build." }, style: { fontSize: "96px", fontWeight: "900", lineHeight: "0.9", letterSpacing: "-0.04em", background: "linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", display: "inline-block", marginBottom: "0px" } },
  { type: "Paragraph", parentRef: 12, props: { text: "$2.4B in total value locked across 200+ pools. The most capital-efficient AMM on Ethereum." }, style: { fontSize: "18px", lineHeight: "1.6", color: "rgba(255,255,255,0.45)", maxWidth: "520px", marginTop: "40px", marginBottom: "48px", fontFamily: "Inter, sans-serif" } },
  { type: "Div", parentRef: 12, props: {}, style: { display: "flex", gap: "12px", justifyContent: "center" } },
  { type: "Button", parentRef: 17, props: { text: "Launch App →" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "14px", paddingRight: "28px", paddingBottom: "14px", paddingLeft: "28px", backgroundColor: "#22d3ee", color: "#060d14", fontSize: "14px", fontWeight: "800", letterSpacing: "0.04em", borderRadius: "6px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 40px rgba(34,211,238,0.4)" } },
  { type: "Button", parentRef: 17, props: { text: "Read Docs" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "14px", paddingRight: "28px", paddingBottom: "14px", paddingLeft: "28px", backgroundColor: "transparent", color: "#22d3ee", fontSize: "14px", fontWeight: "600", letterSpacing: "0.04em", borderRadius: "6px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.3)" } },

  // ── TVL TICKER ──
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "32px", paddingBottom: "32px", paddingLeft: "64px", paddingRight: "64px", borderTopWidth: "1px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.08)", backgroundColor: "rgba(34,211,238,0.02)" } },
  { type: "Div", parentRef: 20, props: {}, style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0px" } },
  { type: "Div", parentRef: 21, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px", paddingRight: "32px", borderRightWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.1)" } },
  { type: "Text", parentRef: 22, props: { text: "TOTAL VALUE LOCKED" }, style: { fontSize: "10px", letterSpacing: "0.1em", color: "rgba(34,211,238,0.5)", textTransform: "uppercase" } },
  { type: "H2", parentRef: 22, props: { text: "$2.41B" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#22d3ee", marginBottom: "0px", fontFamily: "Inter, sans-serif" } },
  { type: "Div", parentRef: 21, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "32px", paddingRight: "32px", borderRightWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.1)" } },
  { type: "Text", parentRef: 26, props: { text: "24H VOLUME" }, style: { fontSize: "10px", letterSpacing: "0.1em", color: "rgba(34,211,238,0.5)", textTransform: "uppercase" } },
  { type: "H2", parentRef: 26, props: { text: "$148.2M" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px", fontFamily: "Inter, sans-serif" } },
  { type: "Div", parentRef: 21, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "32px", paddingRight: "32px", borderRightWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.1)" } },
  { type: "Text", parentRef: 29, props: { text: "TOTAL POOLS" }, style: { fontSize: "10px", letterSpacing: "0.1em", color: "rgba(34,211,238,0.5)", textTransform: "uppercase" } },
  { type: "H2", parentRef: 29, props: { text: "214" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px", fontFamily: "Inter, sans-serif" } },
  { type: "Div", parentRef: 21, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "32px" } },
  { type: "Text", parentRef: 32, props: { text: "FEES (7D)" }, style: { fontSize: "10px", letterSpacing: "0.1em", color: "rgba(34,211,238,0.5)", textTransform: "uppercase" } },
  { type: "H2", parentRef: 32, props: { text: "$3.8M" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#22d3ee", marginBottom: "0px", fontFamily: "Inter, sans-serif" } },

  // ── SWAP WIDGET + TOP POOLS ──
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", gap: "32px", paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", alignItems: "flex-start" } },
  // Swap card
  { type: "Div", parentRef: 35, props: {}, style: { width: "400px", flexShrink: "0", backgroundColor: "rgba(34,211,238,0.04)", borderRadius: "16px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.15)", padding: "28px", display: "flex", flexDirection: "column", gap: "16px", ...GLOW_CYAN } },
  { type: "H3", parentRef: 36, props: { text: "Swap" }, style: { fontSize: "20px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0px", fontFamily: "Inter, sans-serif" } },
  { type: "Div", parentRef: 36, props: {}, style: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" } },
  { type: "Text", parentRef: 38, props: { text: "You Pay" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)" } },
  { type: "Div", parentRef: 38, props: {}, style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
  { type: "H2", parentRef: 40, props: { text: "0.0" }, style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "0px", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" } },
  { type: "Button", parentRef: 40, props: { text: "ETH ▼" }, style: { paddingTop: "8px", paddingRight: "14px", paddingBottom: "8px", paddingLeft: "14px", backgroundColor: "rgba(34,211,238,0.15)", color: "#22d3ee", fontSize: "14px", fontWeight: "700", borderRadius: "100px", cursor: "pointer", borderStyle: "none", fontFamily: "Inter, sans-serif" } },
  { type: "Text", parentRef: 38, props: { text: "$0.00" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.3)" } },
  { type: "Div", parentRef: 36, props: {}, style: { display: "flex", justifyContent: "center" } },
  { type: "Text", parentRef: 44, props: { text: "⇅" }, style: { fontSize: "20px", color: "#22d3ee", cursor: "pointer" } },
  { type: "Div", parentRef: 36, props: {}, style: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" } },
  { type: "Text", parentRef: 46, props: { text: "You Receive" }, style: { fontSize: "12px", color: "rgba(255,255,255,0.4)" } },
  { type: "Div", parentRef: 46, props: {}, style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
  { type: "H2", parentRef: 48, props: { text: "0.0" }, style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "0px", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" } },
  { type: "Button", parentRef: 48, props: { text: "USDC ▼" }, style: { paddingTop: "8px", paddingRight: "14px", paddingBottom: "8px", paddingLeft: "14px", backgroundColor: "rgba(59,130,246,0.2)", color: "#93c5fd", fontSize: "14px", fontWeight: "700", borderRadius: "100px", cursor: "pointer", borderStyle: "none", fontFamily: "Inter, sans-serif" } },
  { type: "Button", parentRef: 36, props: { text: "Connect Wallet to Swap" }, style: { width: "100%", paddingTop: "14px", paddingBottom: "14px", backgroundColor: "#22d3ee", color: "#060d14", fontSize: "15px", fontWeight: "800", borderRadius: "8px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 30px rgba(34,211,238,0.35)", fontFamily: "Inter, sans-serif" } },

  // Top pools table
  { type: "Div", parentRef: 35, props: {}, style: { flex: "1", display: "flex", flexDirection: "column", gap: "16px" } },
  { type: "H3", parentRef: 52, props: { text: "Top Pools" }, style: { fontSize: "20px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0px", fontFamily: "Inter, sans-serif" } },
  // Pool rows
  ...([["ETH / USDC", "$1.2B", "142.3%"], ["BTC / ETH", "$380M", "68.1%"], ["ARB / ETH", "$145M", "219.4%"], ["MATIC / USDC", "$98M", "88.7%"]] as const).flatMap(([pair, tvl, apy], i) => [
    { type: "Div", parentRef: 52, props: {}, style: { display: "flex", alignItems: "center", gap: "16px", paddingTop: "14px", paddingBottom: "14px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(34,211,238,0.08)" } } as TemplateNodeDef,
    { type: "Div", parentRef: 53 + i * 4, props: {}, style: { flex: "1" } } as TemplateNodeDef,
    { type: "Text", parentRef: 54 + i * 4, props: { text: pair }, style: { fontSize: "15px", fontWeight: "700", color: "#ffffff", fontFamily: "Inter, sans-serif" } } as TemplateNodeDef,
    { type: "Text", parentRef: 53 + i * 4, props: { text: tvl }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif", width: "100px" } } as TemplateNodeDef,
    { type: "Text", parentRef: 53 + i * 4, props: { text: apy + " APY" }, style: { fontSize: "14px", fontWeight: "700", color: "#22d3ee", fontFamily: "Inter, sans-serif", width: "100px", textAlign: "right" } } as TemplateNodeDef,
  ]),
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — DAO COLLECTIVE
// Category: DAO | Colors: #10b981 / #059669 / #060f0c
// Layout: Community-first, proposal cards, treasury overview, member grid
// ─────────────────────────────────────────────────────────────────────────────
const DAO_HOME: TemplateNodeDef[] = [
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#04100c", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" } },
  // Grid pattern
  { type: "Div", parentRef: 0, props: {}, style: { position: "absolute", inset: "0px", backgroundImage: "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" } },

  // NAV
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", paddingBottom: "24px", paddingLeft: "64px", paddingRight: "64px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.1)", zIndex: "10", position: "relative" } },
  { type: "Div", parentRef: 2, props: {}, style: { display: "flex", alignItems: "center", gap: "10px" } },
  { type: "Div", parentRef: 3, props: {}, style: { width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.3)" } },
  { type: "Text", parentRef: 4, props: { text: "⬡" }, style: { color: "#10b981", fontSize: "18px" } },
  { type: "H3", parentRef: 3, props: { text: "COLLECTIVE" }, style: { fontSize: "18px", fontWeight: "800", letterSpacing: "0.08em", color: "#10b981", marginBottom: "0px" } },
  { type: "Div", parentRef: 2, props: {}, style: { display: "flex", alignItems: "center", gap: "32px" } },
  { type: "Link", parentRef: 6, props: { text: "Proposals", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none", cursor: "pointer" } },
  { type: "Link", parentRef: 6, props: { text: "Treasury", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none", cursor: "pointer" } },
  { type: "Link", parentRef: 6, props: { text: "Forum", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none", cursor: "pointer" } },
  { type: "Button", parentRef: 2, props: { text: "Join DAO" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "10px", paddingRight: "20px", paddingBottom: "10px", paddingLeft: "20px", backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "14px", fontWeight: "600", borderRadius: "8px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.3)" } },

  // HERO
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", gap: "80px", alignItems: "center", position: "relative", zIndex: "1" } },
  { type: "Div", parentRef: 11, props: {}, style: { flex: "1", display: "flex", flexDirection: "column", gap: "24px" } },
  { type: "Div", parentRef: 12, props: {}, style: { display: "inline-flex", alignItems: "center", gap: "8px", paddingTop: "6px", paddingBottom: "6px", paddingLeft: "12px", paddingRight: "12px", borderRadius: "100px", backgroundColor: "rgba(16,185,129,0.1)", borderTopWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.2)" } },
  { type: "Div", parentRef: 13, props: {}, style: { width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#10b981", boxShadow: "0 0 8px #10b981" } },
  { type: "Text", parentRef: 13, props: { text: "24 Active Proposals" }, style: { fontSize: "12px", fontWeight: "600", color: "#34d399" } },
  { type: "H1", parentRef: 12, props: { text: "Govern the\nFuture, Together." }, style: { fontSize: "64px", fontWeight: "900", lineHeight: "1.0", letterSpacing: "-0.04em", color: "#ffffff", whiteSpace: "pre-line", marginBottom: "0px" } },
  { type: "Paragraph", parentRef: 12, props: { text: "A community-owned protocol governed by token holders. Every MXR token is a vote. Shape the protocol, allocate the treasury, and build the future." }, style: { fontSize: "17px", lineHeight: "1.7", color: "rgba(255,255,255,0.5)", maxWidth: "520px" } },
  { type: "Div", parentRef: 12, props: {}, style: { display: "flex", gap: "12px", flexWrap: "wrap" } },
  { type: "Button", parentRef: 18, props: { text: "Explore Proposals →" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "14px", paddingRight: "28px", paddingBottom: "14px", paddingLeft: "28px", backgroundColor: "#10b981", color: "#fff", fontSize: "15px", fontWeight: "700", borderRadius: "10px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 40px rgba(16,185,129,0.3)" } },
  { type: "Button", parentRef: 18, props: { text: "Buy Governance Token" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "14px", paddingRight: "28px", paddingBottom: "14px", paddingLeft: "28px", backgroundColor: "transparent", color: "#10b981", fontSize: "15px", fontWeight: "600", borderRadius: "10px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.3)" } },
  // Stats
  { type: "Div", parentRef: 11, props: {}, style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", width: "380px", flexShrink: "0" } },
  { type: "Div", parentRef: 21, props: {}, style: { backgroundColor: "rgba(16,185,129,0.06)", borderRadius: "16px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.15)", padding: "24px", display: "flex", flexDirection: "column", gap: "4px" } },
  { type: "H2", parentRef: 22, props: { text: "$84M" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#10b981", marginBottom: "0px" } },
  { type: "Text", parentRef: 22, props: { text: "Treasury" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "500" } },
  { type: "Div", parentRef: 21, props: {}, style: { backgroundColor: "rgba(16,185,129,0.06)", borderRadius: "16px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.15)", padding: "24px", display: "flex", flexDirection: "column", gap: "4px" } },
  { type: "H2", parentRef: 25, props: { text: "18,400" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#10b981", marginBottom: "0px" } },
  { type: "Text", parentRef: 25, props: { text: "Token Holders" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "500" } },
  { type: "Div", parentRef: 21, props: {}, style: { backgroundColor: "rgba(16,185,129,0.06)", borderRadius: "16px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.15)", padding: "24px", display: "flex", flexDirection: "column", gap: "4px" } },
  { type: "H2", parentRef: 27, props: { text: "142" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#10b981", marginBottom: "0px" } },
  { type: "Text", parentRef: 27, props: { text: "Proposals Passed" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "500" } },
  { type: "Div", parentRef: 21, props: {}, style: { backgroundColor: "rgba(16,185,129,0.06)", borderRadius: "16px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.15)", padding: "24px", display: "flex", flexDirection: "column", gap: "4px" } },
  { type: "H2", parentRef: 29, props: { text: "72%" }, style: { fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", color: "#10b981", marginBottom: "0px" } },
  { type: "Text", parentRef: 29, props: { text: "Avg Participation" }, style: { fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "500" } },

  // PROPOSALS
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", flexDirection: "column", gap: "32px", zIndex: "1", position: "relative" } },
  { type: "H2", parentRef: 31, props: { text: "Active Proposals" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px" } },
  // Proposal cards
  ...([
    ["MIP-47: Increase liquidity mining rewards by 25%", "In Progress", "78", "22", "#10b981"],
    ["MIP-46: Deploy protocol to Arbitrum One", "Passed", "94", "6", "#10b981"],
    ["MIP-45: Treasury diversification into stablecoins", "In Progress", "61", "39", "#f59e0b"],
  ] as const).map(([title, status, yes, no, color], i) => (
    { type: "Div", parentRef: 31, props: {}, style: { backgroundColor: "rgba(16,185,129,0.04)", borderRadius: "16px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(16,185,129,0.1)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" } } as TemplateNodeDef
  )),
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4 — TOKEN PULSE
// Category: Token | Colors: #f59e0b / #ef4444 / #0d0904
// Layout: Coin landing page, tokenomics, exchanges, vesting schedule
// ─────────────────────────────────────────────────────────────────────────────
const TOKEN_HOME: TemplateNodeDef[] = [
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#0a0601", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" } },
  // Radial glow
  { type: "Div", parentRef: 0, props: {}, style: { position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "600px", borderRadius: "9999px", backgroundColor: "rgba(245,158,11,0.08)", filter: "blur(120px)", pointerEvents: "none" } },

  // NAV
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", paddingBottom: "24px", paddingLeft: "64px", paddingRight: "64px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(245,158,11,0.1)" } },
  { type: "Div", parentRef: 2, props: {}, style: { display: "flex", alignItems: "center", gap: "8px" } },
  { type: "Div", parentRef: 3, props: {}, style: { width: "36px", height: "36px", borderRadius: "9999px", background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", display: "flex", alignItems: "center", justifyContent: "center" } },
  { type: "Text", parentRef: 4, props: { text: "⚡" }, style: { fontSize: "18px", color: "#fff" } },
  { type: "H3", parentRef: 3, props: { text: "PULSE" }, style: { fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "0px" } },
  { type: "Div", parentRef: 2, props: {}, style: { display: "flex", alignItems: "center", gap: "32px" } },
  { type: "Link", parentRef: 7, props: { text: "Tokenomics", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none", cursor: "pointer" } },
  { type: "Link", parentRef: 7, props: { text: "Roadmap", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none", cursor: "pointer" } },
  { type: "Link", parentRef: 7, props: { text: "Team", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none", cursor: "pointer" } },
  { type: "Button", parentRef: 2, props: { text: "Buy $PULSE" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "10px", paddingRight: "24px", paddingBottom: "10px", paddingLeft: "24px", background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", color: "#fff", fontSize: "14px", fontWeight: "700", borderRadius: "100px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 24px rgba(245,158,11,0.4)" } },

  // HERO
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "100px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0px", position: "relative", zIndex: "1" } },
  // Coin
  { type: "Div", parentRef: 12, props: {}, style: { width: "80px", height: "80px", borderRadius: "9999px", background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(245,158,11,0.5)", marginBottom: "32px" } },
  { type: "Text", parentRef: 13, props: { text: "⚡" }, style: { fontSize: "36px", color: "#fff" } },
  { type: "H1", parentRef: 12, props: { text: "The Currency\nof the Web3 Era" }, style: { fontSize: "80px", fontWeight: "900", lineHeight: "1.0", letterSpacing: "-0.04em", color: "#ffffff", whiteSpace: "pre-line", marginBottom: "0px" } },
  { type: "Div", parentRef: 12, props: {}, style: { marginTop: "8px" } },
  { type: "H1", parentRef: 16, props: { text: "$PULSE" }, style: { fontSize: "80px", fontWeight: "900", lineHeight: "1.0", letterSpacing: "-0.04em", background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", display: "inline-block" } },
  { type: "Paragraph", parentRef: 12, props: { text: "A deflationary utility token powering the next generation of DeFi applications. 50% burned, 30% staking rewards, 20% ecosystem fund." }, style: { fontSize: "18px", lineHeight: "1.6", color: "rgba(255,255,255,0.45)", maxWidth: "560px", marginTop: "32px", marginBottom: "48px" } },
  { type: "Div", parentRef: 12, props: {}, style: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" } },
  { type: "Button", parentRef: 19, props: { text: "Buy on Uniswap →" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "16px", paddingRight: "32px", paddingBottom: "16px", paddingLeft: "32px", background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", color: "#fff", fontSize: "15px", fontWeight: "700", borderRadius: "100px", cursor: "pointer", borderStyle: "none", boxShadow: "0 0 40px rgba(245,158,11,0.4)" } },
  { type: "Button", parentRef: 19, props: { text: "Read Whitepaper" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "16px", paddingRight: "32px", paddingBottom: "16px", paddingLeft: "32px", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "15px", fontWeight: "600", borderRadius: "100px", cursor: "pointer", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)" } },

  // PRICE TICKER
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "32px", paddingBottom: "32px", paddingLeft: "64px", paddingRight: "64px", borderTopWidth: "1px", borderBottomWidth: "1px", borderStyle: "solid", borderColor: "rgba(245,158,11,0.1)", backgroundColor: "rgba(245,158,11,0.03)" } },
  { type: "Div", parentRef: 22, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "64px", flexWrap: "wrap" } },
  ...([["$0.842", "Current Price"], ["$1.2B", "Market Cap"], ["100B", "Total Supply"], ["+8.4%", "24H Change"]] as const).map(([val, label]) => (
    { type: "Div", parentRef: 23, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" } } as TemplateNodeDef
  )),

  // TOKENOMICS
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", flexDirection: "column", gap: "48px" } },
  { type: "Div", parentRef: 28, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" } },
  { type: "Text", parentRef: 29, props: { text: "TOKENOMICS" }, style: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", color: "#f59e0b", textTransform: "uppercase" } },
  { type: "H2", parentRef: 29, props: { text: "Built to Last Forever" }, style: { fontSize: "48px", fontWeight: "900", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px" } },
  { type: "Grid", parentRef: 28, props: {}, style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%" } },
  ...([
    ["🔥", "50%", "Deflationary Burn", "Permanently removed from supply every transaction, increasing scarcity over time.", "#ef4444"],
    ["⚡", "30%", "Staking Rewards", "Distributed to $PULSE stakers over 4 years, rewarding long-term holders.", "#f59e0b"],
    ["🏛️", "20%", "Ecosystem Fund", "Grants, partnerships, and liquidity provision managed by the DAO treasury.", "#10b981"],
  ] as const).map(([emoji, pct, title, desc, color]) => (
    { type: "Div", parentRef: 32, props: {}, style: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.06)", padding: "32px", display: "flex", flexDirection: "column", gap: "12px" } } as TemplateNodeDef
  )),
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5 — WEB3 PORTFOLIO
// Category: Portfolio | Colors: #8b5cf6 / #06b6d4 / #080810
// Layout: Developer/builder portfolio, project cards, skills, contact
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_HOME: TemplateNodeDef[] = [
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#08080f", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", position: "relative" } },

  // NAV
  { type: "Section", parentRef: 0, props: {}, style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", paddingBottom: "24px", paddingLeft: "64px", paddingRight: "64px" } },
  { type: "Text", parentRef: 1, props: { text: "Alex.eth" }, style: { fontSize: "16px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" } },
  { type: "Div", parentRef: 1, props: {}, style: { display: "flex", gap: "24px", alignItems: "center" } },
  { type: "Link", parentRef: 3, props: { text: "Work", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" } },
  { type: "Link", parentRef: 3, props: { text: "Skills", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" } },
  { type: "Link", parentRef: 3, props: { text: "Contact", href: "#" }, style: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" } },
  { type: "Button", parentRef: 1, props: { text: "Let's Build Together" }, style: { display: "inline-flex", alignItems: "center", paddingTop: "10px", paddingRight: "20px", paddingBottom: "10px", paddingLeft: "20px", background: "linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)", color: "#fff", fontSize: "13px", fontWeight: "600", borderRadius: "100px", cursor: "pointer", borderStyle: "none" } },

  // HERO
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "120px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", flexDirection: "column", gap: "24px" } },
  { type: "Div", parentRef: 8, props: {}, style: { display: "inline-flex", alignItems: "center", gap: "8px", paddingTop: "4px", paddingBottom: "4px", paddingLeft: "12px", paddingRight: "12px", borderRadius: "100px", backgroundColor: "rgba(139,92,246,0.1)", borderTopWidth: "1px", borderStyle: "solid", borderColor: "rgba(139,92,246,0.2)", width: "fit-content" } },
  { type: "Div", parentRef: 9, props: {}, style: { width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#10b981", boxShadow: "0 0 8px #10b981" } },
  { type: "Text", parentRef: 9, props: { text: "Available for new projects" }, style: { fontSize: "12px", fontWeight: "600", color: "#34d399" } },
  { type: "H1", parentRef: 8, props: { text: "Full-Stack\nWeb3 Builder" }, style: { fontSize: "96px", fontWeight: "900", lineHeight: "0.95", letterSpacing: "-0.05em", color: "#ffffff", whiteSpace: "pre-line", marginBottom: "0px" } },
  { type: "H1", parentRef: 8, props: { text: "& Smart Contract Dev" }, style: { fontSize: "64px", fontWeight: "900", lineHeight: "1", letterSpacing: "-0.04em", background: "linear-gradient(90deg, #8b5cf6, #06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", display: "inline-block", marginBottom: "0px" } },
  { type: "Paragraph", parentRef: 8, props: { text: "I build products at the intersection of DeFi, NFTs, and user experience. 50+ contracts deployed. 3 protocols in production." }, style: { fontSize: "20px", lineHeight: "1.5", color: "rgba(255,255,255,0.45)", maxWidth: "600px" } },

  // PROJECTS BENTO
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", display: "flex", flexDirection: "column", gap: "40px" } },
  { type: "H2", parentRef: 15, props: { text: "Selected Work" }, style: { fontSize: "40px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px" } },
  { type: "Grid", parentRef: 15, props: {}, style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" } },
  // Card 1 (large)
  { type: "Div", parentRef: 17, props: {}, style: { gridColumn: "span 2", backgroundColor: "rgba(139,92,246,0.08)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(139,92,246,0.2)", padding: "32px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "240px" } },
  { type: "Div", parentRef: 18, props: {}, style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
  { type: "Div", parentRef: 19, props: {}, style: { display: "flex", flexDirection: "column", gap: "4px" } },
  { type: "Text", parentRef: 20, props: { text: "DeFi · 2024" }, style: { fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", color: "#a78bfa", textTransform: "uppercase" } },
  { type: "H2", parentRef: 20, props: { text: "LiquidX Protocol" }, style: { fontSize: "28px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px" } },
  { type: "Text", parentRef: 19, props: { text: "↗" }, style: { fontSize: "24px", color: "#a78bfa", cursor: "pointer" } },
  { type: "Paragraph", parentRef: 18, props: { text: "A decentralized perpetuals exchange with novel liquidity mechanisms. $120M TVL at peak. Built with Solidity, Hardhat, and React." }, style: { fontSize: "15px", lineHeight: "1.6", color: "rgba(255,255,255,0.5)" } },
  { type: "Div", parentRef: 18, props: {}, style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
  ...["Solidity", "React", "TypeScript", "Hardhat"].map((tag) => (
    { type: "Text", parentRef: 24, props: { text: tag }, style: { paddingTop: "4px", paddingBottom: "4px", paddingLeft: "10px", paddingRight: "10px", borderRadius: "100px", backgroundColor: "rgba(139,92,246,0.15)", color: "#c4b5fd", fontSize: "11px", fontWeight: "600" } } as TemplateNodeDef
  )),
  // Card 2
  { type: "Div", parentRef: 17, props: {}, style: { backgroundColor: "rgba(6,182,212,0.08)", borderRadius: "20px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(6,182,212,0.2)", padding: "32px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "240px" } },
  { type: "Text", parentRef: 29, props: { text: "NFT · 2024" }, style: { fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", color: "#22d3ee", textTransform: "uppercase" } },
  { type: "H2", parentRef: 29, props: { text: "PixelForge NFT" }, style: { fontSize: "24px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px" } },
  { type: "Paragraph", parentRef: 29, props: { text: "10,000 piece generative art collection. Sold out in 4 minutes. Secondary volume $28M." }, style: { fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.5)" } },

  // SKILLS
  { type: "Section", parentRef: 0, props: {}, style: { paddingTop: "80px", paddingBottom: "80px", paddingLeft: "64px", paddingRight: "64px", borderTopWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "32px" } },
  { type: "H2", parentRef: 32, props: { text: "Tech Stack" }, style: { fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "0px" } },
  { type: "Div", parentRef: 32, props: {}, style: { display: "flex", flexWrap: "wrap", gap: "8px" } },
  ...["Solidity", "Foundry", "Hardhat", "Ethers.js", "Wagmi", "React", "Next.js", "TypeScript", "The Graph", "IPFS", "ERC-721", "ERC-20", "Uniswap v3", "Aave", "OpenZeppelin"].map((skill) => (
    { type: "Text", parentRef: 33, props: { text: skill }, style: { paddingTop: "8px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px", borderRadius: "100px", backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "500", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)" } } as TemplateNodeDef
  )),
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6 — BLANK CANVAS
// ─────────────────────────────────────────────────────────────────────────────
const BLANK_HOME: TemplateNodeDef[] = [
  { type: "Section", parentRef: null, props: {}, style: { backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" } },
  { type: "Div", parentRef: 0, props: {}, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" } },
  { type: "H1", parentRef: 1, props: { text: "Your Site Starts Here" }, style: { fontSize: "48px", fontWeight: "800", letterSpacing: "-0.03em", color: "#111827", marginBottom: "0px" } },
  { type: "Paragraph", parentRef: 1, props: { text: "Drag elements from the sidebar to start building your Web3 site." }, style: { fontSize: "16px", color: "#6b7280", lineHeight: "1.6" } },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "nft-nexus",
    name: "NFT Nexus",
    tagline: "Own the next generation of art",
    category: "NFT",
    description: "A premium NFT collection launch site with mint counter, bento collection grid, stats bar, and individual NFT detail pages — built for drops that sell out.",
    thumbnail: { bg: "linear-gradient(135deg, #08080f 0%, #1a0533 60%, #08080f 100%)", accent: "#8b5cf6", secondary: "#ec4899", emoji: "🎨" },
    contracts: [{ name: "NFT Collection", address: "", chainId: 11155111, abi: [...MINTLAY_NFT_ABI] as any, preset: "ERC721" }],
    pages: [
      { name: "Home", slug: "/", nodes: NFT_NEXUS_HOME },
      { name: "NFT Detail", slug: "/nft/:id", isDynamic: true, dynamicParam: "id", nodes: NFT_NEXUS_DETAIL },
    ],
  },
  {
    id: "defi-matrix",
    name: "DeFi Matrix",
    tagline: "The most capital-efficient AMM",
    category: "DeFi",
    description: "Terminal-aesthetic DeFi protocol landing page with live TVL stats, swap widget mockup, and top pools table. Includes dynamic pool pages.",
    thumbnail: { bg: "linear-gradient(135deg, #060d14 0%, #031420 50%, #060d14 100%)", accent: "#22d3ee", secondary: "#3b82f6", emoji: "⚡" },
    contracts: [
      { name: "ERC-20 Token", address: "", chainId: 1, abi: PRESET_ABIS.ERC20, preset: "ERC20" },
    ],
    pages: [
      { name: "Home", slug: "/", nodes: DEFI_MATRIX_HOME },
      { name: "Pool Detail", slug: "/pool/:address", isDynamic: true, dynamicParam: "address", nodes: BLANK_HOME },
    ],
  },
  {
    id: "dao-collective",
    name: "DAO Collective",
    tagline: "Govern the future, together",
    category: "DAO",
    description: "Community-first governance protocol site with proposal cards, treasury overview, and token holder stats. Grid texture background, editorial layout.",
    thumbnail: { bg: "linear-gradient(135deg, #04100c 0%, #071a11 50%, #04100c 100%)", accent: "#10b981", secondary: "#059669", emoji: "⬡" },
    contracts: [
      { name: "Governance Token", address: "", chainId: 1, abi: PRESET_ABIS.ERC20, preset: "ERC20" },
    ],
    pages: [
      { name: "Home", slug: "/", nodes: DAO_HOME },
      { name: "Proposal", slug: "/proposal/:id", isDynamic: true, dynamicParam: "id", nodes: BLANK_HOME },
    ],
  },
  {
    id: "token-pulse",
    name: "Token Pulse",
    tagline: "The currency of the Web3 era",
    category: "Token",
    description: "Coin launch landing page with tokenomics breakdown, price ticker, and exchange listings. Dramatic amber/red gradient with deflationary burn mechanics showcase.",
    thumbnail: { bg: "linear-gradient(135deg, #0a0601 0%, #1a0c00 50%, #0a0601 100%)", accent: "#f59e0b", secondary: "#ef4444", emoji: "🪙" },
    contracts: [
      { name: "PULSE Token", address: "", chainId: 1, abi: PRESET_ABIS.ERC20, preset: "ERC20" },
    ],
    pages: [
      { name: "Home", slug: "/", nodes: TOKEN_HOME },
    ],
  },
  {
    id: "web3-portfolio",
    name: "Web3 Portfolio",
    tagline: "Built on-chain, recognized on-chain",
    category: "Portfolio",
    description: "Developer portfolio with project bento grid, skills cloud, and contact section. Shows deployed contracts and production DeFi protocols.",
    thumbnail: { bg: "linear-gradient(135deg, #08080f 0%, #100820 50%, #08080f 100%)", accent: "#8b5cf6", secondary: "#06b6d4", emoji: "🛠️" },
    pages: [
      { name: "Home", slug: "/", nodes: PORTFOLIO_HOME },
    ],
  },
  {
    id: "blank",
    name: "Blank Canvas",
    tagline: "Start from scratch",
    category: "Blank",
    description: "A clean, empty canvas. Drag elements from the sidebar to build your custom Web3 site.",
    thumbnail: { bg: "#111827", accent: "#6b7280", secondary: "#374151", emoji: "✦" },
    pages: [
      { name: "Home", slug: "/", nodes: BLANK_HOME },
    ],
  },
];
