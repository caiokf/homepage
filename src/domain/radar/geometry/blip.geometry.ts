import {
  type QuadrantPosition,
  BLIP_NEW_GROUP_WIDTH,
  BLIP_EXISTING_GROUP_WIDTH,
} from "../constants";

/**
 * Static geometry calculations for Blip rendering.
 */
export class BlipGeometry {
  /**
   * Get blip width based on whether it's a group and new/existing.
   */
  static getGroupWidth(isNew: boolean): number {
    return isNew ? BLIP_NEW_GROUP_WIDTH : BLIP_EXISTING_GROUP_WIDTH;
  }

  /**
   * SVG path for "new" blip indicator (outer circle).
   */
  static getNewIndicatorPath(): string {
    return "M18 36C8.07 36 0 27.93 0 18S8.07 0 18 0c9.92 0 18 8.07 18 18S27.93 36 18 36zM18 3.14C9.81 3.14 3.14 9.81 3.14 18S9.81 32.86 18 32.86S32.86 26.19 32.86 18S26.19 3.14 18 3.14z";
  }

  /**
   * SVG path for "moved in" blip indicator (pointing toward center).
   * Position labels match visual location (NW = top-left, etc.)
   */
  static getMovedInIndicatorPath(position: QuadrantPosition): string {
    // Moved in = pointing toward center (inner rings)
    // NW (top-left): points bottom-right
    // NE (top-right): points bottom-left
    // SW (bottom-left): points top-right
    // SE (bottom-right): points top-left
    const paths: Record<QuadrantPosition, string> = {
      NW: "M16.5 34.44c0-.86.7-1.56 1.56-1.56c8.16 0 14.8-6.64 14.8-14.8c0-.86.7-1.56 1.56-1.56c.86 0 1.56.7 1.56 1.56C36 27.96 27.96 36 18.07 36C17.2 36 16.5 35.3 16.5 34.44z",
      SW: "M16.5 1.56c0 .86.7 1.56 1.56 1.56c8.16 0 14.8 6.64 14.8 14.8c0 .86.7 1.56 1.56 1.56c.86 0 1.56-.7 1.56-1.56C36 8.04 27.96 0 18.07 0C17.2 0 16.5.7 16.5 1.56z",
      NE: "M19.5 34.44c0-.86-.7-1.56-1.56-1.56c-8.16 0-14.8-6.64-14.8-14.8c0-.86-.7-1.56-1.56-1.56S0 17.2 0 18.07C0 27.96 8.04 36 17.93 36C18.8 36 19.5 35.3 19.5 34.44z",
      SE: "M19.5 1.56c0 0.86-0.7 1.56-1.56 1.56c-8.16 0-14.8 6.64-14.8 14.8c0 0.86-0.7 1.56-1.56 1.56S0 18.8 0 17.93C0 8.04 8.04 0 17.93 0C18.8 0 19.5 0.7 19.5 1.56z",
    };
    return paths[position];
  }

  /**
   * SVG path for "moved out" blip indicator (pointing away from center).
   * Position labels match visual location (NW = top-left, etc.)
   */
  static getMovedOutIndicatorPath(position: QuadrantPosition): string {
    // Moved out = pointing away from center (outer rings)
    // NW (top-left): points top-left
    // NE (top-right): points top-right
    // SW (bottom-left): points bottom-left
    // SE (bottom-right): points bottom-right
    const paths: Record<QuadrantPosition, string> = {
      NW: "M19.5 1.56c0 0.86-0.7 1.56-1.56 1.56c-8.16 0-14.8 6.64-14.8 14.8c0 0.86-0.7 1.56-1.56 1.56S0 18.8 0 17.93C0 8.04 8.04 0 17.93 0C18.8 0 19.5 0.7 19.5 1.56z",
      SW: "M19.5 34.44c0-.86-.7-1.56-1.56-1.56c-8.16 0-14.8-6.64-14.8-14.8c0-.86-.7-1.56-1.56-1.56S0 17.2 0 18.07C0 27.96 8.04 36 17.93 36C18.8 36 19.5 35.3 19.5 34.44z",
      NE: "M16.5 1.56c0 .86.7 1.56 1.56 1.56c8.16 0 14.8 6.64 14.8 14.8c0 .86.7 1.56 1.56 1.56c.86 0 1.56-.7 1.56-1.56C36 8.04 27.96 0 18.07 0C17.2 0 16.5.7 16.5 1.56z",
      SE: "M16.5 34.44c0-.86.7-1.56 1.56-1.56c8.16 0 14.8-6.64 14.8-14.8c0-.86.7-1.56 1.56-1.56c.86 0 1.56.7 1.56 1.56C36 27.96 27.96 36 18.07 36C17.2 36 16.5 35.3 16.5 34.44z",
    };
    return paths[position];
  }
}
