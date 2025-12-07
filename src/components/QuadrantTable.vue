<template>
  <div class="quadrant-table" :class="quadrantOrder">
    <h2 class="quadrant-title">{{ quadrantName }}</h2>

    <div v-for="ring in ringGroups" :key="ring.name" class="ring-section">
      <h3 class="ring-title">{{ ring.name }}</h3>
      <ul class="blip-list">
        <BlipListItem
          v-for="blip in ring.blips"
          :key="blip.id"
          :blip="blip"
          :is-highlighted="highlightedBlipId === blip.id"
          @hover="handleBlipHover"
          @click="handleBlipClick"
        />
      </ul>
      <p v-if="ring.blips.length === 0" class="empty-ring">
        No items in this ring
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BlipListItem from "./BlipListItem.vue";
import type { PositionedBlip } from "../data/types";
import { RING_NAMES, type QuadrantOrder } from "../config/radar-config";

const props = defineProps<{
  quadrantName: string;
  quadrantOrder: QuadrantOrder;
  blips: PositionedBlip[];
  highlightedBlipId: number | null;
}>();

const emit = defineEmits<{
  (e: "blip-hover", blip: PositionedBlip | null): void;
  (e: "blip-click", blip: PositionedBlip): void;
}>();

// Group blips by ring
const ringGroups = computed(() => {
  return RING_NAMES.map((ringName, index) => ({
    name: ringName,
    blips: props.blips.filter((b) => b.ringIndex === index),
  }));
});

function handleBlipHover(blip: PositionedBlip | null) {
  emit("blip-hover", blip);
}

function handleBlipClick(blip: PositionedBlip) {
  emit("blip-click", blip);
}
</script>

<style scoped>
.quadrant-table {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
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
}

.quadrant-table.first .quadrant-title {
  background: var(--quadrant-first);
}
.quadrant-table.second .quadrant-title {
  background: var(--quadrant-second);
}
.quadrant-table.third .quadrant-title {
  background: var(--quadrant-third);
}
.quadrant-table.fourth .quadrant-title {
  background: var(--quadrant-fourth);
}

.ring-section {
  border-bottom: 1px solid var(--color-border);
}

.ring-section:last-child {
  border-bottom: none;
}

.ring-title {
  margin: 0;
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  background: var(--color-background-subtle);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color var(--transition-theme),
    color var(--transition-theme);
}

.blip-list {
  margin: 0;
  padding: 0;
}

.empty-ring {
  margin: 0;
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-muted);
  font-style: italic;
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  transition: color var(--transition-theme);
}
</style>
