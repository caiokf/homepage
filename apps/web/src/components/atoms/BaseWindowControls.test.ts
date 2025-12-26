<<<<<<< ours
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { readFileSync } from "fs";
import { resolve } from "path";
import BaseWindowControls from "./BaseWindowControls.vue";

// Read the component source to verify CSS rules
const componentSource = readFileSync(
  resolve(__dirname, "./BaseWindowControls.vue"),
  "utf-8"
);

describe("BaseWindowControls", () => {
  describe("rendering", () => {
    it("should render three control dots", () => {
      const wrapper = mount(BaseWindowControls);
      const controls = wrapper.findAll(".control");
      expect(controls).toHaveLength(3);
    });

    it("should render close, minimize, and maximize controls", () => {
      const wrapper = mount(BaseWindowControls);
      expect(wrapper.find(".control--close").exists()).toBe(true);
      expect(wrapper.find(".control--minimize").exists()).toBe(true);
      expect(wrapper.find(".control--maximize").exists()).toBe(true);
    });

    it("should have aria-hidden attribute for accessibility", () => {
      const wrapper = mount(BaseWindowControls);
      expect(wrapper.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("default props", () => {
    it("should use default size of 12px", () => {
      const wrapper = mount(BaseWindowControls);
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-size: 12px");
    });

    it("should use default gap of 8px", () => {
      const wrapper = mount(BaseWindowControls);
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-gap: 8px");
    });
  });

  describe("custom props", () => {
    it("should accept custom size", () => {
      const wrapper = mount(BaseWindowControls, {
        props: { size: 16 },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-size: 16px");
    });

    it("should accept custom gap", () => {
      const wrapper = mount(BaseWindowControls, {
        props: { gap: 12 },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-gap: 12px");
    });

    it("should accept both custom size and gap", () => {
      const wrapper = mount(BaseWindowControls, {
        props: { size: 20, gap: 10 },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-size: 20px");
      expect(style).toContain("--control-gap: 10px");
    });
  });

  describe("styling", () => {
    it("should have base-window-controls class on root element", () => {
      const wrapper = mount(BaseWindowControls);
      expect(wrapper.classes()).toContain("base-window-controls");
    });

    it("should apply control class to all dots", () => {
      const wrapper = mount(BaseWindowControls);
      const controls = wrapper.findAll(".control");
      controls.forEach((control) => {
        expect(control.classes()).toContain("control");
      });
    });
  });

  describe("theme transitions", () => {
    it("should define transition on base control class", () => {
      // Verify the .control class has a transition rule
      expect(componentSource).toMatch(/\.control\s*\{[^}]*transition:\s*background-color/);
    });

    it("should define transition on close control for theme changes", () => {
      // Verify .control--close has its own transition rule
      expect(componentSource).toMatch(/\.control--close\s*\{[^}]*transition:\s*background-color/);
    });

    it("should define transition on minimize control for theme changes", () => {
      // Verify .control--minimize has its own transition rule
      expect(componentSource).toMatch(/\.control--minimize\s*\{[^}]*transition:\s*background-color/);
    });

    it("should define transition on maximize control for theme changes", () => {
      // Verify .control--maximize has its own transition rule
      expect(componentSource).toMatch(/\.control--maximize\s*\{[^}]*transition:\s*background-color/);
    });

    it("should use theme transition timing variable", () => {
      // Verify all transitions use the --transition-theme CSS variable for consistent timing
      const transitionMatches = componentSource.match(/transition:\s*background-color\s+var\(--transition-theme\)/g);
      // Should have 4 transitions: base .control + 3 modifier classes
      expect(transitionMatches).toHaveLength(4);
    });

    it("should render controls with correct classes for transitions to apply", () => {
      const wrapper = mount(BaseWindowControls);

      // Verify the DOM has the correct class structure for CSS transitions
      const closeControl = wrapper.find(".control--close");
      const minimizeControl = wrapper.find(".control--minimize");
      const maximizeControl = wrapper.find(".control--maximize");

      // Each control should have both base and modifier classes
      expect(closeControl.classes()).toContain("control");
      expect(closeControl.classes()).toContain("control--close");

      expect(minimizeControl.classes()).toContain("control");
      expect(minimizeControl.classes()).toContain("control--minimize");

      expect(maximizeControl.classes()).toContain("control");
      expect(maximizeControl.classes()).toContain("control--maximize");
    });
  });

  describe("macOS-style colors", () => {
    it("should use macOS red color for close button", () => {
      expect(componentSource).toMatch(/\.control--close\s*\{[^}]*#ff5f57/);
    });

    it("should use macOS yellow color for minimize button", () => {
      expect(componentSource).toMatch(/\.control--minimize\s*\{[^}]*#febc2e/);
    });

    it("should use macOS green color for maximize button", () => {
      expect(componentSource).toMatch(/\.control--maximize\s*\{[^}]*#28c840/);
    });
  });
});
|||||||
=======
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { readFileSync } from "fs";
import { resolve } from "path";
import BaseWindowControls from "./BaseWindowControls.vue";

// Read the component source to verify CSS rules
const componentSource = readFileSync(
  resolve(__dirname, "./BaseWindowControls.vue"),
  "utf-8"
);

describe("BaseWindowControls", () => {
  describe("rendering", () => {
    it("should render three control dots", () => {
      const wrapper = mount(BaseWindowControls);
      const controls = wrapper.findAll(".control");
      expect(controls).toHaveLength(3);
    });

    it("should render close, minimize, and maximize controls", () => {
      const wrapper = mount(BaseWindowControls);
      expect(wrapper.find(".control--close").exists()).toBe(true);
      expect(wrapper.find(".control--minimize").exists()).toBe(true);
      expect(wrapper.find(".control--maximize").exists()).toBe(true);
    });

    it("should have aria-hidden attribute for accessibility", () => {
      const wrapper = mount(BaseWindowControls);
      expect(wrapper.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("default props", () => {
    it("should use default size of 12px", () => {
      const wrapper = mount(BaseWindowControls);
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-size: 12px");
    });

    it("should use default gap of 8px", () => {
      const wrapper = mount(BaseWindowControls);
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-gap: 8px");
    });
  });

  describe("custom props", () => {
    it("should accept custom size", () => {
      const wrapper = mount(BaseWindowControls, {
        props: { size: 16 },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-size: 16px");
    });

    it("should accept custom gap", () => {
      const wrapper = mount(BaseWindowControls, {
        props: { gap: 12 },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-gap: 12px");
    });

    it("should accept both custom size and gap", () => {
      const wrapper = mount(BaseWindowControls, {
        props: { size: 20, gap: 10 },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("--control-size: 20px");
      expect(style).toContain("--control-gap: 10px");
    });
  });

  describe("styling", () => {
    it("should have base-window-controls class on root element", () => {
      const wrapper = mount(BaseWindowControls);
      expect(wrapper.classes()).toContain("base-window-controls");
    });

    it("should apply control class to all dots", () => {
      const wrapper = mount(BaseWindowControls);
      const controls = wrapper.findAll(".control");
      controls.forEach((control) => {
        expect(control.classes()).toContain("control");
      });
    });
  });

  describe("theme transitions", () => {
    it("should define transition on base control class", () => {
      // Verify the .control class has a transition rule
      expect(componentSource).toMatch(/\.control\s*\{[^}]*transition:\s*background-color/);
    });

    it("should define transition on close control for theme changes", () => {
      // Verify .control--close has its own transition rule
      expect(componentSource).toMatch(/\.control--close\s*\{[^}]*transition:\s*background-color/);
    });

    it("should define transition on minimize control for theme changes", () => {
      // Verify .control--minimize has its own transition rule
      expect(componentSource).toMatch(/\.control--minimize\s*\{[^}]*transition:\s*background-color/);
    });

    it("should define transition on maximize control for theme changes", () => {
      // Verify .control--maximize has its own transition rule
      expect(componentSource).toMatch(/\.control--maximize\s*\{[^}]*transition:\s*background-color/);
    });

    it("should use theme transition timing variable", () => {
      // Verify all transitions use the --transition-theme CSS variable for consistent timing
      const transitionMatches = componentSource.match(/transition:\s*background-color\s+var\(--transition-theme\)/g);
      // Should have 4 transitions: base .control + 3 modifier classes
      expect(transitionMatches).toHaveLength(4);
    });

    it("should render controls with correct classes for transitions to apply", () => {
      const wrapper = mount(BaseWindowControls);

      // Verify the DOM has the correct class structure for CSS transitions
      const closeControl = wrapper.find(".control--close");
      const minimizeControl = wrapper.find(".control--minimize");
      const maximizeControl = wrapper.find(".control--maximize");

      // Each control should have both base and modifier classes
      expect(closeControl.classes()).toContain("control");
      expect(closeControl.classes()).toContain("control--close");

      expect(minimizeControl.classes()).toContain("control");
      expect(minimizeControl.classes()).toContain("control--minimize");

      expect(maximizeControl.classes()).toContain("control");
      expect(maximizeControl.classes()).toContain("control--maximize");
    });
  });

  describe("macOS-style colors", () => {
    it("should use macOS red color for close button", () => {
      expect(componentSource).toMatch(/\.control--close\s*\{[^}]*#ff5f57/);
    });

    it("should use macOS yellow color for minimize button", () => {
      expect(componentSource).toMatch(/\.control--minimize\s*\{[^}]*#febc2e/);
    });

    it("should use macOS green color for maximize button", () => {
      expect(componentSource).toMatch(/\.control--maximize\s*\{[^}]*#28c840/);
    });
  });
});
>>>>>>> theirs
