import { Blip } from "./blip";
import { type QuadrantPosition, QUADRANT_CONFIG } from "../constants";

export class Quadrant {
  private _blips: Blip[] = [];
  private _name: string;
  private _position: QuadrantPosition;
  private _startAngle: number;

  constructor(position: QuadrantPosition, name?: string) {
    this._position = position;
    this._startAngle = QUADRANT_CONFIG[position].startAngle;
    this._name = name ?? QUADRANT_CONFIG[position].defaultName;
  }

  get name(): string {
    return this._name;
  }

  get position(): QuadrantPosition {
    return this._position;
  }

  get startAngle(): number {
    return this._startAngle;
  }

  add(newBlips: Blip | Blip[]): void {
    if (Array.isArray(newBlips)) {
      this._blips = this._blips.concat(newBlips);
    } else {
      this._blips.push(newBlips);
    }
  }

  blips(): Blip[] {
    return this._blips.slice(0);
  }
}
