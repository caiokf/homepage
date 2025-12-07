<template>
  <li
    :class="['blip-item', { expanded: isExpanded, highlighted: isHighlighted }]"
    @mouseenter="$emit('hover', blip)"
    @mouseleave="$emit('hover', null)"
  >
    <button
      class="blip-header"
      :aria-expanded="isExpanded"
      @click="toggleExpand"
    >
      <span class="blip-number">{{ blip.blipText }}.</span>
      <span class="blip-name">{{ blip.name }}</span>
      <span v-if="blip.isNew" class="blip-badge new">NEW</span>
      <span v-else-if="blip.status === 'moved in'" class="blip-badge moved"
        >IN</span
      >
      <span v-else-if="blip.status === 'moved out'" class="blip-badge moved"
        >OUT</span
      >
      <span class="expand-arrow" :class="{ rotated: isExpanded }">&#9660;</span>
    </button>
    <div class="blip-description" :class="{ visible: isExpanded }">
      <p>{{ blip.description || "No description available." }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { PositionedBlip } from "../models/quadrant.geometry";

defineProps<{
  blip: PositionedBlip;
  isHighlighted: boolean;
}>();

defineEmits<{
  hover: [blip: PositionedBlip | null];
  click: [blip: PositionedBlip];
}>();

const isExpanded = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

defineExpose({
  expand: () => {
    isExpanded.value = true;
  },
  collapse: () => {
    isExpanded.value = false;
  },
});
</script>

<style scoped>
.blip-item {
  list-style: none;
  border-bottom: 1px solid var(--color-border-subtle);
  transition: border-color var(--transition-theme);
}

.blip-item.highlighted {
  background: var(--color-surface-highlight);
  transition: background-color var(--transition-theme);
}

.blip-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  transition: background-color var(--transition-fast),
    color var(--transition-theme);
}

.blip-header:hover {
  background: var(--color-surface-hover);
}

.blip-number {
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  min-width: 24px;
  transition: color var(--transition-theme);
}

.blip-name {
  flex: 1;
  font-weight: var(--font-medium);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  transition: color var(--transition-theme);
}

.blip-badge {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
}

.blip-badge.new {
  background: var(--color-success-bg);
  color: var(--color-success);
  transition: background-color var(--transition-theme),
    color var(--transition-theme);
}

.blip-badge.moved {
  background: var(--color-warning-bg);
  color: var(--color-warning);
  transition: background-color var(--transition-theme),
    color var(--transition-theme);
}

.expand-arrow {
  font-size: 10px;
  color: var(--color-text-muted);
  transition: transform var(--transition-fast), color var(--transition-theme);
}

.expand-arrow.rotated {
  transform: rotate(180deg);
}

.blip-description {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-slow), padding var(--transition-slow);
  padding: 0 var(--space-4);
}

.blip-description.visible {
  max-height: 200px;
  padding: 0 var(--space-4) var(--space-4) 48px;
}

.blip-description p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  font-family: var(--font-sans);
  transition: color var(--transition-theme);
}
</style>
