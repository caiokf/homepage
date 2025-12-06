import { Blip } from './blip'
import type { PositionedBlip, QuadrantGeometry } from '../data/types'

// Seeded random number generator for reproducible positioning
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1))
  }
}

interface BlipCoordinate {
  x: number
  y: number
  width: number
}

export class Quadrant {
  private _blips: Blip[] = []

  constructor(private _name: string) {}

  get name(): string {
    return this._name
  }

  add(newBlips: Blip | Blip[]): void {
    if (Array.isArray(newBlips)) {
      this._blips = this._blips.concat(newBlips)
    } else {
      this._blips.push(newBlips)
    }
  }

  blips(): Blip[] {
    return this._blips.slice(0)
  }

  /**
   * Calculate positioned blips with collision detection for rendering.
   * Uses seeded random for reproducible positions.
   */
  calculateBlipPositions(geometry: QuadrantGeometry): PositionedBlip[] {
    const { startAngle, quadrantSize, ringRadii, center } = geometry
    const positioned: PositionedBlip[] = []
    const allCoordinates: BlipCoordinate[] = []

    // Determine quadrant adjustment factors based on start angle
    const { adjustX, adjustY } = this.getQuadrantAdjustments(startAngle)

    // Create seeded random for reproducibility
    const seed = Math.PI * quadrantSize * quadrantSize * ringRadii.length * 200
    const random = new SeededRandom(seed)

    // Group blips by ring
    const blipsByRing = this.groupBlipsByRing()

    // Position blips ring by ring
    for (const [ringIndex, ringBlips] of blipsByRing.entries()) {
      const minRadius = ringRadii[ringIndex]
      const maxRadius = ringRadii[ringIndex + 1]

      for (const blip of ringBlips) {
        const coords = this.findBlipPosition(
          blip,
          minRadius,
          maxRadius,
          startAngle,
          adjustX,
          adjustY,
          center,
          allCoordinates,
          random
        )

        allCoordinates.push({ x: coords.x, y: coords.y, width: blip.width })

        positioned.push({
          id: blip.id,
          name: blip.name,
          x: coords.x,
          y: coords.y,
          width: blip.width,
          ringIndex,
          isNew: blip.isNew,
          status: blip.status as PositionedBlip['status'],
          description: blip.description,
          blipText: blip.blipText,
          isGroup: blip.isGroup,
        })
      }
    }

    return positioned
  }

  private groupBlipsByRing(): Map<number, Blip[]> {
    const groups = new Map<number, Blip[]>()
    for (const blip of this._blips) {
      const ringIndex = blip.ring.order
      if (!groups.has(ringIndex)) {
        groups.set(ringIndex, [])
      }
      groups.get(ringIndex)!.push(blip)
    }
    return groups
  }

  private getQuadrantAdjustments(startAngle: number): {
    adjustX: number
    adjustY: number
  } {
    // Quadrant adjustments based on start angle
    // first (0): +x, -y | second (-90): -x, -y | third (90): -x, +y | fourth (-180): +x, +y
    switch (startAngle) {
      case 0:
        return { adjustX: 1, adjustY: -1 }
      case -90:
        return { adjustX: -1, adjustY: -1 }
      case 90:
        return { adjustX: -1, adjustY: 1 }
      case -180:
        return { adjustX: 1, adjustY: 1 }
      default:
        return { adjustX: 1, adjustY: -1 }
    }
  }

  private findBlipPosition(
    blip: Blip,
    minRadius: number,
    maxRadius: number,
    _startAngle: number,
    adjustX: number,
    adjustY: number,
    center: { x: number; y: number },
    allCoordinates: BlipCoordinate[],
    random: SeededRandom
  ): { x: number; y: number } {
    const maxIterations = 200
    let coords = { x: 0, y: 0 }

    for (let i = 0; i < maxIterations; i++) {
      coords = this.calculateBlipCoordinates(
        blip.width,
        minRadius,
        maxRadius,
        adjustX,
        adjustY,
        center,
        random
      )

      if (!this.hasCollision(coords.x, coords.y, blip.width, allCoordinates)) {
        break
      }
    }

    return coords
  }

  private calculateBlipCoordinates(
    blipWidth: number,
    minRadius: number,
    maxRadius: number,
    adjustX: number,
    adjustY: number,
    center: { x: number; y: number },
    random: SeededRandom
  ): { x: number; y: number } {
    // Random radius within ring bounds, accounting for blip size
    const radius = random.float(
      minRadius + blipWidth / 2,
      maxRadius - blipWidth
    )

    // Calculate angle delta to prevent boundary overlap
    let angleDelta = (Math.asin(blipWidth / 2 / radius) * 180) / (Math.PI - 1.25)
    angleDelta = Math.min(angleDelta, 45)

    // Random angle within quadrant (90 degree span)
    const angleDegrees = random.int(Math.ceil(angleDelta), 90 - Math.floor(angleDelta))
    const angle = (angleDegrees * Math.PI) / 180

    // Convert polar to Cartesian with quadrant adjustments
    const x = center.x + radius * Math.cos(angle) * adjustX
    const y = center.y + radius * Math.sin(angle) * adjustY

    return { x, y }
  }

  private hasCollision(
    x: number,
    y: number,
    width: number,
    allCoordinates: BlipCoordinate[]
  ): boolean {
    const padding = 10 // Collision buffer

    return allCoordinates.some((coord) => {
      const minDistance = coord.width / 2 + width / 2 + padding
      return (
        Math.abs(coord.x - x) < minDistance &&
        Math.abs(coord.y - y) < minDistance
      )
    })
  }
}
