// types/project.ts
export interface Project {
  id: string;
  name: string;
  plan: string;
  scripts: string[];
  updatedAt: string;
  hash?: string; // For that "Cyber" look in your UI
}
