import { describe, it, expect, beforeEach, vi } from "vitest";
import { Radar } from "./radar";

describe("Radar", () => {
  let radar: Radar;

  beforeEach(() => {
    radar = new Radar();
  });

  describe("constructor", () => {
    it("should initialize with empty rings", () => {
      expect(radar.rings).toEqual({});
    });

    it("should initialize with four quadrants", () => {
      const quadrants = radar.quadrants;
      expect(quadrants).toHaveLength(4);
      expect(quadrants[0].position).toBe("NE");
      expect(quadrants[1].position).toBe("NW");
      expect(quadrants[2].position).toBe("SW");
      expect(quadrants[3].position).toBe("SE");
    });

    it("should have default quadrant names", () => {
      const quadrants = radar.quadrants;
      // Order: NE, NW, SW, SE (from QUADRANT_POSITIONS)
      expect(quadrants[0].name).toBe("Tools"); // NE
      expect(quadrants[1].name).toBe("Techniques"); // NW
      expect(quadrants[2].name).toBe("Platforms"); // SW
      expect(quadrants[3].name).toBe("Languages & Frameworks"); // SE
    });

    it("should have correct start angles for quadrants", () => {
      const quadrants = radar.quadrants;
      // Order: NE, NW, SW, SE (from QUADRANT_POSITIONS)
      // NE (top-right): 90, NW (top-left): 0, SW (bottom-left): -90, SE (bottom-right): -180
      expect(quadrants[0].startAngle).toBe(90); // NE
      expect(quadrants[1].startAngle).toBe(0); // NW
      expect(quadrants[2].startAngle).toBe(-90); // SW
      expect(quadrants[3].startAngle).toBe(-180); // SE
    });
  });

  describe("getQuadrant", () => {
    it("should return quadrant by position", () => {
      const ne = radar.getQuadrant("NE");
      const nw = radar.getQuadrant("NW");
      const sw = radar.getQuadrant("SW");
      const se = radar.getQuadrant("SE");

      expect(ne.position).toBe("NE");
      expect(nw.position).toBe("NW");
      expect(sw.position).toBe("SW");
      expect(se.position).toBe("SE");
    });
  });

  describe("create", () => {
    it("should create a radar from TechRadarData", () => {
      const data = {
        title: "Test Radar",
        blips: [
          { name: "TypeScript", ring: "Adopt", quadrant: "Techniques", isNew: true, status: "new" as const, description: "Typed JavaScript" },
          { name: "AWS", ring: "Adopt", quadrant: "Platforms", isNew: false },
          { name: "Vite", ring: "Trial", quadrant: "Tools", isNew: false },
          { name: "Vue", ring: "Adopt", quadrant: "Languages & Frameworks", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      expect(radar.quadrants).toHaveLength(4);
      // NE is the first position, which maps to "Techniques" (kebab-cased)
      const neQuadrant = radar.getQuadrant("NE");
      expect(neQuadrant.name).toBe("techniques");
      expect(neQuadrant.blips()).toHaveLength(1);
      expect(neQuadrant.blips()[0].name).toBe("TypeScript");
    });

    it("should throw error if not exactly 4 quadrant names in blips", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Blip2", ring: "Adopt", quadrant: "Platforms", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      expect(() => Radar.create(data)).toThrow(
        "Expected exactly 4 quadrant names, but found 2: [Techniques, Platforms]"
      );
    });

    it("should throw error if no blips provided", () => {
      const data = {
        blips: [],
      };

      expect(() => Radar.create(data)).toThrow(
        "Expected exactly 4 quadrant names, but found 0: []"
      );
    });

    it("should assign sequential IDs to blips", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Blip2", ring: "Trial", quadrant: "Platforms", isNew: true },
          { name: "Blip3", ring: "Assess", quadrant: "Tools", isNew: false },
          { name: "Blip4", ring: "Hold", quadrant: "Languages", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      const allBlips = radar.quadrants.flatMap((q) => q.blips());
      expect(allBlips[0].id).toBe(1);
      expect(allBlips[1].id).toBe(2);
      expect(allBlips[2].id).toBe(3);
      expect(allBlips[3].id).toBe(4);
    });

    it("should handle blips in all quadrants", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Blip2", ring: "Adopt", quadrant: "Platforms", isNew: true },
          { name: "Blip3", ring: "Trial", quadrant: "Tools", isNew: false },
          { name: "Blip4", ring: "Hold", quadrant: "Languages & Frameworks", isNew: true },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      expect(radar.getQuadrant("NE").blips()).toHaveLength(1);
      expect(radar.getQuadrant("NW").blips()).toHaveLength(1);
      expect(radar.getQuadrant("SW").blips()).toHaveLength(1);
      expect(radar.getQuadrant("SE").blips()).toHaveLength(1);
    });

    it("should ignore blips with unknown rings", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const data = {
        blips: [
          { name: "Valid", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Invalid", ring: "Unknown", quadrant: "Techniques", isNew: true },
          { name: "Blip3", ring: "Adopt", quadrant: "Platforms", isNew: false },
          { name: "Blip4", ring: "Adopt", quadrant: "Tools", isNew: false },
          { name: "Blip5", ring: "Adopt", quadrant: "Languages", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      expect(radar.getQuadrant("NE").blips()).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalledWith("Unknown ring: Unknown");

      consoleSpy.mockRestore();
    });

    it("should convert quadrant names to kebab-case lowercase", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Languages & Frameworks", isNew: false },
          { name: "Blip2", ring: "Adopt", quadrant: "Tech Stack", isNew: false },
          { name: "Blip3", ring: "Adopt", quadrant: "AI Tools", isNew: false },
          { name: "Blip4", ring: "Adopt", quadrant: "Infrastructure", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      const quadrantNames = radar.quadrants.map((q) => q.name);
      expect(quadrantNames).toContain("languages-frameworks");
      expect(quadrantNames).toContain("tech-stack");
      expect(quadrantNames).toContain("ai-tools");
      expect(quadrantNames).toContain("infrastructure");
    });
  });
});
