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
      <p v-if="ring.blips.length === 0" class="empty-ring">No items in this ring</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BlipListItem from './BlipListItem.vue'
import type { PositionedBlip } from '../data/types'
import { RING_NAMES, type QuadrantOrder } from '../config/radar-config'

const props = defineProps<{
  quadrantName: string
  quadrantOrder: QuadrantOrder
  blips: PositionedBlip[]
  highlightedBlipId: number | null
}>()

const emit = defineEmits<{
  (e: 'blip-hover', blip: PositionedBlip | null): void
  (e: 'blip-click', blip: PositionedBlip): void
}>()

// Group blips by ring
const ringGroups = computed(() => {
  return RING_NAMES.map((ringName, index) => ({
    name: ringName,
    blips: props.blips.filter((b) => b.ringIndex === index),
  }))
})

function handleBlipHover(blip: PositionedBlip | null) {
  emit('blip-hover', blip)
}

function handleBlipClick(blip: PositionedBlip) {
  emit('blip-click', blip)
}
</script>

<style scoped>
.quadrant-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.quadrant-title {
  margin: 0;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 600;
  font-family: var(--font-mono);
  color: white;
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
  border-bottom: 1px solid #e0e0e0;
}

.ring-section:last-child {
  border-bottom: none;
}

.ring-title {
  margin: 0;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-mono);
  color: #333;
  background: #f5f5f5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.blip-list {
  margin: 0;
  padding: 0;
}

.empty-ring {
  margin: 0;
  padding: 12px 20px;
  color: #999;
  font-style: italic;
  font-size: 13px;
  font-family: var(--font-sans);
}
</style>
