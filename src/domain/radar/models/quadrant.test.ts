import { describe, it, expect, beforeEach } from "vitest";
import { Quadrant } from "./quadrant";
import { Blip } from "./blip";
import { Ring } from "./ring";

describe("Quadrant", () => {
  let ring: Ring;
  let quadrant: Quadrant;

  beforeEach(() => {
    ring = new Ring("Adopt", 1);
    quadrant = new Quadrant("NE", "Techniques");
  });

  describe("constructor", () => {
    it("should create a quadrant with a position and custom name", () => {
      expect(quadrant.position).toBe("NE");
      expect(quadrant.name).toBe("Techniques");
    });

    it("should set start angle based on position", () => {
      const neQuadrant = new Quadrant("NE", "Tools");
      const nwQuadrant = new Quadrant("NW", "Techniques");
      const swQuadrant = new Quadrant("SW", "Platforms");
      const seQuadrant = new Quadrant("SE", "Languages");

      // Position labels match visual location:
      // NW (top-left): startAngle 0
      // SW (bottom-left): startAngle -90
      // NE (top-right): startAngle 90
      // SE (bottom-right): startAngle -180
      expect(nwQuadrant.startAngle).toBe(0);
      expect(swQuadrant.startAngle).toBe(-90);
      expect(neQuadrant.startAngle).toBe(90);
      expect(seQuadrant.startAngle).toBe(-180);
    });

    it("should start with empty blips array", () => {
      expect(quadrant.blips()).toEqual([]);
    });
  });

  describe("add", () => {
    it("should add a single blip", () => {
      const blip = new Blip("React", ring, true);
      quadrant.add(blip);
      const blips = quadrant.blips();
      expect(blips).toHaveLength(1);
      expect(blips[0]).toBe(blip);
    });

    it("should add multiple blips from an array", () => {
      const blip1 = new Blip("React", ring, true);
      const blip2 = new Blip("Vue", ring, true);
      const blip3 = new Blip("Angular", ring, false);

      quadrant.add([blip1, blip2, blip3]);
      const blips = quadrant.blips();
      expect(blips).toHaveLength(3);
      expect(blips).toContain(blip1);
      expect(blips).toContain(blip2);
      expect(blips).toContain(blip3);
    });

    it("should append to existing blips", () => {
      const blip1 = new Blip("React", ring, true);
      const blip2 = new Blip("Vue", ring, true);
      const blip3 = new Blip("Angular", ring, false);

      quadrant.add(blip1);
      quadrant.add([blip2, blip3]);
      const blips = quadrant.blips();
      expect(blips).toHaveLength(3);
    });

    it("should handle adding empty array", () => {
      quadrant.add([]);
      expect(quadrant.blips()).toHaveLength(0);
    });
  });

  describe("blips", () => {
    it("should return a copy of the blips array", () => {
      const blip = new Blip("React", ring, true);
      quadrant.add(blip);
      const blips1 = quadrant.blips();
      const blips2 = quadrant.blips();
      expect(blips1).not.toBe(blips2); // Different array instances
      expect(blips1).toEqual(blips2); // Same content
    });

    it("should not allow mutation of internal array", () => {
      const blip = new Blip("React", ring, true);
      quadrant.add(blip);
      const blips = quadrant.blips();
      blips.push(new Blip("Vue", ring, true));
      expect(quadrant.blips()).toHaveLength(1); // Original unchanged
    });
  });

  describe("name", () => {
    it("should return the quadrant name", () => {
      const quadrant = new Quadrant("SW", "Tools");
      expect(quadrant.name).toBe("Tools");
    });
  });
});
