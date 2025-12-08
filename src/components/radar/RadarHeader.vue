<template>
  <nav class="radar-header">
    <ul class="radar-header__list">
      <li :class="['radar-header__item', { 'active-item': !selectedQuadrant }]">
        <button class="radar-header__button bracket-link" @click="$emit('select', null)">
          all quadrants
        </button>
      </li>
      <li
        v-for="quadrant in quadrants"
        :key="quadrant.position"
        :class="[
          'radar-header__item',
          quadrant.position,
          { 'active-item': selectedQuadrant === quadrant.position },
        ]"
      >
        <button
          class="radar-header__button bracket-link"
          @click="$emit('select', quadrant.position)"
        >
          {{ quadrant.name }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { Radar } from "../../models/radar";
  import type { QuadrantPosition } from "../../config/radar-config";

  const props = defineProps<{
    radar: Radar;
    selectedQuadrant: QuadrantPosition | null;
  }>();

  defineEmits<{
    (e: "select", position: QuadrantPosition | null): void;
  }>();

  const quadrants = computed(() => props.radar.quadrants);
</script>

<style scoped>
  .radar-header {
    width: 100%;
    background-color: var(--color-background-muted);
    display: flex;
    justify-content: center;
    padding: var(--space-4) var(--space-6);
    transition: background-color var(--transition-theme);
  }

  .radar-header__list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--space-6);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .radar-header__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .radar-header__button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    padding: var(--space-2) var(--space-1);
    white-space: nowrap;
    text-transform: lowercase;
  }

  .radar-header__button.bracket-link {
    opacity: 0.7;
  }

  .radar-header__button.bracket-link:hover {
    opacity: 1;
  }

  .radar-header__item.active-item .radar-header__button.bracket-link {
    opacity: 1;
    font-weight: var(--font-semibold);
  }

  /* Active state colors */
  .radar-header__item.active-item .radar-header__button {
    color: var(--color-primary);
  }

  .radar-header__item.NE.active-item .radar-header__button {
    color: var(--quadrant-NE);
  }

  .radar-header__item.NW.active-item .radar-header__button {
    color: var(--quadrant-NW);
  }

  .radar-header__item.SW.active-item .radar-header__button {
    color: var(--quadrant-SW);
  }

  .radar-header__item.SE.active-item .radar-header__button {
    color: var(--quadrant-SE);
  }

  @media (max-width: 768px) {
    .radar-header {
      padding: var(--space-3) var(--space-4);
    }

    .radar-header__list {
      flex-wrap: wrap;
      gap: var(--space-4);
    }
  }

  @media (max-width: 480px) {
    .radar-header__list {
      gap: var(--space-2);
    }

    .radar-header__button {
      font-size: var(--text-xs);
    }
  }
</style>
