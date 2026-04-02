// types/builder.ts
export interface ComponentData {
  id: string;
  type: "Hero" | "Navbar" | "Footer" | "TextSection";
  props: {
    text?: string;
    backgroundColor?: string;
    imageUrl?: string;
    animationType?: "fade" | "slide" | "zoom";
  };
}

export interface WebsiteBlueprint {
  projectId: string;
  components: ComponentData[];
}
