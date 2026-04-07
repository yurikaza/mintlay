// components/builder/prebuilt-components.ts
// Pre-built component templates. parentRef is an index into the nodes array
// (null = root of this component). Instantiated with fresh UUIDs on drop.

import type { StyleProps } from "../../types/builder";
import { DEFAULT_STYLES } from "../../types/builder";

export interface ComponentTemplate {
  id: string;
  name: string;
  category: "Sections" | "Cards" | "Navigation" | "Forms";
  nodes: Array<{
    type: string;
    parentRef: number | null;
    props?: Record<string, any>;
    style?: Partial<StyleProps>;
  }>;
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // ── Sections ───────────────────────────────────────────────────────────────

  {
    id: "hero-centered",
    name: "Hero — Centered",
    category: "Sections",
    nodes: [
      {
        type: "Section",
        parentRef: null,
        style: {
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: "100%", minHeight: "600px",
          paddingTop: "96px", paddingBottom: "96px",
          paddingLeft: "32px", paddingRight: "32px",
          backgroundColor: "#0f0f11",
        },
      },
      {
        type: "Div",
        parentRef: 0,
        style: {
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "24px", maxWidth: "680px", width: "100%",
        },
      },
      {
        type: "Text",
        parentRef: 1,
        props: { text: "✦ Introducing Mintlay OS" },
        style: {
          fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em",
          color: "#a78bfa", textTransform: "uppercase",
        },
      },
      {
        type: "H1",
        parentRef: 1,
        props: { text: "Build the web,\nyour way." },
        style: {
          fontSize: "64px", fontWeight: "800", lineHeight: "1.1",
          color: "#ffffff", textAlign: "center", whiteSpace: "pre-line",
        },
      },
      {
        type: "Paragraph",
        parentRef: 1,
        props: { text: "The visual builder for developers and designers. No code required — unless you want it." },
        style: {
          fontSize: "18px", lineHeight: "1.7", color: "#a1a1aa",
          textAlign: "center", maxWidth: "520px",
        },
      },
      {
        type: "Div",
        parentRef: 1,
        style: {
          display: "flex", flexDirection: "row", gap: "12px",
          flexWrap: "wrap", justifyContent: "center",
        },
      },
      {
        type: "Button",
        parentRef: 5,
        props: { text: "Get started free →" },
        style: {
          ...DEFAULT_STYLES.Button,
          paddingTop: "14px", paddingBottom: "14px",
          paddingLeft: "28px", paddingRight: "28px",
          backgroundColor: "#7c3aed", color: "#fff",
          fontSize: "15px", fontWeight: "600",
          borderRadius: "8px",
        },
      },
      {
        type: "Button",
        parentRef: 5,
        props: { text: "View Demo" },
        style: {
          ...DEFAULT_STYLES.Button,
          paddingTop: "14px", paddingBottom: "14px",
          paddingLeft: "28px", paddingRight: "28px",
          backgroundColor: "transparent", color: "#a1a1aa",
          fontSize: "15px", fontWeight: "500",
          borderRadius: "8px",
          borderStyle: "solid", borderTopWidth: "1px", borderRightWidth: "1px",
          borderBottomWidth: "1px", borderLeftWidth: "1px", borderColor: "#3f3f46",
        },
      },
    ],
  },

  {
    id: "hero-split",
    name: "Hero — Split",
    category: "Sections",
    nodes: [
      {
        type: "Section",
        parentRef: null,
        style: {
          display: "flex", flexDirection: "column", width: "100%",
          minHeight: "560px", paddingTop: "64px", paddingBottom: "64px",
          paddingLeft: "64px", paddingRight: "64px", backgroundColor: "#ffffff",
        },
      },
      {
        type: "Container",
        parentRef: 0,
        style: { ...DEFAULT_STYLES.Container, flexDirection: "row", alignItems: "center", gap: "64px" },
      },
      { type: "Div", parentRef: 1, style: { display: "flex", flexDirection: "column", flex: "1", gap: "20px" } },
      {
        type: "H1", parentRef: 2,
        props: { text: "Ship faster with better tools" },
        style: { fontSize: "44px", fontWeight: "800", lineHeight: "1.2", color: "#09090b" },
      },
      {
        type: "Paragraph", parentRef: 2,
        props: { text: "Design, build, and deploy beautiful websites without leaving your browser." },
        style: { fontSize: "17px", lineHeight: "1.7", color: "#52525b" },
      },
      {
        type: "Button", parentRef: 2,
        props: { text: "Start building →" },
        style: { ...DEFAULT_STYLES.Button, paddingLeft: "24px", paddingRight: "24px", paddingTop: "12px", paddingBottom: "12px", borderRadius: "8px", fontSize: "15px" },
      },
      {
        type: "Image", parentRef: 1,
        props: { src: "https://placehold.co/560x400/7c3aed/ffffff?text=Hero+Image", alt: "Hero" },
        style: { flex: "1", borderRadius: "12px", display: "block", width: "100%", height: "auto" },
      },
    ],
  },

