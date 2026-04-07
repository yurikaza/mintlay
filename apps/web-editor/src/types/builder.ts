// types/builder.ts

export interface StyleProps {
  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  flexWrap?: string;
  gap?: string;
  columnGap?: string;
  rowGap?: string;
  flex?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  // Sizing
  width?: string;
  height?: string;
  maxWidth?: string;
  minWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  // Spacing
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  color?: string;
  whiteSpace?: string;
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  // Border
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomRightRadius?: string;
  borderBottomLeftRadius?: string;
  // Effects
  opacity?: string;
  boxShadow?: string;
  filter?: string;
  backdropFilter?: string;
  transition?: string;
  // Position
  position?: string;
  overflow?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  cursor?: string;
  // Allow any additional CSS property
  [key: string]: string | undefined;
}

export interface NodeData {
  id: string;
  type: string;
  parentId: string | null;
  props: {
    text?: string;
    src?: string;
    href?: string;
    alt?: string;
    placeholder?: string;
    target?: string;
    [key: string]: any;
  };
  style: StyleProps;
}

// ── Element categories for the sidebar ─────────────────────────────────────

export interface ElementDef {
  type: string;
  label: string;
  icon: string; // lucide icon name
  description: string;
}

export const ELEMENT_CATEGORIES: { label: string; elements: ElementDef[] }[] =
  [
    {
      label: "Structure",
      elements: [
        {
          type: "Section",
          label: "Section",
          icon: "LayoutTemplate",
          description: "Full-width page section",
        },
        {
          type: "Container",
          label: "Container",
          icon: "Square",
          description: "Centered max-width wrapper",
        },
        {
          type: "Div",
          label: "Div",
          icon: "Box",
          description: "Generic block container",
        },
        {
          type: "Grid",
          label: "Grid",
          icon: "Grid3x3",
          description: "CSS Grid layout",
        },
        {
          type: "Columns2",
          label: "2 Columns",
          icon: "Columns2",
          description: "Two-column flex row",
        },
        {
          type: "Columns3",
          label: "3 Columns",
          icon: "Columns3",
          description: "Three-column flex row",
        },
      ],
    },
    {
      label: "Typography",
      elements: [
        {
          type: "H1",
          label: "Heading 1",
          icon: "Heading1",
          description: "Large page heading",
        },
        {
          type: "H2",
          label: "Heading 2",
          icon: "Heading2",
          description: "Section heading",
        },
        {
          type: "H3",
          label: "Heading 3",
          icon: "Heading3",
          description: "Sub-section heading",
        },
        {
          type: "H4",
          label: "Heading 4",
          icon: "Heading4",
          description: "Sub-section heading",
        },
        {
          type: "Paragraph",
          label: "Paragraph",
          icon: "AlignLeft",
          description: "Body text paragraph",
        },
        {
          type: "Text",
          label: "Text",
          icon: "Type",
          description: "Inline text span",
        },
        {
          type: "Link",
          label: "Link",
          icon: "Link",
          description: "Hyperlink element",
        },
      ],
    },
    {
      label: "Interactive",
      elements: [
        {
          type: "Button",
          label: "Button",
          icon: "MousePointerClick",
          description: "Clickable button",
        },
        {
          type: "Input",
          label: "Input",
          icon: "TextCursorInput",
          description: "Text input field",
        },
        {
          type: "Textarea",
          label: "Textarea",
          icon: "FileText",
          description: "Multi-line text input",
        },
        {
          type: "Select",
          label: "Select",
          icon: "ChevronDown",
          description: "Dropdown select",
        },
      ],
    },
    {
      label: "Media",
      elements: [
        {
          type: "Image",
          label: "Image",
          icon: "Image",
          description: "Image element",
        },
        {
          type: "Video",
          label: "Video",
          icon: "Video",
          description: "Video embed",
        },
        {
          type: "Divider",
          label: "Divider",
          icon: "Minus",
          description: "Horizontal rule",
        },
      ],
    },
  ];

// ── Which types can accept children ────────────────────────────────────────

export const CONTAINER_TYPES = new Set([
  "Section",
  "Container",
  "Div",
  "Grid",
  "Columns2",
  "Columns3",
  "Column",
]);

// ── Default styles per element type ────────────────────────────────────────

