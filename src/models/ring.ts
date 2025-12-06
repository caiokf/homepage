import { RING_RATIOS } from '../config/radar-config'

export class Ring {
  constructor(
    private _name: string,
    private _order: number
  ) {}

  get name(): string {
    return this._name
  }

  get order(): number {
    return this._order
  }

  /**
   * Calculate all ring radii based on max radius and ratios.
   * Returns array of radii from center (0) to outer edge.
   */
  static calculateRadii(
    maxRadius: number,
    ratios: readonly number[] = RING_RATIOS
  ): number[] {
    return ratios.map((ratio) => ratio * maxRadius)
  }

  /**
   * Get the radius for a specific ring index.
   */
  static getRadiusAtIndex(
    ringIndex: number,
    maxRadius: number,
    ratios: readonly number[] = RING_RATIOS
  ): number {
    if (ringIndex < 0 || ringIndex >= ratios.length) {
      return 0
    }
    return ratios[ringIndex] * maxRadius
  }
}
