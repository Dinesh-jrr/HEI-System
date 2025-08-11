export type Branch = {
  id: number;
  name: string;
  coords: [number, number];
  ipAddress: string;
  status: "up" | "down" | "unknown";
  history: { alive: boolean; checkedAt: string }[];
  pingHistory?: { alive: boolean }[]; 
  segments: { alive: boolean; checkedAt?: string }[];
};
