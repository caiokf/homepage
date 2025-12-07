<template>
  <nav class="radar-header">
    <ul class="radar-header__list">
      <li :class="['radar-header__item', { 'active-item': !selectedQuadrant }]">
        <button class="radar-header__button" @click="$emit('select', null)">
          All quadrants
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
          class="radar-header__button"
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
    min-height: 56px;
    transition: background-color var(--transition-theme);
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
    font-size: var(--text-md);
    border-bottom: 4px solid transparent;
    color: var(--color-text-primary);
    transition: color var(--transition-fast), border-color var(--transition-fast);
  }

  .radar-header__item.active-item {
    font-weight: var(--font-bold);
    pointer-events: none;
    padding-top: 4px;
  }

  /* Active state border colors */
  .radar-header__item.active-item {
    border-color: var(--color-text-muted);
  }

  .radar-header__item.NE.active-item {
    border-color: var(--quadrant-NE);
  }

  .radar-header__item.NW.active-item {
    border-color: var(--quadrant-NW);
  }

  .radar-header__item.SW.active-item {
    border-color: var(--quadrant-SW);
  }

  .radar-header__item.SE.active-item {
    border-color: var(--quadrant-SE);
  }

  .radar-header__item:not(.active-item):hover {
    color: var(--color-link-hover);
    text-decoration: underline;
    text-underline-offset: 6px;
  }

  .radar-header__item:not(.active-item):hover .radar-header__button {
    color: var(--color-link-hover);
  }

  .radar-header__button {
    text-decoration: none;
    border: none;
    font-family: var(--font-mono);
    font-size: inherit;
    cursor: pointer;
    background-color: transparent;
    color: inherit;
    padding: var(--space-4) var(--space-10);
    margin: 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--transition-fast);
  }

  @media (max-width: 1024px) {
    .radar-header__list {
      flex-wrap: wrap;
    }

    .radar-header__button {
      padding: var(--space-3) var(--space-5);
    }
  }

  @media (max-width: 600px) {
    .radar-header__list {
      flex-direction: column;
    }

    .radar-header__item {
      width: 100%;
      border-bottom: 1px solid var(--color-border);
    }

    .radar-header__item.active-item {
      border-bottom-width: 4px;
    }
  }
</style>
