<template>
  <BaseCard
    class="quadrant-blip-list"
    :class="quadrantPosition"
    :header-style="headerStyle"
    :show-cursor="false"
    no-padding
  >
    <template #title>
      <span class="quadrant-title">{{ quadrantName }}</span>
    </template>

    <BlipListByRing
      v-for="(ring, ringIndex) in ringGroups"
      :key="ring.name"
      :ring-name="ring.name"
      :blips="ring.blips"
      :base-index="getBaseIndex(ringIndex)"
      :highlighted-blip-id="highlightedBlipId"
      :selected-blip-id="selectedBlipId"
      @blip-hover="$emit('blip-hover', $event)"
      @blip-click="$emit('blip-click', $event)"
      @blip-toggle="$emit('blip-toggle', $event)"
    />
  </BaseCard>
</template>

<script setup lang="ts">
  import { computed, type CSSProperties } from "vue";
  import BaseCard from "../../../components/atoms/BaseCard.vue";
  import BlipListByRing from "./BlipListByRing.vue";
  import type { PositionedBlip, QuadrantPosition } from "../types";
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

  const headerStyle = computed<CSSProperties>(() => ({
    background: `var(--quadrant-${props.quadrantPosition})`,
    borderBottom: "none",
  }));

  const ringGroups = computed(() => {
    return RING_NAMES.map((ringName, index) => ({
      name: ringName,
      blips: props.blips.filter((b) => b.ringIndex === index),
    }));
  });

  // Calculate base index for staggered animation (cumulative count of blips in previous rings)
  function getBaseIndex(ringIndex: number): number {
    let count = 0;
    for (let i = 0; i < ringIndex; i++) {
      count += ringGroups.value[i].blips.length;
    }
    return count;
  }
</script>

<style scoped>
  .quadrant-blip-list {
    width: 100%;
    box-sizing: border-box;
  }

  .quadrant-title {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    color: var(--color-text-inverse);
    text-transform: lowercase;
  }
</style>
