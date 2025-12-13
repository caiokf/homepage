<template>
  <nav class="radar-header">
    <ul class="radar-header__list">
      <li :class="['radar-header__item', { 'active-item': !selectedQuadrant }]">
        <BaseBracketLink
          class="radar-header__button"
          :aria-pressed="!selectedQuadrant"
          @click="$emit('select', null)"
        >
          all quadrants
        </BaseBracketLink>
      </li>
      <li
        v-for="quadrant in quadrants"
        :key="quadrant.position"
        :class="[
          'radar-header__item',
          quadrant.position,
          {
            'active-item': selectedQuadrant === quadrant.position,
            'faded-item': selectedQuadrant && selectedQuadrant !== quadrant.position,
          },
        ]"
      >
        <BaseBracketLink
          class="radar-header__button"
          :aria-pressed="selectedQuadrant === quadrant.position"
          @click="$emit('select', quadrant.position)"
        >
          {{ quadrant.name }}
        </BaseBracketLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { Radar } from "../models/radar";
  import { type QuadrantPosition, QUADRANT_DISPLAY_ORDER } from "../constants";
  import BaseBracketLink from "../../../components/atoms/BaseBracketLink.vue";

  const props = defineProps<{
    radar: Radar;
    selectedQuadrant: QuadrantPosition | null;
  }>();

  defineEmits<{
    (e: "select", position: QuadrantPosition | null): void;
  }>();

  const quadrants = computed(() =>
    [...props.radar.quadrants].sort(
      (a, b) => QUADRANT_DISPLAY_ORDER.indexOf(a.position) - QUADRANT_DISPLAY_ORDER.indexOf(b.position)
    )
  );
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
    padding: var(--space-2) var(--space-1);
    white-space: nowrap;
    opacity: 0.7;
  }

  .radar-header__button:hover {
    opacity: 1;
  }

  .radar-header__item.active-item .radar-header__button {
    opacity: 1;
    font-weight: var(--font-semibold);
  }

  .radar-header__item.faded-item .radar-header__button {
    opacity: 0.4;
  }

  .radar-header__item.faded-item .radar-header__button:hover {
    opacity: 0.7;
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
