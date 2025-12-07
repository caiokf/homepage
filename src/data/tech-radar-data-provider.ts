import type { TechRadarData } from "./tech-radar-data";

export interface TechRadarDataProvider {
  fetch(): Promise<TechRadarData>;
}
