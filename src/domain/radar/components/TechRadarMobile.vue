<template>
  <div class="tech-radar-mobile">
    <div class="quadrant-grid">
      <button
        v-for="quadrant in radar.quadrants"
        :key="quadrant.position"
        :class="[
          'quadrant-card',
          quadrant.position,
          {
            'active-card': selectedQuadrant === quadrant.position,
            'faded-card': selectedQuadrant && selectedQuadrant !== quadrant.position,
          },
        ]"
        @click="$emit('quadrant-selected', quadrant.position)"
      >
        <div class="quadrant-card__rings"><span></span></div>
        <span class="quadrant-card__name">{{ quadrant.name }}</span>
        <span class="quadrant-card__count">{{ quadrant.blips().length }} items</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Radar } from "../models/radar";
  import type { QuadrantPosition } from "../constants";

  defineProps<{
    radar: Radar;
    selectedQuadrant: QuadrantPosition | null;
  }>();

  defineEmits<{
    "quadrant-selected": [position: QuadrantPosition];
  }>();
</script>

<style scoped>
  .tech-radar-mobile {
    width: 100%;
  }

  /* Quadrant Grid */
  .quadrant-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .quadrant-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-6) var(--space-4);
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
    min-height: 100px;
    overflow: hidden;
  }

  .quadrant-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .quadrant-card:active {
    transform: translateY(0);
  }

  .quadrant-card.faded-card {
    opacity: 0.4;
  }

  .quadrant-card.faded-card:hover {
    opacity: 0.7;
    transform: translateY(-2px);
  }

  .quadrant-card.NE {
    background-color: var(--quadrant-NE);
    order: 2; /* top-right */
  }

  .quadrant-card.NW {
    background-color: var(--quadrant-NW);
    order: 1; /* top-left */
  }

  .quadrant-card.SW {
    background-color: var(--quadrant-SW);
    order: 3; /* bottom-left */
  }

  .quadrant-card.SE {
    background-color: var(--quadrant-SE);
    order: 4; /* bottom-right */
  }

  /* Ring decorations in inner corners */
  .quadrant-card__rings {
    position: absolute;
    width: 120px;
    height: 120px;
    pointer-events: none;
  }

  .quadrant-card__rings::before,
  .quadrant-card__rings::after,
  .quadrant-card__rings span {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.25);
  }

  /* Ring 1 - smallest */
  .quadrant-card__rings::before {
    width: 40px;
    height: 40px;
  }

  /* Ring 2 - medium */
  .quadrant-card__rings::after {
    width: 70px;
    height: 70px;
  }

  /* Ring 3 - largest */
  .quadrant-card__rings span {
    width: 100px;
    height: 100px;
  }

  /* NE quadrant: rings in bottom-left corner (opposite of position) */
  .quadrant-card.NE .quadrant-card__rings {
    bottom: -60px;
    left: -60px;
  }

  .quadrant-card.NE .quadrant-card__rings::before {
    bottom: 40px;
    left: 40px;
  }

  .quadrant-card.NE .quadrant-card__rings::after {
    bottom: 25px;
    left: 25px;
  }

  .quadrant-card.NE .quadrant-card__rings span {
    bottom: 10px;
    left: 10px;
  }

  /* NW quadrant: rings in bottom-right corner */
  .quadrant-card.NW .quadrant-card__rings {
    bottom: -60px;
    right: -60px;
  }

  .quadrant-card.NW .quadrant-card__rings::before {
    bottom: 40px;
    right: 40px;
  }

  .quadrant-card.NW .quadrant-card__rings::after {
    bottom: 25px;
    right: 25px;
  }

  .quadrant-card.NW .quadrant-card__rings span {
    bottom: 10px;
    right: 10px;
  }

  /* SW quadrant: rings in top-right corner */
  .quadrant-card.SW .quadrant-card__rings {
    top: -60px;
    right: -60px;
  }

  .quadrant-card.SW .quadrant-card__rings::before {
    top: 40px;
    right: 40px;
  }

  .quadrant-card.SW .quadrant-card__rings::after {
    top: 25px;
    right: 25px;
  }

  .quadrant-card.SW .quadrant-card__rings span {
    top: 10px;
    right: 10px;
  }

  /* SE quadrant: rings in top-left corner */
  .quadrant-card.SE .quadrant-card__rings {
    top: -60px;
    left: -60px;
  }

  .quadrant-card.SE .quadrant-card__rings::before {
    top: 40px;
    left: 40px;
  }

  .quadrant-card.SE .quadrant-card__rings::after {
    top: 25px;
    left: 25px;
  }

  .quadrant-card.SE .quadrant-card__rings span {
    top: 10px;
    left: 10px;
  }

  .quadrant-card__name {
    position: relative;
    z-index: 1;
    font-family: var(--font-mono);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: white;
    text-transform: lowercase;
    text-align: center;
    margin-bottom: var(--space-1);
  }

  .quadrant-card__count {
    position: relative;
    z-index: 1;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: rgba(255, 255, 255, 0.8);
    text-transform: lowercase;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .quadrant-card {
      padding: var(--space-4) var(--space-3);
      min-height: 80px;
    }

    .quadrant-card__name {
      font-size: var(--text-sm);
    }
  }
</style>
