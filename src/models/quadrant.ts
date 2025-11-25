import { Blip } from "./blip";

export class Quadrant {
  private _blips: Blip[] = [];

  constructor(private _name: string) {}

  get name(): string {
    return this._name;
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
