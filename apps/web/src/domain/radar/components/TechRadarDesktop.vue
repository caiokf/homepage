<template>
  <div class="tech-radar" :class="{ 'quadrant-selected': selectedQuadrant }">
    <svg
      ref="svgRef"
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="viewBox"
      class="radar-svg"
      :class="{ 'is-zoomed': selectedQuadrant }"
    >
      <!-- Each quadrant as a single group -->
      <g
        v-for="(quadrant, index) in quadrants"
        :key="`quadrant-${quadrant.position}`"
        :class="[
          'quadrant-group',
          quadrant.position,
          {
            'quadrant-hidden':
              selectedQuadrant && selectedQuadrant !== quadrant.position,
            'quadrant-zoomed': selectedQuadrant === quadrant.position,
          },
        ]"
        :transform="getQuadrantTransform(quadrant.position)"
        :style="getQuadrantStyle(quadrant.position)"
      >
        <!-- Clickable background for quadrant selection -->
        <g
          class="quadrant-background"
          @click="selectQuadrant(quadrant.position)"
        >
          <!-- Ring arcs -->
          <path
            v-for="(ringPath, ringIndex) in getRingPaths(quadrant)"
            :key="`ring-${ringIndex}`"
            :d="ringPath"
            :class="['ring-arc', `ring-arc-${ringIndex}`]"
          />
        </g>

        <!-- Blips -->
        <RadarBlip
          v-for="(blip, blipIndex) in getPositionedBlips(index)"
          :key="`blip-${blip.id}`"
          :blip="blip"
          :x="blip.x"
          :y="blip.y"
          :quadrant-position="quadrant.position"
          :blip-index="blipIndex"
          :is-faded="!!hoveredBlip && hoveredBlip.id !== blip.id"
          @hover="handleBlipHover"
          @leave="handleBlipLeave"
          @click="(b) => handleBlipClick(b, quadrant.position)"
        />

        <!-- Quadrant name -->
        <QuadrantLabel
          :name="quadrant.name"
          :position="quadrant.position"
          :outer-radius="outerRadius"
        />
      </g>

      <!-- Separator lines (drawn on top of quadrants) -->
      <RadarSeparators
        v-if="!selectedQuadrant"
        :radar-size="radarSize"
        :ring-radii="ringRadii"
      />
    </svg>

    <!-- Tooltip -->
    <RadarTooltip
      :visible="!!hoveredBlip"
      :text="hoveredBlip?.name ?? ''"
      :x="mousePosition.x"
      :y="mousePosition.y"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    type CSSProperties,
  } from "vue";
  import * as d3 from "d3";
  import type { Radar } from "../models/radar";
  import type { Quadrant } from "../models/quadrant";
  import type {
    PositionedBlip,
    QuadrantGeometryConfig,
    QuadrantPosition,
  } from "../types";
  import { RADAR_SIZE, QUADRANT_SIZE } from "../constants";
  import { calculateRingRadii } from "../geometry/svg-layout.geometry";
  import { BlipPositioning } from "../geometry/blip-positioning.geometry";
  import RadarBlip from "./RadarBlip.vue";
  import RadarSeparators from "./RadarSeparators.vue";
  import RadarTooltip from "./RadarTooltip.vue";
  import QuadrantLabel from "./QuadrantLabel.vue";

  type Props = {
    radar: Radar;
    selectedQuadrant: QuadrantPosition | null;
  };

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "quadrant-selected": [position: QuadrantPosition | null];
    "blip-selected": [blip: PositionedBlip, quadrant: QuadrantPosition];
    "blip-hovered": [blip: PositionedBlip | null];
  }>();

  const hoveredBlip = ref<PositionedBlip | null>(null);
  const mousePosition = ref({ x: 0, y: 0 });

  const radarSize = RADAR_SIZE;
  const quadrantSize = QUADRANT_SIZE;

  const svgWidth = "100%";
  const svgHeight = "100%";

  const viewBox = computed(() => `0 0 ${radarSize} ${radarSize}`);

  const ringRadii = computed(() => calculateRingRadii(quadrantSize));

  const outerRadius = computed(
    () => ringRadii.value[ringRadii.value.length - 1]
  );

  const quadrants = computed(() => props.radar.quadrants);

  // Cache positioned blips per quadrant
  const positionedBlipsCache = computed(() => {
    const cache: PositionedBlip[][] = [];

    for (const quadrant of quadrants.value) {
      const geometry: QuadrantGeometryConfig = {
        startAngle: quadrant.startAngle,
        quadrantSize: quadrantSize,
        ringRadii: ringRadii.value,
        center: { x: 0, y: 0 },
      };

      cache.push(
        BlipPositioning.calculateBlipPositions(quadrant.blips(), geometry)
      );
    }

    return cache;
  });

  function getPositionedBlips(quadrantIndex: number): PositionedBlip[] {
    return positionedBlipsCache.value[quadrantIndex] || [];
  }

  function getQuadrantTransform(position: QuadrantPosition): string {
    const centerX = radarSize / 2;
    const centerY = radarSize / 2;

    if (props.selectedQuadrant === position) {
      switch (position) {
        case "SW":
        case "SE":
          return `translate(${centerX}, 0)`;
      }
    }

    return `translate(${centerX}, ${centerY})`;
  }

  function getQuadrantStyle(position: QuadrantPosition): CSSProperties {
    const centerX = radarSize / 2;
    const centerY = radarSize / 2;

    let translateX = centerX;
    let translateY = centerY;

    if (props.selectedQuadrant === position) {
      if (position === "SW" || position === "SE") {
        translateY = 0;
      }
    }

    const baseStyle: CSSProperties = {
      "--quadrant-translate-x": `${translateX}px`,
      "--quadrant-translate-y": `${translateY}px`,
    } as CSSProperties;

    if (!props.selectedQuadrant) {
      return baseStyle;
    }
    if (props.selectedQuadrant === position) {
      return baseStyle;
    }
    return { ...baseStyle, opacity: 0, pointerEvents: "none" };
  }

  function getRingPaths(quadrant: Quadrant): string[] {
    const paths: string[] = [];
    const startAngle = ((quadrant.startAngle - 90) * Math.PI) / 180;
    const endAngle = startAngle + Math.PI / 2;

    for (let i = 0; i < ringRadii.value.length - 1; i++) {
      const innerRadius =
        i === 0 && props.selectedQuadrant ? 0 : ringRadii.value[i];

      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(ringRadii.value[i + 1])
        .startAngle(startAngle)
        .endAngle(endAngle);

      paths.push(arc({} as d3.DefaultArcObject) || "");
    }

    return paths;
  }

  function selectQuadrant(position: QuadrantPosition) {
    if (props.selectedQuadrant) return;
    emit("quadrant-selected", position);
  }

  function handleBlipHover(blip: PositionedBlip) {
    hoveredBlip.value = blip;
    emit("blip-hovered", blip);
  }

  function handleBlipLeave() {
    hoveredBlip.value = null;
    emit("blip-hovered", null);
  }

  function handleBlipClick(blip: PositionedBlip, quadrant: QuadrantPosition) {
    emit("blip-selected", blip, quadrant);
  }

  function handleMouseMove(e: MouseEvent) {
    mousePosition.value = { x: e.clientX, y: e.clientY };
  }

  onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
  });

  onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
  });
