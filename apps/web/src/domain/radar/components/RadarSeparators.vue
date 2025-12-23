<template>
  <g :transform="centerTransform" class="quadrant-separators">
    <!-- Center circle to fill inner buffer gap -->
    <circle cx="0" cy="0" :r="innerRadius" class="center-circle" />

    <!-- Separator lines -->
    <line
      v-for="separator in separatorLines"
      :key="`separator-${separator.angle}`"
      :x1="separator.x1"
      :y1="separator.y1"
      :x2="separator.x2"
      :y2="separator.y2"
      class="separator-line"
    />

    <!-- Ring labels on horizontal separator -->
    <text
      v-for="(label, index) in ringLabels"
      :key="`ring-label-${index}`"
      :x="label.x"
      y="0"
      class="ring-label-separator"
    >
      {{ label.name }}
    </text>
  </g>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import {
    getSeparatorLines,
    getRingLabelsOnSeparators,
  } from "../geometry/svg-layout.geometry";

  type Props = {
    radarSize: number;
    ringRadii: number[];
  };

  const props = defineProps<Props>();

  const centerTransform = computed(() => {
    const center = props.radarSize / 2;
    return `translate(${center}, ${center})`;
  });

  const innerRadius = computed(() => props.ringRadii[0]);

  const outerRadius = computed(
    () => props.ringRadii[props.ringRadii.length - 1]
  );

  const separatorLines = computed(() =>
    getSeparatorLines(outerRadius.value)
  );

  const ringLabels = computed(() =>
    getRingLabelsOnSeparators(props.ringRadii)
  );
</script>

<style scoped>
  .center-circle {
    fill: var(--ring-0);
  }

  .separator-line {
    stroke: var(--color-separator);
    stroke-width: 32;
    pointer-events: none;
  }

  .ring-label-separator {
    fill: var(--color-text-primary);
    font-size: 12px;
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
    paint-order: stroke fill;
    stroke: var(--color-separator);
    stroke-width: 4px;
    stroke-linecap: round;
    stroke-linejoin: round;
    text-transform: lowercase;
  }
</style>
