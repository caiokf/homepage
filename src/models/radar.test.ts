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
      expect(quadrants[0].name).toBe("Techniques");
      expect(quadrants[1].name).toBe("Platforms");
      expect(quadrants[2].name).toBe("Tools");
      expect(quadrants[3].name).toBe("Languages & Frameworks");
    });

    it("should have correct start angles for quadrants", () => {
      const quadrants = radar.quadrants;
      expect(quadrants[0].startAngle).toBe(0);
      expect(quadrants[1].startAngle).toBe(-90);
      expect(quadrants[2].startAngle).toBe(90);
      expect(quadrants[3].startAngle).toBe(-180);
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
          {
            name: "TypeScript",
            ring: "Adopt",
            quadrant: "Techniques",
            isNew: true,
            status: "new" as const,
            description: "Typed JavaScript",
          },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Techniques", "Platforms", "Tools", "Languages & Frameworks"],
      };

      const radar = Radar.create(data);

      expect(radar.quadrants).toHaveLength(4);
      // NE is the first position, which maps to "Techniques"
      const neQuadrant = radar.getQuadrant("NE");
      expect(neQuadrant.name).toBe("Techniques");
      expect(neQuadrant.blips()).toHaveLength(1);
      expect(neQuadrant.blips()[0].name).toBe("TypeScript");
    });

    it("should use default ring and quadrant names if not provided", () => {
      const data = {
        blips: [],
      };

      const radar = Radar.create(data);

      expect(radar.quadrants).toHaveLength(4);
      expect(Object.keys(radar.rings)).toHaveLength(4);
    });

    it("should assign sequential IDs to blips", () => {
      const data = {
        blips: [
          {
            name: "Blip1",
            ring: "Adopt",
            quadrant: "Techniques",
            isNew: false,
          },
          {
            name: "Blip2",
            ring: "Trial",
            quadrant: "Platforms",
            isNew: true,
          },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Techniques", "Platforms", "Tools", "Languages & Frameworks"],
      };

      const radar = Radar.create(data);

      const allBlips = radar.quadrants.flatMap((q) => q.blips());
      expect(allBlips[0].id).toBe(1);
      expect(allBlips[1].id).toBe(2);
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
        quadrants: ["Techniques", "Platforms", "Tools", "Languages & Frameworks"],
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
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Techniques", "Platforms", "Tools", "Languages & Frameworks"],
      };

      const radar = Radar.create(data);

      expect(radar.getQuadrant("NE").blips()).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalledWith("Unknown ring: Unknown");

      consoleSpy.mockRestore();
    });

    it("should ignore blips with unknown quadrants", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const data = {
        blips: [
          { name: "Valid", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Invalid", ring: "Adopt", quadrant: "Unknown", isNew: true },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Techniques", "Platforms", "Tools", "Languages & Frameworks"],
      };

      const radar = Radar.create(data);

      const totalBlips = radar.quadrants.reduce((sum, q) => sum + q.blips().length, 0);
      expect(totalBlips).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith("Unknown quadrant: Unknown");

      consoleSpy.mockRestore();
    });
  });
});
