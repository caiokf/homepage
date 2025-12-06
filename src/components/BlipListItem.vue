<template>
  <li
    :class="['blip-list-item', { expanded: isExpanded, highlighted: isHighlighted }]"
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
      <span v-else-if="blip.status === 'moved in'" class="blip-badge moved">IN</span>
      <span v-else-if="blip.status === 'moved out'" class="blip-badge moved">OUT</span>
      <span class="expand-arrow" :class="{ rotated: isExpanded }">&#9660;</span>
    </button>
    <div class="blip-description" :class="{ visible: isExpanded }">
      <p>{{ blip.description || 'No description available.' }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PositionedBlip } from '../data/types'

defineProps<{
  blip: PositionedBlip
  isHighlighted: boolean
}>()

defineEmits<{
  (e: 'hover', blip: PositionedBlip | null): void
  (e: 'click', blip: PositionedBlip): void
}>()

const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// Expose method for parent to expand/collapse
defineExpose({
  expand: () => { isExpanded.value = true },
  collapse: () => { isExpanded.value = false },
})
</script>

<style scoped>
.blip-list-item {
  list-style: none;
  border-bottom: 1px solid #eee;
}

.blip-list-item.highlighted {
  background: #f0f7ff;
}

.blip-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.2s ease;
}

.blip-header:hover {
  background: #f5f5f5;
}

.blip-number {
  font-weight: 600;
  font-family: var(--font-mono);
  color: #666;
  min-width: 24px;
}

.blip-name {
  flex: 1;
  font-weight: 500;
  font-family: var(--font-mono);
}

.blip-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.blip-badge.new {
  background: #e8f5e9;
  color: #2e7d32;
}

.blip-badge.moved {
  background: #fff3e0;
  color: #f57c00;
}

.expand-arrow {
  font-size: 10px;
  color: #999;
  transition: transform 0.2s ease;
}

.expand-arrow.rotated {
  transform: rotate(180deg);
}

.blip-description {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 16px;
}

.blip-description.visible {
  max-height: 200px;
  padding: 0 16px 16px 48px;
}

.blip-description p {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  font-family: var(--font-sans);
}
</style>
