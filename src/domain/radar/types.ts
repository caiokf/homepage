// =============================================================================
// RADAR TYPES
// Core type definitions for the Tech Radar visualization
// =============================================================================

import type { BlipStatus } from "./models/blip";

export type QuadrantPosition = "NE" | "NW" | "SE" | "SW";

export type RingName = "proven" | "experimental" | "learning" | "avoid";

export type ViewMode = "radar" | "list";

/**
 * Positioned blip for rendering (after collision detection).
 */
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

/**
 * Quadrant geometry configuration for positioning calculations.
 */
export type QuadrantGeometryConfig = {
  startAngle: number;
  quadrantSize: number;
  ringRadii: number[];
  center: { x: number; y: number };
};
