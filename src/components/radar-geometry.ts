import type { QuadrantOrder } from '../config/radar-config'
import { RING_NAMES } from '../config/radar-config'

/**
 * Calculate viewBox offset for zoomed quadrant view
 */
export function getZoomedViewBoxOffset(
  order: QuadrantOrder,
  radarSize: number
): { x: number; y: number } {
  const center = radarSize / 2
  switch (order) {
    case 'first': // top-right
      return { x: center, y: 0 }
    case 'second': // top-left
      return { x: 0, y: 0 }
    case 'third': // bottom-left
      return { x: 0, y: center }
    case 'fourth': // bottom-right
      return { x: center, y: center }
    default:
      return { x: 0, y: 0 }
  }
}

/**
 * Calculate X position for quadrant label
 */
export function getQuadrantLabelX(order: QuadrantOrder, outerRadius: number): number {
  const offset = 30

  switch (order) {
    case 'first': // top-left quadrant
      return -outerRadius + offset
    case 'second': // bottom-left quadrant
      return -outerRadius + offset
    case 'third': // top-right quadrant
      return outerRadius - offset - 150
    case 'fourth': // bottom-right quadrant
      return outerRadius - offset - 150
    default:
      return 0
  }
}

/**
 * Calculate Y position for quadrant label
 */
export function getQuadrantLabelY(order: QuadrantOrder, outerRadius: number): number {
  const offset = 30

  switch (order) {
    case 'first': // top-left quadrant
      return -outerRadius + offset
    case 'second': // bottom-left quadrant
      return outerRadius - 2 * offset
    case 'third': // top-right quadrant
      return -outerRadius + offset
    case 'fourth': // bottom-right quadrant
      return outerRadius - 2 * offset
    default:
      return 0
  }
}

export interface SeparatorLine {
  angle: number
  x1: number
  y1: number
  x2: number
  y2: number
}

/**
 * Calculate separator lines between quadrants
 */
export function getSeparatorLines(outerRadius: number): SeparatorLine[] {
  const boundaryAngles = [0, 90, -90, 180]

  return boundaryAngles.map((angle) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180

    return {
      angle,
      x1: 0,
      y1: 0,
      x2: outerRadius * Math.sin(angleInRadians),
      y2: -outerRadius * Math.cos(angleInRadians),
    }
  })
}

export interface RingLabel {
  x: number
  y: number
  name: string
}

/**
 * Calculate ring label positions on separator lines
 */
export function getRingLabelsOnSeparators(ringRadii: number[]): RingLabel[] {
  const labels: RingLabel[] = []
  const angles = [0, 180] // 0° = left, 180° = right

  for (const angle of angles) {
    const angleInRadians = ((angle - 90) * Math.PI) / 180

    for (let i = 0; i < RING_NAMES.length; i++) {
      const radius = (ringRadii[i] + ringRadii[i + 1]) / 2

      labels.push({
        x: radius * Math.sin(angleInRadians),
        y: -radius * Math.cos(angleInRadians),
        name: RING_NAMES[i],
      })
    }
  }

  return labels
}

/**
 * SVG path for "new" blip indicator (outer circle)
 */
export function getOuterCirclePath(): string {
  return 'M18 36C8.07 36 0 27.93 0 18S8.07 0 18 0c9.92 0 18 8.07 18 18S27.93 36 18 36zM18 3.14C9.81 3.14 3.14 9.81 3.14 18S9.81 32.86 18 32.86S32.86 26.19 32.86 18S26.19 3.14 18 3.14z'
}

/**
 * SVG path for "moved in" blip indicator (pointing toward center)
 */
export function getMovedInPath(order: QuadrantOrder): string {
  const paths: Record<QuadrantOrder, string> = {
    first:
      'M16.5 34.44c0-.86.7-1.56 1.56-1.56c8.16 0 14.8-6.64 14.8-14.8c0-.86.7-1.56 1.56-1.56c.86 0 1.56.7 1.56 1.56C36 27.96 27.96 36 18.07 36C17.2 36 16.5 35.3 16.5 34.44z',
    second:
      'M16.5 1.56c0 .86.7 1.56 1.56 1.56c8.16 0 14.8 6.64 14.8 14.8c0 .86.7 1.56 1.56 1.56c.86 0 1.56-.7 1.56-1.56C36 8.04 27.96 0 18.07 0C17.2 0 16.5.7 16.5 1.56z',
    third:
      'M19.5 34.44c0-.86-.7-1.56-1.56-1.56c-8.16 0-14.8-6.64-14.8-14.8c0-.86-.7-1.56-1.56-1.56S0 17.2 0 18.07C0 27.96 8.04 36 17.93 36C18.8 36 19.5 35.3 19.5 34.44z',
    fourth:
      'M19.5 1.56c0 0.86-0.7 1.56-1.56 1.56c-8.16 0-14.8 6.64-14.8 14.8c0 0.86-0.7 1.56-1.56 1.56S0 18.8 0 17.93C0 8.04 8.04 0 17.93 0C18.8 0 19.5 0.7 19.5 1.56z',
  }
  return paths[order]
}

/**
 * SVG path for "moved out" blip indicator (pointing away from center)
 */
export function getMovedOutPath(order: QuadrantOrder): string {
  const paths: Record<QuadrantOrder, string> = {
    first:
      'M19.5 1.56c0 0.86-0.7 1.56-1.56 1.56c-8.16 0-14.8 6.64-14.8 14.8c0 0.86-0.7 1.56-1.56 1.56S0 18.8 0 17.93C0 8.04 8.04 0 17.93 0C18.8 0 19.5 0.7 19.5 1.56z',
    second:
      'M19.5 34.44c0-.86-.7-1.56-1.56-1.56c-8.16 0-14.8-6.64-14.8-14.8c0-.86-.7-1.56-1.56-1.56S0 17.2 0 18.07C0 27.96 8.04 36 17.93 36C18.8 36 19.5 35.3 19.5 34.44z',
    third:
      'M16.5 1.56c0 .86.7 1.56 1.56 1.56c8.16 0 14.8 6.64 14.8 14.8c0 .86.7 1.56 1.56 1.56c.86 0 1.56-.7 1.56-1.56C36 8.04 27.96 0 18.07 0C17.2 0 16.5.7 16.5 1.56z',
    fourth:
      'M16.5 34.44c0-.86.7-1.56 1.56-1.56c8.16 0 14.8-6.64 14.8-14.8c0-.86.7-1.56 1.56-1.56c.86 0 1.56.7 1.56 1.56C36 27.96 27.96 36 18.07 36C17.2 36 16.5 35.3 16.5 34.44z',
  }
  return paths[order]
}
