export interface Project {
  id: string;
  name: string;
  ownerAddress: string;
}
export interface UserHandshake {
  walletAddress: string;
  signature: string;
  timestamp: number;
}

export interface Blueprint {
  id: string;
  name: string;
  data: Record<string, any>;
  status: "active" | "synced" | "draft";
}
