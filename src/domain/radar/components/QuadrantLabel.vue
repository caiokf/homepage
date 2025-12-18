<template>
  <g :class="['quadrant-name-group', position]">
    <foreignObject :x="labelX" :y="labelY" width="150" height="40">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        :class="['quadrant-name-text', position]"
      >
        {{ name }}
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { QuadrantPosition } from "../types";
  import { RadarGeometry } from "../geometry/svg-layout.geometry";

  type Props = {
    name: string;
    position: QuadrantPosition;
    outerRadius: number;
  };

  const props = defineProps<Props>();

  const labelX = computed(() =>
    RadarGeometry.getQuadrantLabelX(props.position, props.outerRadius)
  );

  const labelY = computed(() =>
    RadarGeometry.getQuadrantLabelY(props.position, props.outerRadius)
  );
</script>

<style scoped>
  .quadrant-name-group {
    pointer-events: none;
  }

  .quadrant-name-text {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    max-width: 150px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: var(--leading-tight);
    text-transform: lowercase;
  }

  .quadrant-name-text.NW {
    color: var(--quadrant-NW);
    text-align: left;
  }

  .quadrant-name-text.NE {
    color: var(--quadrant-NE);
    text-align: right;
  }

  .quadrant-name-text.SW {
    color: var(--quadrant-SW);
    text-align: left;
  }

  .quadrant-name-text.SE {
    color: var(--quadrant-SE);
    text-align: right;
  }
</style>
