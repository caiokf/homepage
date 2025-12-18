import {
  calculateRingRadii,
  getRingRadiusAtIndex,
  getRingLabelsOnSeparators,
} from "./svg-layout.geometry";
import { RING_RATIOS, RING_NAMES } from "../constants";

describe("Ring Geometry", () => {
  describe("calculateRingRadii", () => {
    it("should calculate radii based on max radius and default ratios", () => {
      const maxRadius = 512;
      const radii = calculateRingRadii(maxRadius);

      expect(radii).toHaveLength(RING_RATIOS.length);
      expect(radii[0]).toBe(RING_RATIOS[0] * maxRadius); // Inner edge with buffer
      expect(radii[radii.length - 1]).toBe(maxRadius); // Outer edge
    });

    it("should scale radii proportionally to max radius", () => {
      const radii256 = calculateRingRadii(256);
      const radii512 = calculateRingRadii(512);

      for (let i = 0; i < radii256.length; i++) {
        expect(radii512[i]).toBe(radii256[i] * 2);
      }
    });

    it("should use custom ratios when provided", () => {
      const maxRadius = 100;
      const customRatios = [0, 0.25, 0.5, 0.75, 1] as const;
      const radii = calculateRingRadii(maxRadius, customRatios);

      expect(radii).toEqual([0, 25, 50, 75, 100]);
    });

    it("should return correct values for default RING_RATIOS", () => {
      const maxRadius = 512;
      const radii = calculateRingRadii(maxRadius);

      // Verify each radius matches the ratio * maxRadius
      RING_RATIOS.forEach((ratio, index) => {
        expect(radii[index]).toBeCloseTo(ratio * maxRadius, 5);
      });
    });

    it("should handle zero max radius", () => {
      const radii = calculateRingRadii(0);
      expect(radii.every((r) => r === 0)).toBe(true);
    });
  });

  describe("getRingRadiusAtIndex", () => {
    const maxRadius = 512;

    it("should return correct radius for valid index", () => {
      const radius = getRingRadiusAtIndex(0, maxRadius);
      expect(radius).toBe(RING_RATIOS[0] * maxRadius); // Inner edge with buffer

      const lastIndex = RING_RATIOS.length - 1;
      const outerRadius = getRingRadiusAtIndex(lastIndex, maxRadius);
      expect(outerRadius).toBe(maxRadius);
    });

    it("should return 0 for negative index", () => {
      const radius = getRingRadiusAtIndex(-1, maxRadius);
      expect(radius).toBe(0);
    });

    it("should return 0 for index out of bounds", () => {
      const radius = getRingRadiusAtIndex(100, maxRadius);
      expect(radius).toBe(0);
    });

    it("should use custom ratios when provided", () => {
      const customRatios = [0, 0.5, 1] as const;
      const radius = getRingRadiusAtIndex(1, 100, customRatios);
      expect(radius).toBe(50);
    });

    it("should match calculateRingRadii at same index", () => {
      const radii = calculateRingRadii(maxRadius);

      for (let i = 0; i < RING_RATIOS.length; i++) {
        const singleRadius = getRingRadiusAtIndex(i, maxRadius);
        expect(singleRadius).toBe(radii[i]);
      }
    });
  });

  describe("getRingLabelsOnSeparators", () => {
    const ringRadii = calculateRingRadii(512);

    it("should return labels for all rings on both separator lines", () => {
      const labels = getRingLabelsOnSeparators(ringRadii);

      // 4 rings * 2 separator lines (left and right)
      expect(labels).toHaveLength(RING_NAMES.length * 2);
    });

    it("should include all ring names", () => {
      const labels = getRingLabelsOnSeparators(ringRadii);
      const labelNames = labels.map((l) => l.name);

      for (const ringName of RING_NAMES) {
        expect(labelNames).toContain(ringName);
      }
    });

    it("should have labels with x and name properties", () => {
      const labels = getRingLabelsOnSeparators(ringRadii);

      for (const label of labels) {
        expect(label).toHaveProperty("x");
        expect(label).toHaveProperty("name");
        expect(typeof label.x).toBe("number");
        expect(typeof label.name).toBe("string");
      }
    });

    it("should position labels at midpoint of each ring on horizontal line", () => {
      const labels = getRingLabelsOnSeparators(ringRadii);

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
      const labels = getRingLabelsOnSeparators(ringRadii);

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
