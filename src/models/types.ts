import type { BlipStatus } from "../models/blip";

// Positioned blip for rendering (after collision detection)
export type PositionedBlip = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  ringIndex: number;
  isNew: boolean;
  status: BlipStatus | undefined;
  description: string;
  blipText: string;
  isGroup: boolean;
};

// Quadrant geometry configuration for positioning calculations
export type QuadrantGeometryConfig = {
  startAngle: number;
  quadrantSize: number;
  ringRadii: number[];
  center: { x: number; y: number };
};
