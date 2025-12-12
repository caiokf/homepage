import { describe, it, expect, beforeEach } from "vitest";
import { Blip } from "./blip";
import { Ring } from "./ring";

describe("Blip", () => {
  let ring: Ring;

  beforeEach(() => {
    ring = new Ring("Adopt", 1);
  });

  describe("constructor", () => {
    it("should create a blip with required parameters", () => {
      const blip = new Blip("React", ring, true);
      expect(blip.name).toBe("React");
      expect(blip.ring).toBe(ring);
      expect(blip.isNew).toBe(true);
    });

    it("should create a blip with all parameters", () => {
      const blip = new Blip(
        "Vue",
        ring,
        false,
        "moved in",
        "Frontend Framework",
        "A progressive JavaScript framework"
      );
      expect(blip.name).toBe("Vue");
      expect(blip.topic).toBe("Frontend Framework");
      expect(blip.description).toBe("A progressive JavaScript framework");
    });

    it("should have default width", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.width).toBe(22);
    });
  });

  describe("id", () => {
    it("should return -1 by default", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.id).toBe(-1);
    });

    it("should set and get id", () => {
      const blip = new Blip("Test", ring, true);
      blip.id = 5;
      expect(blip.id).toBe(5);
    });
  });

  describe("isNew", () => {
    it("should return constructor value when no status", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.isNew).toBe(true);
    });

    it("should return false when constructor isNew is false", () => {
      const blip = new Blip("Test", ring, false);
      expect(blip.isNew).toBe(false);
    });

    it("should return true when status is 'new'", () => {
      const blip = new Blip("Test", ring, false, "new");
      expect(blip.isNew).toBe(true);
    });

    it("should return false when status is not 'new'", () => {
      const blip = new Blip("Test", ring, true, "moved in");
      expect(blip.isNew).toBe(false);
    });
  });

  describe("status methods", () => {
    it("should detect moved in status", () => {
      const blip = new Blip("Test", ring, false, "moved in");
      expect(blip.hasMovedIn()).toBe(true);
      expect(blip.hasMovedOut()).toBe(false);
      expect(blip.hasNoChange()).toBe(false);
    });

    it("should detect moved out status", () => {
      const blip = new Blip("Test", ring, false, "moved out");
      expect(blip.hasMovedIn()).toBe(false);
      expect(blip.hasMovedOut()).toBe(true);
      expect(blip.hasNoChange()).toBe(false);
    });

    it("should detect no change status", () => {
      const blip = new Blip("Test", ring, false, "no change");
      expect(blip.hasMovedIn()).toBe(false);
      expect(blip.hasMovedOut()).toBe(false);
      expect(blip.hasNoChange()).toBe(true);
    });

    it("should return empty string when status is undefined", () => {
      const blip = new Blip("Test", ring, false);
      expect(blip.status).toBe("");
    });
  });

  describe("topic and description", () => {
    it("should return empty string when not provided", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.topic).toBe("");
      expect(blip.description).toBe("");
    });

    it("should return provided topic and description", () => {
      const blip = new Blip(
        "Test",
        ring,
        true,
        undefined,
        "Topic",
        "Description"
      );
      expect(blip.topic).toBe("Topic");
      expect(blip.description).toBe("Description");
    });
  });

  describe("isGroup", () => {
    it("should be false by default", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.isGroup).toBe(false);
    });

    it("should set and get isGroup", () => {
      const blip = new Blip("Test", ring, true);
      blip.isGroup = true;
      expect(blip.isGroup).toBe(true);
      blip.isGroup = false;
      expect(blip.isGroup).toBe(false);
    });
  });

  describe("groupIdInGraph", () => {
    it("should return empty string by default", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.groupIdInGraph).toBe("");
    });

    it("should set and get groupIdInGraph", () => {
      const blip = new Blip("Test", ring, true);
      blip.groupIdInGraph = "group-1";
      expect(blip.groupIdInGraph).toBe("group-1");
    });
  });

  describe("blipText", () => {
    it("should return empty string by default", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.blipText).toBe("");
    });

    it("should set and get blipText", () => {
      const blip = new Blip("Test", ring, true);
      blip.blipText = "1";
      expect(blip.blipText).toBe("1");
    });
  });

  describe("groupBlipWidth", () => {
    it("should return new group blip width for new blips", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.groupBlipWidth()).toBe(88);
    });

    it("should return existing group blip width for existing blips", () => {
      const blip = new Blip("Test", ring, false);
      expect(blip.groupBlipWidth()).toBe(124);
    });
  });

  describe("ring", () => {
    it("should return the ring", () => {
      const blip = new Blip("Test", ring, true);
      expect(blip.ring).toBe(ring);
    });
  });
});
