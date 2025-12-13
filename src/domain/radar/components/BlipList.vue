<template>
  <div class="blip-list-container">
    <BlipListByQuadrant
      v-for="quadrant in quadrants"
      :key="quadrant.position"
      :quadrant-name="quadrant.name"
      :quadrant-position="quadrant.position"
      :blips="getQuadrantBlips(quadrant.position)"
      :highlighted-blip-id="highlightedBlipId"
      :selected-blip-id="selectedBlipId"
      @blip-hover="$emit('blip-hover', $event)"
      @blip-click="$emit('blip-click', $event)"
      @blip-toggle="$emit('blip-toggle', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import BlipListByQuadrant from "./BlipListByQuadrant.vue";
  import type { PositionedBlip } from "../geometry/quadrant.geometry";
  import type { QuadrantPosition } from "../config";

  type QuadrantInfo = {
    position: QuadrantPosition;
    name: string;
    blips: PositionedBlip[];
  };

  const props = defineProps<{
    quadrants: QuadrantInfo[];
    highlightedBlipId: number | null;
    selectedBlipId: number | null;
  }>();

  defineEmits<{
    "blip-hover": [blip: PositionedBlip | null];
    "blip-click": [blip: PositionedBlip];
    "blip-toggle": [blipId: number];
  }>();

  function getQuadrantBlips(position: QuadrantPosition): PositionedBlip[] {
    const quadrant = props.quadrants.find((q) => q.position === position);
    return quadrant?.blips ?? [];
  }
</script>

<style scoped>
  .blip-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
</style>
