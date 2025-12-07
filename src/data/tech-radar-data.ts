import type { BlipStatus } from "../models/blip";

export type TechRadarBlipData = {
  name: string;
  ring: string;
  quadrant: string;
  isNew: boolean;
  status?: BlipStatus;
  description?: string;
  topic?: string;
};

export type TechRadarData = {
  title?: string;
  blips: TechRadarBlipData[];
  rings?: string[];
  quadrants?: string[];
};
