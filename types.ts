export type Branch = {
  lat: number;
  lng: number;
  id: number;
  name: string;
  coords: [number, number];
  ipAddress: string;
  status: "up" | "down";
  history: { alive: boolean; checkedAt: string }[];
  pingHistory?: { alive: boolean }[]; 
  segments: { alive: boolean; checkedAt?: string }[];
  provinceCode: string;
};

export type LatLngExpression = [number, number];

export interface Ping {
  id: string;
  from: LatLngExpression;
  to: LatLngExpression;
  progress: number;
  status: "up" | "down"; // include all expected statuses
  latency?: number; // if you want to keep track of latency
}