  {
    id: "features-grid",
    name: "Features — 3 Column",
    category: "Sections",
    nodes: [
      {
        type: "Section", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", width: "100%",
          paddingTop: "80px", paddingBottom: "80px", paddingLeft: "40px", paddingRight: "40px",
          backgroundColor: "#fafafa",
        },
      },
      {
        type: "Container", parentRef: 0,
        style: { ...DEFAULT_STYLES.Container, flexDirection: "column", gap: "48px" },
      },
      {
        type: "Div", parentRef: 1,
        style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
      },
      {
        type: "H2", parentRef: 2,
        props: { text: "Everything you need" },
        style: { fontSize: "36px", fontWeight: "700", color: "#09090b", textAlign: "center" },
      },
      {
        type: "Paragraph", parentRef: 2,
        props: { text: "Powerful features built for modern teams." },
        style: { fontSize: "16px", color: "#71717a", textAlign: "center" },
      },
      {
        type: "Grid", parentRef: 1,
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%" },
      },
      // Card 1
      {
        type: "Div", parentRef: 5,
        style: { display: "flex", flexDirection: "column", gap: "12px", paddingTop: "28px", paddingBottom: "28px", paddingLeft: "24px", paddingRight: "24px", backgroundColor: "#ffffff", borderRadius: "12px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "#e4e4e7" },
      },
      { type: "H3", parentRef: 6, props: { text: "⚡ Fast" }, style: { fontSize: "18px", fontWeight: "700", color: "#09090b" } },
      { type: "Paragraph", parentRef: 6, props: { text: "Blazing-fast visual editing with zero latency." }, style: { fontSize: "14px", color: "#71717a", lineHeight: "1.6" } },
      // Card 2
      {
        type: "Div", parentRef: 5,
        style: { display: "flex", flexDirection: "column", gap: "12px", paddingTop: "28px", paddingBottom: "28px", paddingLeft: "24px", paddingRight: "24px", backgroundColor: "#ffffff", borderRadius: "12px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "#e4e4e7" },
      },
      { type: "H3", parentRef: 9, props: { text: "🎨 Beautiful" }, style: { fontSize: "18px", fontWeight: "700", color: "#09090b" } },
      { type: "Paragraph", parentRef: 9, props: { text: "Pixel-perfect components designed by professionals." }, style: { fontSize: "14px", color: "#71717a", lineHeight: "1.6" } },
      // Card 3
      {
        type: "Div", parentRef: 5,
        style: { display: "flex", flexDirection: "column", gap: "12px", paddingTop: "28px", paddingBottom: "28px", paddingLeft: "24px", paddingRight: "24px", backgroundColor: "#ffffff", borderRadius: "12px", borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px", borderStyle: "solid", borderColor: "#e4e4e7" },
      },
      { type: "H3", parentRef: 12, props: { text: "🔌 Extensible" }, style: { fontSize: "18px", fontWeight: "700", color: "#09090b" } },
      { type: "Paragraph", parentRef: 12, props: { text: "Connect to any API or add custom code blocks." }, style: { fontSize: "14px", color: "#71717a", lineHeight: "1.6" } },
    ],
  },

  {
    id: "cta-dark",
    name: "CTA — Dark Banner",
    category: "Sections",
    nodes: [
      {
        type: "Section", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: "100%", minHeight: "280px",
          paddingTop: "64px", paddingBottom: "64px", paddingLeft: "40px", paddingRight: "40px",
          backgroundColor: "#09090b",
        },
      },
      {
        type: "Div", parentRef: 0,
        style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", maxWidth: "600px" },
      },
      {
        type: "H2", parentRef: 1,
        props: { text: "Ready to get started?" },
        style: { fontSize: "40px", fontWeight: "700", color: "#ffffff", textAlign: "center" },
      },
      {
        type: "Paragraph", parentRef: 1,
        props: { text: "Join thousands of builders shipping faster with Mintlay." },
        style: { fontSize: "16px", color: "#a1a1aa", textAlign: "center" },
      },
      {
        type: "Button", parentRef: 1,
        props: { text: "Start for free →" },
        style: {
          ...DEFAULT_STYLES.Button,
          paddingTop: "14px", paddingBottom: "14px", paddingLeft: "32px", paddingRight: "32px",
          backgroundColor: "#7c3aed", fontSize: "15px", fontWeight: "600", borderRadius: "8px",
        },
      },
    ],
  },

  {
    id: "simple-footer",
    name: "Footer — Simple",
    category: "Sections",
    nodes: [
      {
        type: "Section", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", width: "100%",
          paddingTop: "40px", paddingBottom: "40px", paddingLeft: "40px", paddingRight: "40px",
          backgroundColor: "#09090b",
          borderTopWidth: "1px", borderStyle: "solid", borderColor: "#27272a",
        },
      },
      {
        type: "Container", parentRef: 0,
        style: { ...DEFAULT_STYLES.Container, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
      },
      { type: "Text", parentRef: 1, props: { text: "© 2025 Mintlay. All rights reserved." }, style: { fontSize: "13px", color: "#71717a" } },
      {
        type: "Div", parentRef: 1,
        style: { display: "flex", flexDirection: "row", gap: "24px" },
      },
      { type: "Link", parentRef: 3, props: { text: "Privacy", href: "#" }, style: { fontSize: "13px", color: "#71717a", textDecoration: "none", cursor: "pointer" } },
      { type: "Link", parentRef: 3, props: { text: "Terms", href: "#" }, style: { fontSize: "13px", color: "#71717a", textDecoration: "none", cursor: "pointer" } },
      { type: "Link", parentRef: 3, props: { text: "Contact", href: "#" }, style: { fontSize: "13px", color: "#71717a", textDecoration: "none", cursor: "pointer" } },
    ],
  },

  // ── Navigation ─────────────────────────────────────────────────────────────

  {
    id: "navbar-simple",
    name: "Navbar — Simple",
    category: "Navigation",
    nodes: [
      {
        type: "Section", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", width: "100%",
          paddingTop: "0px", paddingBottom: "0px", paddingLeft: "0px", paddingRight: "0px",
          backgroundColor: "#ffffff",
          borderBottomWidth: "1px", borderStyle: "solid", borderColor: "#e4e4e7",
          position: "sticky", top: "0px", zIndex: "100",
        },
      },
      {
        type: "Container", parentRef: 0,
        style: { ...DEFAULT_STYLES.Container, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", paddingBottom: "16px" },
      },
      { type: "Text", parentRef: 1, props: { text: "Mintlay" }, style: { fontSize: "18px", fontWeight: "800", color: "#09090b", letterSpacing: "-0.02em" } },
      {
        type: "Div", parentRef: 1,
        style: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "center" },
      },
      { type: "Link", parentRef: 3, props: { text: "Home", href: "#" }, style: { fontSize: "14px", color: "#52525b", textDecoration: "none", fontWeight: "500", cursor: "pointer" } },
      { type: "Link", parentRef: 3, props: { text: "Features", href: "#" }, style: { fontSize: "14px", color: "#52525b", textDecoration: "none", fontWeight: "500", cursor: "pointer" } },
      { type: "Link", parentRef: 3, props: { text: "Pricing", href: "#" }, style: { fontSize: "14px", color: "#52525b", textDecoration: "none", fontWeight: "500", cursor: "pointer" } },
      {
        type: "Button", parentRef: 1,
        props: { text: "Get Started" },
        style: { ...DEFAULT_STYLES.Button, paddingLeft: "20px", paddingRight: "20px", paddingTop: "9px", paddingBottom: "9px", fontSize: "13px", fontWeight: "600", borderRadius: "7px" },
      },
    ],
  },

