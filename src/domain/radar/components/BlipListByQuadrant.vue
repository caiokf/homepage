<template>
  <div class="quadrant-blip-list" :class="quadrantPosition">
    <h2 class="quadrant-title">{{ quadrantName }}</h2>

    <BlipListByRing
      v-for="ring in ringGroups"
      :key="ring.name"
      :ring-name="ring.name"
      :blips="ring.blips"
      :highlighted-blip-id="highlightedBlipId"
      :selected-blip-id="selectedBlipId"
      @blip-hover="$emit('blip-hover', $event)"
      @blip-click="$emit('blip-click', $event)"
      @blip-toggle="$emit('blip-toggle', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import BlipListByRing from "./BlipListByRing.vue";
  import type { PositionedBlip } from "../geometry/quadrant.geometry";
import type { QuadrantPosition } from "../types";
  import { RING_NAMES } from "../constants";

  const props = defineProps<{
    quadrantName: string;
    quadrantPosition: QuadrantPosition;
    blips: PositionedBlip[];
    highlightedBlipId: number | null;
    selectedBlipId: number | null;
  }>();

  defineEmits<{
    "blip-hover": [blip: PositionedBlip | null];
    "blip-click": [blip: PositionedBlip];
    "blip-toggle": [blipId: number];
  }>();

  const ringGroups = computed(() => {
    return RING_NAMES.map((ringName, index) => ({
      name: ringName,
      blips: props.blips.filter((b) => b.ringIndex === index),
    }));
  });
</script>

<style scoped>
  .quadrant-blip-list {
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    width: 100%;
    box-sizing: border-box;
    transition: background-color var(--transition-theme),
      box-shadow var(--transition-theme);
  }

  .quadrant-title {
    margin: 0;
    padding: var(--space-4) var(--space-5);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    color: var(--color-text-inverse);
    text-transform: lowercase;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .quadrant-title::before {
    content: "// ";
    opacity: 0.7;
  }

  .quadrant-blip-list.NE .quadrant-title {
    background: var(--quadrant-NE);
  }

  .quadrant-blip-list.NW .quadrant-title {
    background: var(--quadrant-NW);
  }

  .quadrant-blip-list.SW .quadrant-title {
    background: var(--quadrant-SW);
  }

  .quadrant-blip-list.SE .quadrant-title {
    background: var(--quadrant-SE);
  }
</style>
