import { describe, it, expect } from "vitest";
import { RadarGeometry } from "./radar.geometry";

describe("RadarGeometry", () => {
  describe("getZoomedViewBoxOffset", () => {
    const radarSize = 1024;
    const center = radarSize / 2;

    it("should return top-right offset for NE quadrant", () => {
      const offset = RadarGeometry.getZoomedViewBoxOffset("NE", radarSize);
      expect(offset).toEqual({ x: center, y: 0 });
    });

    it("should return top-left offset for NW quadrant", () => {
      const offset = RadarGeometry.getZoomedViewBoxOffset("NW", radarSize);
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    it("should return bottom-left offset for SW quadrant", () => {
      const offset = RadarGeometry.getZoomedViewBoxOffset("SW", radarSize);
      expect(offset).toEqual({ x: 0, y: center });
    });

    it("should return bottom-right offset for SE quadrant", () => {
      const offset = RadarGeometry.getZoomedViewBoxOffset("SE", radarSize);
      expect(offset).toEqual({ x: center, y: center });
    });

    it("should scale offsets proportionally to radar size", () => {
      const smallSize = 512;
      const largeSize = 1024;

      const smallOffset = RadarGeometry.getZoomedViewBoxOffset("NE", smallSize);
      const largeOffset = RadarGeometry.getZoomedViewBoxOffset("NE", largeSize);

      expect(largeOffset.x).toBe(smallOffset.x * 2);
      expect(largeOffset.y).toBe(smallOffset.y * 2);
    });

    it("should handle all quadrant positions", () => {
      const positions = ["NE", "NW", "SW", "SE"] as const;

      for (const position of positions) {
        const offset = RadarGeometry.getZoomedViewBoxOffset(position, radarSize);
        expect(offset).toHaveProperty("x");
        expect(offset).toHaveProperty("y");
        expect(typeof offset.x).toBe("number");
        expect(typeof offset.y).toBe("number");
      }
    });
  });

  describe("getQuadrantLabelX", () => {
    const outerRadius = 512;

    it("should return left-aligned position for NE quadrant", () => {
      const x = RadarGeometry.getQuadrantLabelX("NE", outerRadius);
      expect(x).toBeLessThan(0); // Left side of center
    });

    it("should return left-aligned position for NW quadrant", () => {
      const x = RadarGeometry.getQuadrantLabelX("NW", outerRadius);
      expect(x).toBeLessThan(0); // Left side of center
    });

    it("should return right-aligned position for SW quadrant", () => {
      const x = RadarGeometry.getQuadrantLabelX("SW", outerRadius);
      expect(x).toBeGreaterThan(0); // Right side of center
    });

    it("should return right-aligned position for SE quadrant", () => {
      const x = RadarGeometry.getQuadrantLabelX("SE", outerRadius);
      expect(x).toBeGreaterThan(0); // Right side of center
    });

    it("should return same x for NE and NW quadrants", () => {
      const xNE = RadarGeometry.getQuadrantLabelX("NE", outerRadius);
      const xNW = RadarGeometry.getQuadrantLabelX("NW", outerRadius);
      expect(xNE).toBe(xNW);
    });

    it("should return same x for SW and SE quadrants", () => {
      const xSW = RadarGeometry.getQuadrantLabelX("SW", outerRadius);
      const xSE = RadarGeometry.getQuadrantLabelX("SE", outerRadius);
      expect(xSW).toBe(xSE);
    });

    it("should scale with outer radius", () => {
      const x256 = RadarGeometry.getQuadrantLabelX("NE", 256);
      const x512 = RadarGeometry.getQuadrantLabelX("NE", 512);

      // The offset is fixed, so the difference should scale with radius
      expect(x512).toBeLessThan(x256);
    });
  });

  describe("getQuadrantLabelY", () => {
    const outerRadius = 512;

    it("should return top position for NE quadrant", () => {
      const y = RadarGeometry.getQuadrantLabelY("NE", outerRadius);
      expect(y).toBeLessThan(0); // Top of center
    });

    it("should return bottom position for NW quadrant", () => {
      const y = RadarGeometry.getQuadrantLabelY("NW", outerRadius);
      expect(y).toBeGreaterThan(0); // Bottom of center
    });

    it("should return top position for SW quadrant", () => {
      const y = RadarGeometry.getQuadrantLabelY("SW", outerRadius);
      expect(y).toBeLessThan(0); // Top of center
    });

    it("should return bottom position for SE quadrant", () => {
      const y = RadarGeometry.getQuadrantLabelY("SE", outerRadius);
      expect(y).toBeGreaterThan(0); // Bottom of center
    });

    it("should return same y for NE and SW quadrants", () => {
      const yNE = RadarGeometry.getQuadrantLabelY("NE", outerRadius);
      const ySW = RadarGeometry.getQuadrantLabelY("SW", outerRadius);
      expect(yNE).toBe(ySW);
    });

    it("should return same y for NW and SE quadrants", () => {
      const yNW = RadarGeometry.getQuadrantLabelY("NW", outerRadius);
      const ySE = RadarGeometry.getQuadrantLabelY("SE", outerRadius);
      expect(yNW).toBe(ySE);
    });
  });

  describe("getSeparatorLines", () => {
    const outerRadius = 512;

    it("should return 4 separator lines", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);
      expect(lines).toHaveLength(4);
    });

    it("should have lines at angles 0, 90, -90, and 180", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);
      const angles = lines.map((l) => l.angle);

      expect(angles).toContain(0);
      expect(angles).toContain(90);
      expect(angles).toContain(-90);
      expect(angles).toContain(180);
    });

    it("should start all lines at the center (0, 0)", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);

      for (const line of lines) {
        expect(line.x1).toBe(0);
        expect(line.y1).toBe(0);
      }
    });

    it("should end lines at the outer radius", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);

      for (const line of lines) {
        const length = Math.sqrt(line.x2 * line.x2 + line.y2 * line.y2);
        expect(length).toBeCloseTo(outerRadius, 5);
      }
    });

    it("should have correct structure for each line", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);

      for (const line of lines) {
        expect(line).toHaveProperty("angle");
        expect(line).toHaveProperty("x1");
        expect(line).toHaveProperty("y1");
        expect(line).toHaveProperty("x2");
        expect(line).toHaveProperty("y2");
      }
    });

    it("should position line at 0 degrees pointing left (after -90 offset)", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);
      const line0 = lines.find((l) => l.angle === 0);

      // Angle 0 with -90 offset = -90 degrees = pointing left
      expect(line0).toBeDefined();
      expect(line0!.x2).toBeCloseTo(-outerRadius, 5);
      expect(line0!.y2).toBeCloseTo(0, 5);
    });

    it("should position line at 90 degrees pointing up (after -90 offset)", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);
      const line90 = lines.find((l) => l.angle === 90);

      // Angle 90 with -90 offset = 0 radians, sin(0)=0, -cos(0)=-1
      // So x2=0, y2=-outerRadius (pointing up in SVG)
      expect(line90).toBeDefined();
      expect(line90!.x2).toBeCloseTo(0, 5);
      expect(line90!.y2).toBeCloseTo(-outerRadius, 5);
    });

    it("should position line at -90 degrees pointing down (after -90 offset)", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);
      const lineNeg90 = lines.find((l) => l.angle === -90);

      // Angle -90 with -90 offset = -180 degrees = PI radians, sin(PI)~=0, -cos(PI)=1
      // So x2~=0, y2=outerRadius (pointing down in SVG)
      expect(lineNeg90).toBeDefined();
      expect(lineNeg90!.x2).toBeCloseTo(0, 5);
      expect(lineNeg90!.y2).toBeCloseTo(outerRadius, 5);
    });

    it("should position line at 180 degrees pointing right (after -90 offset)", () => {
      const lines = RadarGeometry.getSeparatorLines(outerRadius);
      const line180 = lines.find((l) => l.angle === 180);

      // Angle 180 with -90 offset = 90 degrees = pointing right
      expect(line180).toBeDefined();
      expect(line180!.x2).toBeCloseTo(outerRadius, 5);
      expect(line180!.y2).toBeCloseTo(0, 5);
    });

    it("should scale line endpoints with outer radius", () => {
      const lines256 = RadarGeometry.getSeparatorLines(256);
      const lines512 = RadarGeometry.getSeparatorLines(512);

      for (let i = 0; i < lines256.length; i++) {
        expect(lines512[i].x2).toBeCloseTo(lines256[i].x2 * 2, 5);
        expect(lines512[i].y2).toBeCloseTo(lines256[i].y2 * 2, 5);
      }
    });
  });
});
