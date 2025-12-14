/**
 * Seeded random number generator for reproducible blip positioning.
 */
export class SeededRandom {
  private _seed: number;

  constructor(seed: number) {
    this._seed = seed;
  }

  get seed(): number {
    return this._seed;
  }

  next(): number {
    this._seed = (this._seed * 9301 + 49297) % 233280;
    return this._seed / 233280;
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }
}