</script>

<style scoped>
  .tech-radar {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
  }

  .radar-svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .quadrant-group {
    transition:
      opacity var(--transition-slow),
      transform var(--transition-slow);
  }

  .quadrant-zoomed {
    animation: quadrantZoomIn 400ms ease-out forwards;
  }

  @keyframes quadrantZoomIn {
    0% {
      transform: translate(var(--quadrant-translate-x), var(--quadrant-translate-y))
        scale(0.95);
    }
    50% {
      transform: translate(var(--quadrant-translate-x), var(--quadrant-translate-y))
        scale(1.02);
    }
    100% {
      transform: translate(var(--quadrant-translate-x), var(--quadrant-translate-y))
        scale(1);
    }
  }

  .quadrant-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .quadrant-hidden.NW {
    transform: translate(calc(var(--quadrant-translate-x) - 40px), var(--quadrant-translate-y))
      scale(0.9);
  }

  .quadrant-hidden.NE {
    transform: translate(calc(var(--quadrant-translate-x) + 40px), var(--quadrant-translate-y))
      scale(0.9);
  }

  .quadrant-hidden.SW {
    transform: translate(calc(var(--quadrant-translate-x) - 40px), var(--quadrant-translate-y))
      scale(0.9);
  }

  .quadrant-hidden.SE {
    transform: translate(calc(var(--quadrant-translate-x) + 40px), var(--quadrant-translate-y))
      scale(0.9);
  }

  .quadrant-background {
    cursor: pointer;
  }

  .quadrant-selected .quadrant-background {
    cursor: default;
  }

  .ring-arc-0 {
    fill: var(--ring-0);
  }

  .ring-arc-1 {
    fill: var(--ring-1);
  }

  .ring-arc-2 {
    fill: var(--ring-2);
  }

  .ring-arc-3 {
    fill: var(--ring-3);
  }

  .ring-arc-invisible {
    fill: transparent;
    pointer-events: all;
  }

  .ring-name {
    fill: var(--color-text-primary);
    font-size: 11px;
    font-weight: var(--font-medium);
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
  }
</style>
