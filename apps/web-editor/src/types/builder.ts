// types/builder.ts
export interface ComponentData {
  id: string;
  type: string;
  parentId: string | null; // <-- NEW: Determines nesting
  props: Record<string, any>;
}

export interface WebsiteBlueprint {
  projectId: string;
  components: ComponentData[];
}
