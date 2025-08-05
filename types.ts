export type Branch = {
  id: string;
  name: string;
  coords: [number, number];
  ipAddress: string;
  status: "up" | "down" | "unknown";
  history: { alive: boolean; checkedAt: string }[];
  pingHistory?: { alive: boolean }[]; 
};
