<template>
  <div class="ring-blip-list">
    <h3 class="ring-title">{{ ringName }}</h3>
    <ul v-if="blips.length > 0" class="blip-list">
      <BlipListItem
        v-for="blip in blips"
        :key="blip.id"
        :blip="blip"
        :is-highlighted="highlightedBlipId === blip.id"
        :is-expanded="expandedBlipId === blip.id"
        @hover="$emit('blip-hover', $event)"
        @click="$emit('blip-click', $event)"
        @toggle="$emit('blip-toggle', $event)"
      />
    </ul>
    <p v-else class="empty-ring">No items in this ring</p>
  </div>
</template>

<script setup lang="ts">
  import BlipListItem from "./BlipListItem.vue";
  import type { PositionedBlip } from "../geometry/quadrant.geometry";

  defineProps<{
    ringName: string;
    blips: PositionedBlip[];
    highlightedBlipId: number | null;
    expandedBlipId: number | null;
  }>();

  defineEmits<{
    "blip-hover": [blip: PositionedBlip | null];
    "blip-click": [blip: PositionedBlip];
    "blip-toggle": [blipId: number];
  }>();
</script>

<style scoped>
  .ring-blip-list {
    border-bottom: 1px solid var(--color-border);
  }

  .ring-blip-list:last-child {
    border-bottom: none;
  }

  .ring-title {
    margin: 0;
    padding: var(--space-3) var(--space-5);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
    text-transform: lowercase;
    transition:
      background-color var(--transition-theme),
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