  // ── Cards ──────────────────────────────────────────────────────────────────

  {
    id: "card-feature",
    name: "Card — Feature",
    category: "Cards",
    nodes: [
      {
        type: "Div", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", gap: "16px",
          paddingTop: "32px", paddingBottom: "32px", paddingLeft: "28px", paddingRight: "28px",
          backgroundColor: "#ffffff", borderRadius: "16px",
          borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px",
          borderStyle: "solid", borderColor: "#e4e4e7",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          width: "100%",
        },
      },
      {
        type: "Div", parentRef: 0,
        style: {
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "44px", height: "44px", borderRadius: "10px",
          backgroundColor: "#f3e8ff",
        },
      },
      { type: "Text", parentRef: 1, props: { text: "⚡" }, style: { fontSize: "22px" } },
      { type: "H3", parentRef: 0, props: { text: "Lightning Fast" }, style: { fontSize: "18px", fontWeight: "700", color: "#09090b" } },
      { type: "Paragraph", parentRef: 0, props: { text: "Optimized for speed from the ground up. Zero compromises on performance." }, style: { fontSize: "14px", color: "#71717a", lineHeight: "1.6" } },
      { type: "Link", parentRef: 0, props: { text: "Learn more →", href: "#" }, style: { fontSize: "13px", color: "#7c3aed", textDecoration: "none", fontWeight: "600", cursor: "pointer" } },
    ],
  },

  {
    id: "card-pricing",
    name: "Card — Pricing",
    category: "Cards",
    nodes: [
      {
        type: "Div", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", gap: "0px",
          paddingTop: "32px", paddingBottom: "32px", paddingLeft: "28px", paddingRight: "28px",
          backgroundColor: "#ffffff", borderRadius: "16px",
          borderTopWidth: "1px", borderRightWidth: "1px", borderBottomWidth: "1px", borderLeftWidth: "1px",
          borderStyle: "solid", borderColor: "#e4e4e7",
          maxWidth: "320px",
        },
      },
      { type: "Text", parentRef: 0, props: { text: "Pro" }, style: { fontSize: "13px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" } },
      { type: "H2", parentRef: 0, props: { text: "$29" }, style: { fontSize: "48px", fontWeight: "800", color: "#09090b", lineHeight: "1", marginBottom: "4px" } },
      { type: "Text", parentRef: 0, props: { text: "per month" }, style: { fontSize: "14px", color: "#71717a", marginBottom: "24px" } },
      { type: "Divider", parentRef: 0, style: { ...DEFAULT_STYLES.Divider, marginTop: "0", marginBottom: "24px" } },
      { type: "Paragraph", parentRef: 0, props: { text: "✓  Unlimited projects" }, style: { fontSize: "14px", color: "#3f3f46", marginBottom: "8px" } },
      { type: "Paragraph", parentRef: 0, props: { text: "✓  Custom domain" }, style: { fontSize: "14px", color: "#3f3f46", marginBottom: "8px" } },
      { type: "Paragraph", parentRef: 0, props: { text: "✓  Priority support" }, style: { fontSize: "14px", color: "#3f3f46", marginBottom: "24px" } },
      {
        type: "Button", parentRef: 0,
        props: { text: "Get started" },
        style: { ...DEFAULT_STYLES.Button, width: "100%", justifyContent: "center", paddingTop: "12px", paddingBottom: "12px", borderRadius: "8px", fontWeight: "600" },
      },
    ],
  },

  // ── Forms ──────────────────────────────────────────────────────────────────

  {
    id: "form-contact",
    name: "Contact Form",
    category: "Forms",
    nodes: [
      {
        type: "Section", parentRef: null,
        style: {
          display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: "80px", paddingBottom: "80px", paddingLeft: "40px", paddingRight: "40px",
          backgroundColor: "#ffffff",
        },
      },
      {
        type: "Div", parentRef: 0,
        style: { display: "flex", flexDirection: "column", gap: "32px", width: "100%", maxWidth: "520px" },
      },
      { type: "H2", parentRef: 1, props: { text: "Get in touch" }, style: { fontSize: "32px", fontWeight: "700", color: "#09090b" } },
      { type: "Paragraph", parentRef: 1, props: { text: "We'll get back to you within 24 hours." }, style: { fontSize: "15px", color: "#71717a" } },
      {
        type: "Div", parentRef: 1,
        style: { display: "flex", flexDirection: "column", gap: "16px" },
      },
      {
        type: "Columns2", parentRef: 4,
        style: { display: "flex", flexDirection: "row", gap: "12px" },
      },
      { type: "Input", parentRef: 5, props: { placeholder: "First name" }, style: { ...DEFAULT_STYLES.Input } },
      { type: "Input", parentRef: 5, props: { placeholder: "Last name" }, style: { ...DEFAULT_STYLES.Input } },
      { type: "Input", parentRef: 4, props: { placeholder: "Email address" }, style: { ...DEFAULT_STYLES.Input } },
      { type: "Textarea", parentRef: 4, props: { placeholder: "Your message..." }, style: { ...DEFAULT_STYLES.Textarea, minHeight: "120px" } },
      {
        type: "Button", parentRef: 4,
        props: { text: "Send message" },
        style: { ...DEFAULT_STYLES.Button, paddingTop: "12px", paddingBottom: "12px", paddingLeft: "24px", paddingRight: "24px", fontWeight: "600", borderRadius: "8px", fontSize: "15px" },
      },
    ],
  },
];

export const COMPONENT_CATEGORIES = [...new Set(COMPONENT_TEMPLATES.map((t) => t.category))];
