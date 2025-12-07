import type { TechRadarData } from "./tech-radar-data";

export type TechRadarDataProvider = {
  fetch(): Promise<TechRadarData>;
};
