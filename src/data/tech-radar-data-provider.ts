import type { TechRadarData } from "./tech-radar-data";

export type RadarVersion = {
  id: string;
  name: string;
};

export type TechRadarDataProvider = {
  listVersions(): Promise<RadarVersion[]>;
  fetchVersion(versionId: string): Promise<TechRadarData>;
};
