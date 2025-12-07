import { describe, it, expect } from "vitest";
import { RingGeometry } from "./ring.geometry";
import { RING_RATIOS, RING_NAMES } from "../config/radar-config";

describe("RingGeometry", () => {
  describe("calculateRadii", () => {
    it("should calculate radii based on max radius and default ratios", () => {
      const maxRadius = 512;
      const radii = RingGeometry.calculateRadii(maxRadius);

      expect(radii).toHaveLength(RING_RATIOS.length);
      expect(radii[0]).toBe(0); // Center
      expect(radii[radii.length - 1]).toBe(maxRadius); // Outer edge
    });

    it("should scale radii proportionally to max radius", () => {
      const radii256 = RingGeometry.calculateRadii(256);
      const radii512 = RingGeometry.calculateRadii(512);

      for (let i = 0; i < radii256.length; i++) {
        expect(radii512[i]).toBe(radii256[i] * 2);
      }
    });

    it("should use custom ratios when provided", () => {
      const maxRadius = 100;
      const customRatios = [0, 0.25, 0.5, 0.75, 1] as const;
      const radii = RingGeometry.calculateRadii(maxRadius, customRatios);

      expect(radii).toEqual([0, 25, 50, 75, 100]);
    });

    it("should return correct values for default RING_RATIOS", () => {
      const maxRadius = 512;
      const radii = RingGeometry.calculateRadii(maxRadius);

      // Verify each radius matches the ratio * maxRadius
      RING_RATIOS.forEach((ratio, index) => {
        expect(radii[index]).toBeCloseTo(ratio * maxRadius, 5);
      });
    });

    it("should handle zero max radius", () => {
      const radii = RingGeometry.calculateRadii(0);
      expect(radii.every((r) => r === 0)).toBe(true);
    });
  });

  describe("getRadiusAtIndex", () => {
    const maxRadius = 512;

    it("should return correct radius for valid index", () => {
      const radius = RingGeometry.getRadiusAtIndex(0, maxRadius);
      expect(radius).toBe(0);

      const lastIndex = RING_RATIOS.length - 1;
      const outerRadius = RingGeometry.getRadiusAtIndex(lastIndex, maxRadius);
      expect(outerRadius).toBe(maxRadius);
    });

    it("should return 0 for negative index", () => {
      const radius = RingGeometry.getRadiusAtIndex(-1, maxRadius);
      expect(radius).toBe(0);
    });

    it("should return 0 for index out of bounds", () => {
      const radius = RingGeometry.getRadiusAtIndex(100, maxRadius);
      expect(radius).toBe(0);
    });

    it("should use custom ratios when provided", () => {
      const customRatios = [0, 0.5, 1] as const;
      const radius = RingGeometry.getRadiusAtIndex(1, 100, customRatios);
      expect(radius).toBe(50);
    });

    it("should match calculateRadii at same index", () => {
      const radii = RingGeometry.calculateRadii(maxRadius);

      for (let i = 0; i < RING_RATIOS.length; i++) {
        const singleRadius = RingGeometry.getRadiusAtIndex(i, maxRadius);
        expect(singleRadius).toBe(radii[i]);
      }
    });
  });

  describe("getLabelsOnSeparators", () => {
    const ringRadii = RingGeometry.calculateRadii(512);

    it("should return labels for all rings on both separator lines", () => {
      const labels = RingGeometry.getLabelsOnSeparators(ringRadii);

      // 4 rings * 2 separator lines (left and right)
      expect(labels).toHaveLength(RING_NAMES.length * 2);
    });

    it("should include all ring names", () => {
      const labels = RingGeometry.getLabelsOnSeparators(ringRadii);
      const labelNames = labels.map((l) => l.name);

      for (const ringName of RING_NAMES) {
        expect(labelNames).toContain(ringName);
      }
    });

    it("should have labels with x and name properties", () => {
      const labels = RingGeometry.getLabelsOnSeparators(ringRadii);

      for (const label of labels) {
        expect(label).toHaveProperty("x");
        expect(label).toHaveProperty("name");
        expect(typeof label.x).toBe("number");
        expect(typeof label.name).toBe("string");
      }
    });

    it("should position labels at midpoint of each ring on horizontal line", () => {
      const labels = RingGeometry.getLabelsOnSeparators(ringRadii);

      // Labels alternate: left (-x), right (+x) for each ring
      for (let i = 0; i < RING_NAMES.length; i++) {
        const leftLabel = labels[i * 2];
        const rightLabel = labels[i * 2 + 1];
        const expectedRadius = (ringRadii[i] + ringRadii[i + 1]) / 2;

        // Left label has negative x at midpoint radius
        expect(leftLabel.x).toBeCloseTo(-expectedRadius, 1);

        // Right label has positive x at midpoint radius
        expect(rightLabel.x).toBeCloseTo(expectedRadius, 1);
      }
    });

    it("should have symmetric labels on left and right", () => {
      const labels = RingGeometry.getLabelsOnSeparators(ringRadii);

      for (let i = 0; i < RING_NAMES.length; i++) {
        const leftLabel = labels[i * 2];
        const rightLabel = labels[i * 2 + 1];

        // Same name
        expect(leftLabel.name).toBe(rightLabel.name);

        // Symmetric x positions (opposite signs)
        expect(leftLabel.x).toBeCloseTo(-rightLabel.x, 5);
      }
    });
  });
});
