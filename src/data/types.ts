import type { BlipStatus } from '../models/blip'

// Raw blip data from data sources
export interface RawBlipData {
  name: string
  ring: string
  quadrant: string
  isNew: boolean
  status?: BlipStatus
  description?: string
  topic?: string
}

// Raw radar data structure
export interface RawRadarData {
  title?: string
  blips: RawBlipData[]
  rings?: string[]
  quadrants?: string[]
}

// Data provider interface for extensibility
export interface RadarDataProvider {
  fetchRadarData(): Promise<RawRadarData>
}

// Positioned blip for rendering (after collision detection)
export interface PositionedBlip {
  id: number
  name: string
  x: number
  y: number
  width: number
  ringIndex: number
  isNew: boolean
  status: BlipStatus | undefined
  description: string
  blipText: string
  isGroup: boolean
}

// Quadrant geometry configuration for positioning calculations
export interface QuadrantGeometry {
  startAngle: number
  quadrantSize: number
  ringRadii: number[]
  center: { x: number; y: number }
}