export const DEFAULT_STYLES: Record<string, StyleProps> = {
  Section: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "200px",
    paddingTop: "48px",
    paddingRight: "32px",
    paddingBottom: "48px",
    paddingLeft: "32px",
    backgroundColor: "#ffffff",
  },
  Container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  Div: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  Grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    width: "100%",
  },
  Columns2: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    width: "100%",
  },
  Columns3: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    width: "100%",
  },
  Column: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "0",
  },
  H1: {
    fontSize: "48px",
    fontWeight: "700",
    lineHeight: "1.2",
    color: "#111827",
    marginBottom: "16px",
  },
  H2: {
    fontSize: "36px",
    fontWeight: "700",
    lineHeight: "1.3",
    color: "#111827",
    marginBottom: "12px",
  },
  H3: {
    fontSize: "28px",
    fontWeight: "600",
    lineHeight: "1.3",
    color: "#111827",
    marginBottom: "8px",
  },
  H4: {
    fontSize: "22px",
    fontWeight: "600",
    lineHeight: "1.4",
    color: "#111827",
  },
  H5: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  H6: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  Paragraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#374151",
    marginBottom: "8px",
  },
  Text: {
    fontSize: "16px",
    color: "#374151",
  },
  Link: {
    fontSize: "16px",
    color: "#3b82f6",
    textDecoration: "underline",
    cursor: "pointer",
  },
  Button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10px",
    paddingRight: "20px",
    paddingBottom: "10px",
    paddingLeft: "20px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "6px",
    cursor: "pointer",
    borderStyle: "none",
  },
  Input: {
    display: "block",
    width: "100%",
    paddingTop: "8px",
    paddingRight: "12px",
    paddingBottom: "8px",
    paddingLeft: "12px",
    fontSize: "14px",
    borderTopWidth: "1px",
    borderRightWidth: "1px",
    borderBottomWidth: "1px",
    borderLeftWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: "4px",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  Textarea: {
    display: "block",
    width: "100%",
    minHeight: "80px",
    paddingTop: "8px",
    paddingRight: "12px",
    paddingBottom: "8px",
    paddingLeft: "12px",
    fontSize: "14px",
    borderTopWidth: "1px",
    borderRightWidth: "1px",
    borderBottomWidth: "1px",
    borderLeftWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: "4px",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  Select: {
    display: "block",
    width: "100%",
    paddingTop: "8px",
    paddingRight: "12px",
    paddingBottom: "8px",
    paddingLeft: "12px",
    fontSize: "14px",
    borderTopWidth: "1px",
    borderRightWidth: "1px",
    borderBottomWidth: "1px",
    borderLeftWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: "4px",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  Image: {
    display: "block",
    width: "100%",
    height: "auto",
  },
  Video: {
    display: "block",
    width: "100%",
    height: "auto",
  },
  Divider: {
    display: "block",
    width: "100%",
    borderBottomWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    marginTop: "16px",
    marginBottom: "16px",
  },
};

// ── Default text props per element type ────────────────────────────────────

export const DEFAULT_PROPS: Record<string, Record<string, any>> = {
  H1: { text: "Heading 1" },
  H2: { text: "Heading 2" },
  H3: { text: "Heading 3" },
  H4: { text: "Heading 4" },
  H5: { text: "Heading 5" },
  H6: { text: "Heading 6" },
  Paragraph: { text: "Start typing your content here. Click to select, double-click to edit." },
  Text: { text: "Text block" },
  Link: { text: "Click here", href: "#", target: "_self" },
  Button: { text: "Click Me" },
  Input: { placeholder: "Enter text..." },
  Textarea: { placeholder: "Enter text..." },
  Select: { placeholder: "Select option..." },
  Image: {
    src: "https://placehold.co/800x400/e2e8f0/94a3b8?text=Image",
    alt: "Image",
  },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export interface PageData {
  id: string;
  name: string;
  slug: string; // e.g. "/" or "/about"
}

// ── Saved project format (scripts[0]) ────────────────────────────────────────

export interface SavedProject {
  version: 2;
  pages: PageData[];
  pageNodes: Record<string, NodeData[]>;
  currentPageId: string;
}

// ── Legacy alias (backwards compat with useProject.ts) ─────────────────────
export type ComponentData = NodeData;
