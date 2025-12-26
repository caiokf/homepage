import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseWindowControls from "./BaseWindowControls.vue";

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
});
