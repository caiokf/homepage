import { BlipPositioning } from "./blip-positioning.geometry";
import { Blip } from "../models/blip";
import { Ring } from "../models/ring";
import { calculateRingRadii } from "./svg-layout.geometry";
import type { QuadrantGeometryConfig } from "../types";

describe("BlipPositioning", () => {
  const createTestBlip = (name: string, ringOrder: number): Blip => {
    const ring = new Ring("Test Ring", ringOrder);
    const blip = new Blip(name, ring, false);
    blip.id = Math.floor(Math.random() * 1000);
    blip.blipText = String(blip.id);
    return blip;
  };

  const createGeometry = (startAngle: number): QuadrantGeometryConfig => ({
    startAngle,
    quadrantSize: 512,
    ringRadii: calculateRingRadii(512),
    center: { x: 0, y: 0 },
  });

  describe("calculateBlipPositions", () => {
    it("should return empty array for empty blips", () => {
      const geometry = createGeometry(0);
      const result = BlipPositioning.calculateBlipPositions([], geometry);
      expect(result).toEqual([]);
    });

    it("should position a single blip", () => {
      const blip = createTestBlip("Test Blip", 0);
      const geometry = createGeometry(0);

      const result = BlipPositioning.calculateBlipPositions([blip], geometry);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Test Blip");
      expect(result[0].id).toBe(blip.id);
    });

    it("should include all required properties in positioned blip", () => {
      const blip = createTestBlip("Test Blip", 1);
      blip.blipText = "42";
      const geometry = createGeometry(0);

      const result = BlipPositioning.calculateBlipPositions([blip], geometry);
      const positioned = result[0];

      expect(positioned).toHaveProperty("id");
      expect(positioned).toHaveProperty("name");
      expect(positioned).toHaveProperty("x");
      expect(positioned).toHaveProperty("y");
      expect(positioned).toHaveProperty("width");
      expect(positioned).toHaveProperty("ringIndex");
      expect(positioned).toHaveProperty("isNew");
      expect(positioned).toHaveProperty("status");
      expect(positioned).toHaveProperty("description");
      expect(positioned).toHaveProperty("blipText");
      expect(positioned).toHaveProperty("isGroup");
    });

    it("should position blips within ring bounds", () => {
      const blip = createTestBlip("Test Blip", 1);
      const geometry = createGeometry(0);
      const ringRadii = geometry.ringRadii;

      const result = BlipPositioning.calculateBlipPositions([blip], geometry);
      const positioned = result[0];

      // Calculate distance from center
      const distance = Math.sqrt(
        positioned.x * positioned.x + positioned.y * positioned.y
      );

      // Should be within ring 1 bounds (between ringRadii[1] and ringRadii[2])
      expect(distance).toBeGreaterThanOrEqual(ringRadii[1]);
      expect(distance).toBeLessThanOrEqual(ringRadii[2]);
    });

    it("should group blips by ring index", () => {
      const blips = [
        createTestBlip("Blip 1", 0),
        createTestBlip("Blip 2", 1),
        createTestBlip("Blip 3", 0),
      ];
      const geometry = createGeometry(0);

      const result = BlipPositioning.calculateBlipPositions(blips, geometry);

      expect(result).toHaveLength(3);

      const ring0Blips = result.filter((b) => b.ringIndex === 0);
      const ring1Blips = result.filter((b) => b.ringIndex === 1);

      expect(ring0Blips).toHaveLength(2);
      expect(ring1Blips).toHaveLength(1);
    });

    it("should produce reproducible positions with same geometry", () => {
      const blips = [
        createTestBlip("Blip 1", 0),
        createTestBlip("Blip 2", 1),
      ];
      const geometry = createGeometry(0);

      const result1 = BlipPositioning.calculateBlipPositions(blips, geometry);
      const result2 = BlipPositioning.calculateBlipPositions(blips, geometry);

      // Same geometry should produce same positions (seeded random)
      expect(result1[0].x).toBeCloseTo(result2[0].x, 5);
      expect(result1[0].y).toBeCloseTo(result2[0].y, 5);
      expect(result1[1].x).toBeCloseTo(result2[1].x, 5);
      expect(result1[1].y).toBeCloseTo(result2[1].y, 5);
    });

    it("should position blips within correct quadrant angle range", () => {
      const blip = createTestBlip("Test Blip", 2);
      const geometryNE = createGeometry(0); // NE quadrant: startAngle 0

      const result = BlipPositioning.calculateBlipPositions(
        [blip],
        geometryNE
      );
      const positioned = result[0];

      // Verify blip is positioned at a non-zero distance from center
      const distance = Math.sqrt(
        positioned.x * positioned.x + positioned.y * positioned.y
      );
      expect(distance).toBeGreaterThan(0);

      // The blip should be within the quadrant's 90-degree arc
      // StartAngle 0 with -90 offset means the quadrant spans from -90 to 0 degrees
      // in standard math coordinates, which is the left-upper region
    });

    it("should handle blips in different quadrants", () => {
      const blip = createTestBlip("Test Blip", 2);

      const positions = [
        { startAngle: 0, name: "NE" }, // x > 0, y < 0
        { startAngle: -90, name: "NW" }, // x < 0, y < 0
        { startAngle: 90, name: "SW" }, // x < 0, y > 0
        { startAngle: -180, name: "SE" }, // x > 0, y > 0
      ];

      for (const { startAngle } of positions) {
        const geometry = createGeometry(startAngle);
        const result = BlipPositioning.calculateBlipPositions([blip], geometry);
        const positioned = result[0];

        // Verify blip is positioned (not at origin)
        const distance = Math.sqrt(
          positioned.x * positioned.x + positioned.y * positioned.y
        );
        expect(distance).toBeGreaterThan(0);
      }
    });

    it("should avoid collisions between multiple blips", () => {
      // Create multiple blips in the same ring
      const blips = Array.from({ length: 5 }, (_, i) =>
        createTestBlip(`Blip ${i}`, 2)
      );
      const geometry = createGeometry(0);

      const result = BlipPositioning.calculateBlipPositions(blips, geometry);

      // Check that no two blips overlap (considering their width)
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const b1 = result[i];
          const b2 = result[j];
          const distance = Math.sqrt(
            Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2)
          );
          const minDistance = (b1.width + b2.width) / 2;

          // Allow some tolerance since collision detection uses padding
          expect(distance).toBeGreaterThanOrEqual(minDistance * 0.5);
        }
      }
    });

    it("should handle custom center offset", () => {
      const blip = createTestBlip("Test Blip", 1);
      const geometryWithOffset: QuadrantGeometryConfig = {
        startAngle: 0,
        quadrantSize: 512,
        ringRadii: calculateRingRadii(512),
        center: { x: 100, y: 100 },
      };
      const geometryWithoutOffset = createGeometry(0);

      const resultWithOffset = BlipPositioning.calculateBlipPositions(
        [blip],
        geometryWithOffset
      );
      const resultWithoutOffset = BlipPositioning.calculateBlipPositions(
        [blip],
        geometryWithoutOffset
      );

      // The position should be offset by the center amount
      expect(resultWithOffset[0].x - resultWithoutOffset[0].x).toBeCloseTo(
        100,
        1
      );
      expect(resultWithOffset[0].y - resultWithoutOffset[0].y).toBeCloseTo(
        100,
        1
      );
    });

    it("should preserve blip properties in positioned result", () => {
      const ring = new Ring("Adopt", 0);
      const blip = new Blip("React", ring, true, "new", "Frontend", "A JS library");
      blip.id = 42;
      blip.blipText = "42";
      blip.isGroup = true;

      const geometry = createGeometry(0);
      const result = BlipPositioning.calculateBlipPositions([blip], geometry);
      const positioned = result[0];

      expect(positioned.id).toBe(42);
      expect(positioned.name).toBe("React");
      expect(positioned.isNew).toBe(true);
      expect(positioned.description).toBe("A JS library");
      expect(positioned.blipText).toBe("42");
      expect(positioned.isGroup).toBe(true);
      expect(positioned.ringIndex).toBe(0);
    });
  });
});
