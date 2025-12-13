import { Ring } from "./ring";
import { BLIP_WIDTH } from "../constants";
import { BlipGeometry } from "../geometry/blip-rendering.geometry";

export type BlipStatus = "new" | "moved in" | "moved out" | "no change";

export class Blip {
  private _blipText: string = "";
  private _isGroup: boolean = false;
  private _id: number = -1;
  private _groupIdInGraph: string = "";
  public readonly width: number = BLIP_WIDTH;

  constructor(
    private _name: string,
    private _ring: Ring,
    private _isNew: boolean,
    private _status?: BlipStatus,
    private _topic?: string,
    private _description?: string
  ) {}

  get name(): string {
    return this._name;
  }

  get id(): number {
    return this._id || -1;
  }

  set id(value: number) {
    this._id = value;
  }

  groupBlipWidth(): number {
    return BlipGeometry.getGroupWidth(this._isNew);
  }

  get topic(): string {
    return this._topic || "";
  }

  get description(): string {
    return this._description || "";
  }

  get isNew(): boolean {
    if (this._status) {
      return this._status.toLowerCase() === "new";
    }
    return this._isNew;
  }

  hasMovedIn(): boolean {
    return this._status?.toLowerCase() === "moved in";
  }

  hasMovedOut(): boolean {
    return this._status?.toLowerCase() === "moved out";
  }

  hasNoChange(): boolean {
    return this._status?.toLowerCase() === "no change";
  }

  get ring(): Ring {
    return this._ring;
  }

  get status(): string {
    return this._status?.toLowerCase() || "";
  }

  get isGroup(): boolean {
    return this._isGroup;
  }

  set isGroup(value: boolean) {
    this._isGroup = value;
  }

  get groupIdInGraph(): string {
    return this._groupIdInGraph || "";
  }

  set groupIdInGraph(value: string) {
    this._groupIdInGraph = value;
  }

  get blipText(): string {
    return this._blipText || "";
  }

  set blipText(value: string) {
    this._blipText = value;
  }
}
