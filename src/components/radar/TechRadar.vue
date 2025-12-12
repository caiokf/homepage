<template>
  <div class="tech-radar-container">
    <!-- Desktop: Full radar with rings and blips -->
    <TechRadarDesktop
      v-if="!isMobile"
      :radar="radar"
      :selected-quadrant="selectedQuadrant"
      @quadrant-selected="(...args) => $emit('quadrant-selected', ...args)"
      @blip-selected="(...args) => $emit('blip-selected', ...args)"
      @blip-hovered="(...args) => $emit('blip-hovered', ...args)"
    />

    <!-- Mobile: Colored quadrant cards -->
    <TechRadarMobile
      v-else
      :radar="radar"
      :selected-quadrant="selectedQuadrant"
      @quadrant-selected="(...args) => $emit('quadrant-selected', ...args)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import TechRadarDesktop from "./TechRadarDesktop.vue";
  import TechRadarMobile from "./TechRadarMobile.vue";
  import type { Radar } from "../../models/radar";
  import type { PositionedBlip } from "../../models/quadrant.geometry";
  import type { QuadrantPosition } from "../../config/radar-config";

  const MOBILE_BREAKPOINT = 1000;

  defineProps<{
    radar: Radar;
    selectedQuadrant: QuadrantPosition | null;
  }>();

  defineEmits<{
    "quadrant-selected": [position: QuadrantPosition | null];
    "blip-selected": [blip: PositionedBlip, quadrant: QuadrantPosition];
    "blip-hovered": [blip: PositionedBlip | null];
  }>();

  const isMobile = ref(false);

  function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  }

  onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
</script>

<style scoped>
  .tech-radar-container {
    width: 100%;
  }
</style>
