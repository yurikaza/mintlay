# 🏗️ Architect UI: Recursive Visual Web Builder

A professional-grade, **tree-based** visual website builder architecture. This project enables users to construct complex, nested web layouts using a drag-and-drop interface that mirrors the actual DOM (Document Object Model) structure of modern websites.

---

## 📖 Project Overview

Architect UI is designed for developers and designers who need more than just a "stacking" tool. While basic builders only allow elements to be placed one after another in a flat list, this engine supports **Infinite Nesting**.

By treating every component as a potential container, users can build layouts that follow standard web principles:

- **Sections** define the large vertical blocks of the page.
- **Grids and Divs** inside those sections handle horizontal alignment and spacing.
- **UI Elements** (Buttons, Text, Images) live inside the structural containers.

---

## ✨ Key Features

### 1. Recursive Drag & Drop

Powered by `@dnd-kit/core`. Unlike standard drag-and-drop, our system identifies whether a target is a "Container" or a "Leaf." If you drop an element onto a Section or a Div, the system automatically assigns that container as the new element's `parentId`.

### 2. Side-by-Side Grid System

The builder leverages **CSS Flexbox** and **Grid** natively. By setting a parent container to `flex-row`, child elements naturally sit side-by-side. This allows users to create complex multi-column layouts without absolute positioning.

### 3. Tree-State Architecture

Built with **Zustand**. The application state is stored as a flat array of objects (for database efficiency) but is dynamically transformed into a recursive tree structure during rendering. This ensures high performance even with hundreds of nested elements.

### 4. Bulletproof Data Hydration

The system includes a robust "Safe-Parsing" layer. It gracefully handles:

- **Empty Projects:** Prevents crashes when the database returns empty strings or null arrays.
- **Malformed JSON:** Includes try/catch blocks that prevent `SyntaxError` from breaking the UI.
- **State Sync:** Automatically merges server-side project data into the local Zustand store on initial load.

### 5. Professional UI/UX

- **Visual Drop Indicators:** Real-time feedback showing exactly where an element will land.
- **Active Selection:** Highlighting the currently selected node to edit properties.
- **Tabbed Sidebar:** Dedicated panels for Elements (Structure), Page Management, and a "Navigator" tree view.

---

## 🧠 Technical Deep Dive

### The Data Model

Each element is a `ComponentData` object. The `parentId` is the "glue" that holds the tree together.

```json
{
  "id": "7b2a39b1-8c4d",
  "type": "Div",
  "parentId": "section-uuid-101",
  "props": {
    "className": "flex-1 flex flex-row gap-4 p-6 bg-zinc-50 border border-dashed"
  }
}
```
