import { describe, it, expect, vi } from "vitest";
import { Radar } from "./radar";

describe("Radar", () => {
  const sampleData = {
    title: "Test Radar",
    blips: [
      { name: "TypeScript", ring: "Adopt", quadrant: "Techniques", isNew: true },
      { name: "AWS", ring: "Adopt", quadrant: "Platforms", isNew: false },
      { name: "Vite", ring: "Trial", quadrant: "Tools", isNew: false },
      { name: "Vue", ring: "Adopt", quadrant: "Languages", isNew: false },
    ],
    rings: ["Adopt", "Trial", "Assess", "Hold"],
  };

  describe("create", () => {
    it("should initialize with four quadrants", () => {
      const radar = Radar.create(sampleData);
      const quadrants = radar.quadrants;
      expect(quadrants).toHaveLength(4);
      expect(quadrants[0].position).toBe("NE");
      expect(quadrants[1].position).toBe("NW");
      expect(quadrants[2].position).toBe("SW");
      expect(quadrants[3].position).toBe("SE");
    });

    it("should have correct start angles for quadrants", () => {
      const radar = Radar.create(sampleData);
      const quadrants = radar.quadrants;
      // Order: NE, NW, SW, SE (from QUADRANT_POSITIONS)
      // NE (top-right): 90, NW (top-left): 0, SW (bottom-left): -90, SE (bottom-right): -180
      expect(quadrants[0].startAngle).toBe(90); // NE
      expect(quadrants[1].startAngle).toBe(0); // NW
      expect(quadrants[2].startAngle).toBe(-90); // SW
      expect(quadrants[3].startAngle).toBe(-180); // SE
    });

    it("should return quadrant by position", () => {
      const radar = Radar.create(sampleData);
      const ne = radar.getQuadrant("NE");
      const nw = radar.getQuadrant("NW");
      const sw = radar.getQuadrant("SW");
      const se = radar.getQuadrant("SE");

      expect(ne.position).toBe("NE");
      expect(nw.position).toBe("NW");
      expect(sw.position).toBe("SW");
      expect(se.position).toBe("SE");
    });

    it("should create a radar from TechRadarData with alphabetical ordering", () => {
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
      // Without explicit quadrants order, alphabetical: languages-frameworks, platforms, techniques, tools
      // Maps to positions: NE, NW, SW, SE
      expect(radar.getQuadrant("NE").name).toBe("languages-frameworks");
      expect(radar.getQuadrant("NW").name).toBe("platforms");
      expect(radar.getQuadrant("SW").name).toBe("techniques");
      expect(radar.getQuadrant("SE").name).toBe("tools");
      // Check blips are in correct quadrants
      expect(radar.getQuadrant("SW").blips()[0].name).toBe("TypeScript");
      expect(radar.getQuadrant("NE").blips()[0].name).toBe("Vue");
    });

    it("should use provided quadrants order when specified", () => {
      const data = {
        blips: [
          { name: "TypeScript", ring: "Adopt", quadrant: "Techniques", isNew: true },
          { name: "AWS", ring: "Adopt", quadrant: "Platforms", isNew: false },
          { name: "Vite", ring: "Trial", quadrant: "Tools", isNew: false },
          { name: "Vue", ring: "Adopt", quadrant: "Languages & Frameworks", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Techniques", "Platforms", "Tools", "Languages & Frameworks"],
      };

      const radar = Radar.create(data);

      // Should use provided order: techniques, platforms, tools, languages-frameworks
      expect(radar.getQuadrant("NE").name).toBe("techniques");
      expect(radar.getQuadrant("NW").name).toBe("platforms");
      expect(radar.getQuadrant("SW").name).toBe("tools");
      expect(radar.getQuadrant("SE").name).toBe("languages-frameworks");
    });

    it("should throw error if not exactly 4 quadrant names in blips", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Blip2", ring: "Adopt", quadrant: "Platforms", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      // Error message shows original labels in alphabetical order
      expect(() => Radar.create(data)).toThrow(
        "Expected exactly 4 quadrant names, but found 2: [Platforms, Techniques]"
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

    it("should assign sequential IDs to blips in quadrant position order", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Alpha", isNew: false },
          { name: "Blip2", ring: "Trial", quadrant: "Beta", isNew: true },
          { name: "Blip3", ring: "Assess", quadrant: "Gamma", isNew: false },
          { name: "Blip4", ring: "Hold", quadrant: "Delta", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      // Alphabetical order: alpha, beta, delta, gamma -> NE, NW, SW, SE
      const allBlips = radar.quadrants.flatMap((q) => q.blips());
      expect(allBlips.map((b) => b.name)).toEqual(["Blip1", "Blip2", "Blip4", "Blip3"]);
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
          { name: "Valid", ring: "Adopt", quadrant: "Alpha", isNew: false },
          { name: "Invalid", ring: "Unknown", quadrant: "Alpha", isNew: true },
          { name: "Blip3", ring: "Adopt", quadrant: "Beta", isNew: false },
          { name: "Blip4", ring: "Adopt", quadrant: "Gamma", isNew: false },
          { name: "Blip5", ring: "Adopt", quadrant: "Delta", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      // Alpha is first alphabetically -> NE
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

    it("should treat case-insensitive quadrant names as the same", () => {
      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Tools", isNew: false },
          { name: "Blip2", ring: "Adopt", quadrant: "tools", isNew: false },
          { name: "Blip3", ring: "Adopt", quadrant: "TOOLS", isNew: false },
          { name: "Blip4", ring: "Adopt", quadrant: "Platforms", isNew: false },
          { name: "Blip5", ring: "Adopt", quadrant: "Techniques", isNew: false },
          { name: "Blip6", ring: "Adopt", quadrant: "Languages", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
      };

      const radar = Radar.create(data);

      // All 3 Tools/tools/TOOLS variants should be in the same quadrant
      const toolsQuadrant = radar.quadrants.find((q) => q.name === "tools");
      expect(toolsQuadrant).toBeDefined();
      expect(toolsQuadrant!.blips()).toHaveLength(3);
    });

    it("should warn about mismatches between data.quadrants and blips", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const data = {
        blips: [
          { name: "Blip1", ring: "Adopt", quadrant: "Alpha", isNew: false },
          { name: "Blip2", ring: "Adopt", quadrant: "Beta", isNew: false },
          { name: "Blip3", ring: "Adopt", quadrant: "Gamma", isNew: false },
          { name: "Blip4", ring: "Adopt", quadrant: "Delta", isNew: false },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Alpha", "Beta", "Gamma", "Extra"], // Extra not in blips, Delta missing
      };

      Radar.create(data);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Quadrants in data.quadrants not found in blips")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Quadrants in blips not found in data.quadrants")
      );

      consoleSpy.mockRestore();
    });
  });
});
