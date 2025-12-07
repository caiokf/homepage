import { describe, it, expect, beforeEach } from "vitest";
import { Radar } from "./radar";
import { Quadrant } from "./quadrant";
import { Ring } from "./ring";
import { Blip } from "./blip";

describe("Radar", () => {
  let radar: Radar;
  let ring: Ring;

  beforeEach(() => {
    radar = new Radar();
    ring = new Ring("Adopt", 1);
  });

  describe("constructor", () => {
    it("should initialize with empty rings", () => {
      expect(radar.rings).toEqual({});
    });

    it("should initialize with four quadrant configs", () => {
      const quadrants = radar.quadrants;
      expect(quadrants).toHaveLength(4);
      expect(quadrants[0].order).toBe("first");
      expect(quadrants[1].order).toBe("second");
      expect(quadrants[2].order).toBe("third");
      expect(quadrants[3].order).toBe("fourth");
    });
  });

  describe("addQuadrant", () => {
    it("should add a quadrant", () => {
      const quadrant = new Quadrant("Languages");
      const blip = new Blip("React", ring, true);
      quadrant.add(blip);

      radar.addQuadrant(quadrant);
      const quadrants = radar.quadrants;
      expect(quadrants[0].quadrant).toBe(quadrant);
    });

    it("should number blips when adding quadrant", () => {
      const quadrant = new Quadrant("Languages");
      const blip1 = new Blip("React", ring, true);
      const blip2 = new Blip("Vue", ring, true);
      quadrant.add([blip1, blip2]);

      radar.addQuadrant(quadrant);
      expect(blip1.id).toBe(1);
      expect(blip1.blipText).toBe("1");
      expect(blip2.id).toBe(2);
      expect(blip2.blipText).toBe("2");
    });

    it("should increment blip numbers across quadrants", () => {
      const quadrant1 = new Quadrant("Languages");
      const blip1 = new Blip("React", ring, true);
      quadrant1.add(blip1);

      const quadrant2 = new Quadrant("Tools");
      const blip2 = new Blip("Webpack", ring, true);
      quadrant2.add(blip2);

      radar.addQuadrant(quadrant1);
      radar.addQuadrant(quadrant2);

      expect(blip1.id).toBe(1);
      expect(blip2.id).toBe(2);
    });

    it("should add quadrants in order", () => {
      const quadrant1 = new Quadrant("First");
      const quadrant2 = new Quadrant("Second");
      const quadrant3 = new Quadrant("Third");
      const quadrant4 = new Quadrant("Fourth");

      radar.addQuadrant(quadrant1);
      radar.addQuadrant(quadrant2);
      radar.addQuadrant(quadrant3);
      radar.addQuadrant(quadrant4);

      const quadrants = radar.quadrants;
      expect(quadrants[0].quadrant).toBe(quadrant1);
      expect(quadrants[1].quadrant).toBe(quadrant2);
      expect(quadrants[2].quadrant).toBe(quadrant3);
      expect(quadrants[3].quadrant).toBe(quadrant4);
    });

    it("should throw error when adding more than 4 quadrants", () => {
      const quadrant1 = new Quadrant("First");
      const quadrant2 = new Quadrant("Second");
      const quadrant3 = new Quadrant("Third");
      const quadrant4 = new Quadrant("Fourth");
      const quadrant5 = new Quadrant("Fifth");

      radar.addQuadrant(quadrant1);
      radar.addQuadrant(quadrant2);
      radar.addQuadrant(quadrant3);
      radar.addQuadrant(quadrant4);

      expect(() => {
        radar.addQuadrant(quadrant5);
      }).toThrow("Too many quadrants");
    });
  });

  describe("addRings", () => {
    it("should set rings", () => {
      const ring1 = new Ring("Adopt", 1);
      const ring2 = new Ring("Trial", 2);
      const rings = {
        adopt: ring1,
        trial: ring2,
      };

      radar.addRings(rings);
      expect(radar.rings).toBe(rings);
    });
  });

  describe("quadrants", () => {
    it("should return quadrant configs", () => {
      const quadrants = radar.quadrants;
      expect(quadrants[0].startAngle).toBe(0);
      expect(quadrants[1].startAngle).toBe(-90);
      expect(quadrants[2].startAngle).toBe(90);
      expect(quadrants[3].startAngle).toBe(-180);
    });

    it("should have undefined quadrant initially", () => {
      const quadrants = radar.quadrants;
      expect(quadrants[0].quadrant).toBeUndefined();
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
            quadrant: "Languages",
            isNew: true,
            status: "new" as const,
            description: "Typed JavaScript",
          },
        ],
        rings: ["Adopt", "Trial", "Assess", "Hold"],
        quadrants: ["Languages", "Tools", "Platforms", "Techniques"],
      };

      const radar = Radar.create(data);

      expect(radar.quadrants).toHaveLength(4);
      expect(radar.quadrants[0].quadrant?.name).toBe("Languages");
      expect(radar.quadrants[0].quadrant?.blips()).toHaveLength(1);
      expect(radar.quadrants[0].quadrant?.blips()[0].name).toBe("TypeScript");
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

      const allBlips = radar.quadrants.flatMap(
        (q) => q.quadrant?.blips() ?? []
      );
      expect(allBlips[0].id).toBe(1);
      expect(allBlips[1].id).toBe(2);
    });
  });
});
