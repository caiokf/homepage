import { Quadrant } from "./quadrant";
import { Ring } from "./ring";
import { Blip } from "./blip";

// Exception types - handle if files don't exist
class MalformedDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MalformedDataError";
  }
}

const ExceptionMessages = {
  TOO_MANY_QUADRANTS: "Too many quadrants",
  LESS_THAN_FOUR_QUADRANTS: "Less than four quadrants",
};

interface QuadrantConfig {
  order: "first" | "second" | "third" | "fourth";
  startAngle: number;
  quadrant?: Quadrant;
}

type RingsMap = Record<string, Ring>;

export class Radar {
  private _blipNumber: number = 0;
  private _addingQuadrant: number = 0;
  private _quadrants: QuadrantConfig[] = [
    { order: "first", startAngle: 0 },
    { order: "second", startAngle: -90 },
    { order: "third", startAngle: 90 },
    { order: "fourth", startAngle: -180 },
  ];
  private _alternatives: string[] = [];
  private _currentSheetName: string = "";
  private _rings: RingsMap = {};

  private setNumbers(blips: Blip[]): void {
    blips.forEach((blip) => {
      ++this._blipNumber;
      blip.blipText = this._blipNumber.toString();
      blip.id = this._blipNumber;
    });
  }

  addAlternative(sheetName: string): void {
    this._alternatives.push(sheetName);
  }

  get alternatives(): string[] {
    return this._alternatives;
  }

  set currentSheet(value: string) {
    this._currentSheetName = value;
  }

  get currentSheet(): string {
    return this._currentSheetName;
  }

  addQuadrant(quadrant: Quadrant): void {
    if (this._addingQuadrant >= 4) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS);
    }
    this._quadrants[this._addingQuadrant].quadrant = quadrant;
    this.setNumbers(quadrant.blips());
    this._addingQuadrant++;
  }

  addRings(allRings: RingsMap): void {
    this._rings = allRings;
  }

  set rings(value: RingsMap) {
    this._rings = value;
  }

  get rings(): RingsMap {
    return this._rings;
  }

  get quadrants(): QuadrantConfig[] {
    return this._quadrants;
  }
}
