<template>
  <div class="tech-radar-mobile">
    <!-- Quadrant selection grid (shows when no quadrant selected) -->
    <div v-if="!selectedQuadrant" class="quadrant-grid">
      <button
        v-for="quadrant in radar.quadrants"
        :key="quadrant.position"
        :class="['quadrant-card', quadrant.position]"
        @click="$emit('quadrant-selected', quadrant.position)"
      >
        <div class="quadrant-card__rings"><span></span></div>
        <span class="quadrant-card__name">{{ quadrant.name }}</span>
        <span class="quadrant-card__count">{{ quadrant.blips().length }} items</span>
      </button>
    </div>

    <!-- Blip list (shows when a quadrant is selected) -->
    <div v-else-if="selectedQuadrantObj" class="blip-list-container">
      <BlipListByQuadrant
        :quadrant-name="selectedQuadrantObj.name"
        :quadrant-position="selectedQuadrant"
        :blips="selectedQuadrantBlips"
        :highlighted-blip-id="highlightedBlipId"
        :expanded-blip-id="expandedBlipId"
        @blip-hover="$emit('blip-hover', $event)"
        @blip-click="(blip) => $emit('blip-click', blip, selectedQuadrant!)"
        @blip-toggle="$emit('blip-toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import BlipListByQuadrant from "./BlipListByQuadrant.vue";
  import type { Radar } from "../../models/radar";
  import type {
    PositionedBlip,
    QuadrantGeometryConfig,
  } from "../../models/quadrant.geometry";
  import { graphConfig, type QuadrantPosition } from "../../config/radar-config";
  import { RingGeometry } from "../../models/ring.geometry";
  import { QuadrantGeometry } from "../../models/quadrant.geometry";

  type Props = {
    radar: Radar;
    selectedQuadrant: QuadrantPosition | null;
    highlightedBlipId: number | null;
    expandedBlipId: number | null;
  };

  const props = defineProps<Props>();

  defineEmits<{
    "quadrant-selected": [position: QuadrantPosition | null];
    "blip-hover": [blip: PositionedBlip | null];
    "blip-click": [blip: PositionedBlip, quadrant: QuadrantPosition];
    "blip-toggle": [blipId: number];
  }>();

  // Get the selected quadrant object
  const selectedQuadrantObj = computed(() => {
    if (!props.selectedQuadrant) return null;
    return props.radar.getQuadrant(props.selectedQuadrant);
  });

  // Get positioned blips for the selected quadrant
  const selectedQuadrantBlips = computed<PositionedBlip[]>(() => {
    if (!selectedQuadrantObj.value) return [];

    const ringRadii = RingGeometry.calculateRadii(graphConfig.quadrantSize);
    const geometry: QuadrantGeometryConfig = {
      startAngle: selectedQuadrantObj.value.startAngle,
      quadrantSize: graphConfig.quadrantSize,
      ringRadii,
      center: { x: 0, y: 0 },
    };

    return QuadrantGeometry.calculateBlipPositions(
      selectedQuadrantObj.value.blips(),
      geometry
    );
  });
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

  /* Blip list container */
  .blip-list-container {
    width: 100%;
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
