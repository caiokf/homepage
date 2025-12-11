<template>
  <div class="tech-radar-desktop">
    <div class="radar-wrapper">
      <TechRadar
        :radar="radar"
        :selected-quadrant="selectedQuadrant"
        @quadrant-selected="$emit('quadrant-selected', $event)"
        @blip-selected="(blip, quadrant) => $emit('blip-selected', blip, quadrant)"
        @blip-hovered="$emit('blip-hovered', $event)"
      />
      <RadarLegend />

      <!-- Overlay blip list at the top when one quadrant is selected -->
      <div
        v-if="selectedQuadrant && selectedQuadrantObj"
        class="table-overlay"
        :class="tableOverlayPosition"
      >
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
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import TechRadar from "./TechRadar.vue";
  import RadarLegend from "./RadarLegend.vue";
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
    "blip-selected": [blip: PositionedBlip, quadrant: QuadrantPosition];
    "blip-hovered": [blip: PositionedBlip | null];
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

  // Position the table overlay on the opposite side of the selected quadrant
  const tableOverlayPosition = computed(() => {
    switch (props.selectedQuadrant) {
      case "NE":
        return "overlay-left";
      case "NW":
        return "overlay-right";
      case "SW":
        return "overlay-right";
      case "SE":
        return "overlay-left";
      default:
        return "";
    }
  });
</script>

<style scoped>
  .tech-radar-desktop {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 1056px;
    margin: 0 auto;
  }

  .radar-wrapper {
    position: relative;
    width: 1056px;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* Overlay table at the top of radar */
  .table-overlay {
    position: absolute;
    top: 0;
    width: 50%;
    height: 50%;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--color-background);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-sizing: border-box;
  }

  .table-overlay.overlay-left {
    left: 0;
  }

  .table-overlay.overlay-right {
    right: 0;
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .tech-radar-desktop {
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .radar-wrapper {
      width: 100%;
      max-width: 1056px;
    }
  }
</style>
