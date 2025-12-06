<template>
  <nav class="radar-header">
    <ul class="radar-header__list">
      <li
        :class="['radar-header__item', { 'active-item': !selectedQuadrant }]"
      >
        <button
          class="radar-header__button"
          @click="$emit('select', null)"
        >
          All quadrants
        </button>
      </li>
      <li
        v-for="quadrant in quadrants"
        :key="quadrant.order"
        :class="['radar-header__item', quadrant.order, { 'active-item': selectedQuadrant === quadrant.order }]"
      >
        <button
          class="radar-header__button"
          @click="$emit('select', quadrant.order)"
        >
          {{ quadrant.quadrant?.name }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Radar } from '../models/radar'
import type { QuadrantOrder } from '../config/radar-config'

const props = defineProps<{
  radar: Radar
  selectedQuadrant: QuadrantOrder | null
}>()

defineEmits<{
  (e: 'select', quadrant: QuadrantOrder | null): void
}>()

const quadrants = computed(() => props.radar.quadrants)
</script>

<style scoped>
.radar-header {
  width: 100%;
  background-color: #edf1f3;
  display: flex;
  justify-content: center;
  min-height: 56px;
}

.radar-header__list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
}

.radar-header__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  font-size: 16px;
  border-bottom: 4px solid transparent;
}

.radar-header__item.active-item {
  font-weight: bold;
  pointer-events: none;
  padding-top: 4px;
}

/* Active state border colors */
.radar-header__item.active-item {
  border-color: #71777d;
}

.radar-header__item.first.active-item {
  border-color: var(--quadrant-first);
}

.radar-header__item.second.active-item {
  border-color: var(--quadrant-second);
}

.radar-header__item.third.active-item {
  border-color: var(--quadrant-third);
}

.radar-header__item.fourth.active-item {
  border-color: var(--quadrant-fourth);
}

.radar-header__item:not(.active-item):hover {
  color: #bd4257;
  text-decoration: underline;
  text-underline-offset: 6px;
}

.radar-header__item:not(.active-item):hover .radar-header__button {
  color: #bd4257;
}

.radar-header__button {
  text-decoration: none;
  border: none;
  font-family: var(--font-mono);
  font-size: inherit;
  cursor: pointer;
  background-color: transparent;
  padding: 15px 40px;
  margin: 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1024px) {
  .radar-header__list {
    flex-wrap: wrap;
  }

  .radar-header__button {
    padding: 12px 20px;
  }
}

@media (max-width: 600px) {
  .radar-header__list {
    flex-direction: column;
  }

  .radar-header__item {
    width: 100%;
    border-bottom: 1px solid #d5d9db;
  }

  .radar-header__item.active-item {
    border-bottom-width: 4px;
  }
}
</style>
