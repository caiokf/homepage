import { Ring } from "./ring";

describe("Ring", () => {
  describe("constructor", () => {
    it("should create a ring with name and order", () => {
      const ring = new Ring("Adopt", 1);
      expect(ring.name).toBe("Adopt");
      expect(ring.order).toBe(1);
    });

    it("should handle different ring names", () => {
      const ring = new Ring("Trial", 2);
      expect(ring.name).toBe("Trial");
      expect(ring.order).toBe(2);
    });

    it("should handle zero order", () => {
      const ring = new Ring("Assess", 0);
      expect(ring.name).toBe("Assess");
      expect(ring.order).toBe(0);
    });
  });

  describe("getters", () => {
    it("should return the correct name", () => {
      const ring = new Ring("Hold", 3);
      expect(ring.name).toBe("Hold");
    });

    it("should return the correct order", () => {
      const ring = new Ring("Test", 5);
      expect(ring.order).toBe(5);
    });
  });
});
