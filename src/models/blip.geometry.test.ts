import { describe, it, expect } from "vitest";
import {
  BlipGeometry,
  IDEAL_BLIP_WIDTH,
  NEW_GROUP_BLIP_WIDTH,
  EXISTING_GROUP_BLIP_WIDTH,
} from "./blip.geometry";

describe("BlipGeometry", () => {
  describe("constants", () => {
    it("should export IDEAL_BLIP_WIDTH as 22", () => {
      expect(IDEAL_BLIP_WIDTH).toBe(22);
    });

    it("should export NEW_GROUP_BLIP_WIDTH as 88", () => {
      expect(NEW_GROUP_BLIP_WIDTH).toBe(88);
    });

    it("should export EXISTING_GROUP_BLIP_WIDTH as 124", () => {
      expect(EXISTING_GROUP_BLIP_WIDTH).toBe(124);
    });
  });

  describe("getGroupWidth", () => {
    it("should return NEW_GROUP_BLIP_WIDTH when isNew is true", () => {
      expect(BlipGeometry.getGroupWidth(true)).toBe(NEW_GROUP_BLIP_WIDTH);
    });

    it("should return EXISTING_GROUP_BLIP_WIDTH when isNew is false", () => {
      expect(BlipGeometry.getGroupWidth(false)).toBe(EXISTING_GROUP_BLIP_WIDTH);
    });
  });

  describe("getNewIndicatorPath", () => {
    it("should return a valid SVG path string", () => {
      const path = BlipGeometry.getNewIndicatorPath();
      expect(path).toBeTypeOf("string");
      expect(path.length).toBeGreaterThan(0);
    });

    it("should start with M command", () => {
      const path = BlipGeometry.getNewIndicatorPath();
      expect(path.startsWith("M")).toBe(true);
    });

    it("should return consistent path on multiple calls", () => {
      const path1 = BlipGeometry.getNewIndicatorPath();
      const path2 = BlipGeometry.getNewIndicatorPath();
      expect(path1).toBe(path2);
    });
  });

  describe("getMovedInIndicatorPath", () => {
    it("should return different paths for each quadrant", () => {
      const pathNE = BlipGeometry.getMovedInIndicatorPath("NE");
      const pathNW = BlipGeometry.getMovedInIndicatorPath("NW");
      const pathSW = BlipGeometry.getMovedInIndicatorPath("SW");
      const pathSE = BlipGeometry.getMovedInIndicatorPath("SE");

      expect(pathNE).not.toBe(pathNW);
      expect(pathNE).not.toBe(pathSW);
      expect(pathNE).not.toBe(pathSE);
      expect(pathNW).not.toBe(pathSW);
      expect(pathNW).not.toBe(pathSE);
      expect(pathSW).not.toBe(pathSE);
    });

    it("should return valid SVG path strings for all quadrants", () => {
      const positions = ["NE", "NW", "SW", "SE"] as const;

      for (const position of positions) {
        const path = BlipGeometry.getMovedInIndicatorPath(position);
        expect(path).toBeTypeOf("string");
        expect(path.length).toBeGreaterThan(0);
        expect(path.startsWith("M")).toBe(true);
      }
    });

    it("should return consistent path for same quadrant", () => {
      const path1 = BlipGeometry.getMovedInIndicatorPath("NE");
      const path2 = BlipGeometry.getMovedInIndicatorPath("NE");
      expect(path1).toBe(path2);
    });
  });

  describe("getMovedOutIndicatorPath", () => {
    it("should return different paths for each quadrant", () => {
      const pathNE = BlipGeometry.getMovedOutIndicatorPath("NE");
      const pathNW = BlipGeometry.getMovedOutIndicatorPath("NW");
      const pathSW = BlipGeometry.getMovedOutIndicatorPath("SW");
      const pathSE = BlipGeometry.getMovedOutIndicatorPath("SE");

      expect(pathNE).not.toBe(pathNW);
      expect(pathNE).not.toBe(pathSW);
      expect(pathNE).not.toBe(pathSE);
      expect(pathNW).not.toBe(pathSW);
      expect(pathNW).not.toBe(pathSE);
      expect(pathSW).not.toBe(pathSE);
    });

    it("should return valid SVG path strings for all quadrants", () => {
      const positions = ["NE", "NW", "SW", "SE"] as const;

      for (const position of positions) {
        const path = BlipGeometry.getMovedOutIndicatorPath(position);
        expect(path).toBeTypeOf("string");
        expect(path.length).toBeGreaterThan(0);
        expect(path.startsWith("M")).toBe(true);
      }
    });

    it("should return different paths than getMovedInIndicatorPath", () => {
      const positions = ["NE", "NW", "SW", "SE"] as const;

      for (const position of positions) {
        const movedIn = BlipGeometry.getMovedInIndicatorPath(position);
        const movedOut = BlipGeometry.getMovedOutIndicatorPath(position);
        expect(movedIn).not.toBe(movedOut);
      }
    });
  });
});
