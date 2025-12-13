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
        <g
          v-for="blip in getPositionedBlips(index)"
          :key="`blip-${blip.id}`"
          :class="[
            'blip',
            quadrant.position,
            { 'blip-faded': hoveredBlip && hoveredBlip.id !== blip.id },
          ]"
          :transform="`translate(${blip.x - 18}, ${blip.y - 18})`"
          @mouseenter="handleBlipHover(blip)"
          @mouseleave="handleBlipLeave()"
          @click.stop="handleBlipClick(blip, quadrant.position)"
        >
          <!-- Main circle (36x36 coordinate space, circle at cx=18, cy=18, r=12) -->
          <circle
            cx="18"
            cy="18"
            r="12"
            :class="['blip-circle', quadrant.position]"
          />

          <!-- Indicator based on status -->
          <path
            v-if="blip.isNew"
            :d="BlipGeometry.getNewIndicatorPath()"
            :class="['blip-indicator', quadrant.position]"
            opacity="1"
          />
          <path
            v-else-if="blip.status === 'moved in'"
            :d="BlipGeometry.getMovedInIndicatorPath(quadrant.position)"
            :class="['blip-indicator', quadrant.position]"
            opacity="1"
          />
          <path
            v-else-if="blip.status === 'moved out'"
            :d="BlipGeometry.getMovedOutIndicatorPath(quadrant.position)"
            :class="['blip-indicator', quadrant.position]"
            opacity="1"
          />

          <!-- Blip number -->
          <text
            x="18"
            y="19"
            class="blip-text"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="10px"
            font-weight="bold"
          >
            {{ blip.blipText }}
          </text>
        </g>

        <!-- Quadrant name -->
        <g :class="['quadrant-name-group', quadrant.position]">
          <foreignObject
            :x="getQuadrantLabelX(quadrant.position)"
            :y="getQuadrantLabelY(quadrant.position)"
            width="150"
            height="40"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              :class="['quadrant-name-text', quadrant.position]"
            >
              {{ quadrant.name }}
            </div>
          </foreignObject>
        </g>
      </g>

      <!-- Separator lines (drawn on top of quadrants) -->
      <g
        v-if="!selectedQuadrant"
        :transform="getCenterTransform()"
        class="quadrant-separators"
      >
        <!-- Center circle to fill inner buffer gap -->
        <circle cx="0" cy="0" :r="ringRadii[0]" class="center-circle" />
        <line
          v-for="separator in getSeparatorLines()"
          :key="`separator-${separator.angle}`"
          :x1="separator.x1"
          :y1="separator.y1"
          :x2="separator.x2"
          :y2="separator.y2"
          class="separator-line"
        />
        <!-- Ring labels on horizontal separator -->
        <text
          v-for="(label, index) in calcRingLabelsOnSeparators()"
          :key="`ring-label-${index}`"
          :x="label.x"
          y="0"
          class="ring-label-separator"
        >
          {{ label.name }}
        </text>
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="hoveredBlip"
      ref="tooltipRef"
      class="radar-tooltip"
      :style="tooltipStyle"
    >
      {{ hoveredBlip.name }}
    </div>
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
  } from "../geometry/quadrant.geometry";
import type { QuadrantPosition } from "../types";
  import { RADAR_SIZE, QUADRANT_SIZE } from "../constants";
  import { RingGeometry } from "../geometry/ring.geometry";
  import { QuadrantGeometry } from "../geometry/quadrant.geometry";
  import { RadarGeometry } from "../geometry/radar.geometry";
  import { BlipGeometry } from "../geometry/blip.geometry";

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

  // SVG dimensions - responsive, fills container
  const svgWidth = "100%";
  const svgHeight = "100%";

  const viewBox = computed(() => {
    // Always show the full radar - no zooming
    return `0 0 ${radarSize} ${radarSize}`;
  });

  // Compute ring radii
  const ringRadii = computed(() =>
    RingGeometry.calculateRadii(quadrantSize)
  );

  // Get all quadrants from radar
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
        QuadrantGeometry.calculateBlipPositions(quadrant.blips(), geometry)
      );
    }

    return cache;
  });

  function getPositionedBlips(quadrantIndex: number): PositionedBlip[] {
    return positionedBlipsCache.value[quadrantIndex] || [];
  }

  function getCenterTransform(): string {
    const centerX = radarSize / 2;
    const centerY = radarSize / 2;
    return `translate(${centerX}, ${centerY})`;
  }

  function getQuadrantTransform(position: QuadrantPosition): string {
    const centerX = radarSize / 2;
    const centerY = radarSize / 2;

    // If this quadrant is selected and it's a bottom quadrant, move it to the top
    if (props.selectedQuadrant === position) {
      switch (position) {
        case "SW": // bottom-left -> move up to top-left
          return `translate(${centerX}, 0)`;
        case "SE": // bottom-right -> move up to top-right
          return `translate(${centerX}, 0)`;
      }
    }

    // Default: center of radar
    return `translate(${centerX}, ${centerY})`;
  }

  function getQuadrantStyle(position: QuadrantPosition): CSSProperties {
    if (!props.selectedQuadrant) {
      return {};
    }
    if (props.selectedQuadrant === position) {
      return {};
    }
    return { opacity: 0, pointerEvents: "none" };
  }

  function getRingPaths(quadrant: Quadrant): string[] {
    const paths: string[] = [];
    // Convert to radians and adjust for D3's coordinate system
    // D3 arc: 0 = 12 o'clock, positive = clockwise
    // We need to offset by -pi/2 to align with standard math coordinates
    const startAngle = ((quadrant.startAngle - 90) * Math.PI) / 180;
    const endAngle = startAngle + Math.PI / 2; // 90 degree arc clockwise

    for (let i = 0; i < ringRadii.value.length - 1; i++) {
      // When a quadrant is selected (zoomed), extend innermost ring to center
      // to avoid visible gap at the corner
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

  function getQuadrantLabelX(position: QuadrantPosition): number {
    const outerRadius = ringRadii.value[ringRadii.value.length - 1];
    return RadarGeometry.getQuadrantLabelX(position, outerRadius);
  }

  function getQuadrantLabelY(position: QuadrantPosition): number {
    const outerRadius = ringRadii.value[ringRadii.value.length - 1];
    return RadarGeometry.getQuadrantLabelY(position, outerRadius);
  }

  function getSeparatorLines() {
    const outerRadius = ringRadii.value[ringRadii.value.length - 1];
    return RadarGeometry.getSeparatorLines(outerRadius);
  }

  function calcRingLabelsOnSeparators() {
    return RingGeometry.getLabelsOnSeparators(ringRadii.value);
  }

  // Quadrant selection
  function selectQuadrant(position: QuadrantPosition) {
    if (props.selectedQuadrant) return; // Already zoomed, don't re-zoom
    emit("quadrant-selected", position);
  }

  // Tooltip positioning
  const tooltipStyle = computed<CSSProperties>(() => {
    if (!hoveredBlip.value) return { display: "none" };

    return {
      left: `${mousePosition.value.x + 15}px`,
      top: `${mousePosition.value.y - 10}px`,
    };
  });

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

  // Track mouse position for tooltip
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

  /* Quadrant group transitions */
  .quadrant-group {
    transition:
      opacity var(--transition-slow),
      transform var(--transition-slow);
  }

  .quadrant-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .quadrant-background {
    cursor: pointer;
  }

  .quadrant-selected .quadrant-background {
    cursor: default;
  }

  /* Center circle to fill inner buffer gap */
  .center-circle {
    fill: var(--ring-0);
  }

  /* Separator lines between quadrants */
  .separator-line {
    stroke: var(--color-separator);
    stroke-width: 32;
    pointer-events: none;
  }

  /* Ring arc colors */
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

  /* Invisible clickable ring arcs in layer 3 */
  .ring-arc-invisible {
    fill: transparent;
    pointer-events: all;
  }

  /* Quadrant blip colors */
  .blip-circle.NE {
    fill: var(--quadrant-NE);
  }

  .blip-circle.NW {
    fill: var(--quadrant-NW);
  }

  .blip-circle.SW {
    fill: var(--quadrant-SW);
  }

  .blip-circle.SE {
    fill: var(--quadrant-SE);
  }

  /* Blip indicators (new, moved in, moved out) */
  .blip-indicator {
    fill: none;
    stroke-width: 2;
  }

  .blip-indicator.NE {
    fill: var(--quadrant-NE);
  }

  .blip-indicator.NW {
    fill: var(--quadrant-NW);
  }

  .blip-indicator.SW {
    fill: var(--quadrant-SW);
  }

  .blip-indicator.SE {
    fill: var(--quadrant-SE);
  }

  /* Blip text */
  .blip-text {
    pointer-events: none;
    font-style: normal;
    font-family: var(--font-mono);
    fill: var(--color-text-inverse);
  }

  /* Blip hover effects */
  .blip {
    cursor: pointer;
    transition: opacity var(--transition-normal);
  }

  .blip-faded {
    opacity: 0.3;
  }

  .blip:hover {
    opacity: 1;
  }

  /* Ring names */
  .ring-name {
    fill: var(--color-text-primary);
    font-size: 11px;
    font-weight: var(--font-medium);
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
  }

  /* Ring labels on separator lines */
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

  /* Quadrant names */
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

  /* Tooltip */
  .radar-tooltip {
    position: fixed;
    background: var(--color-tooltip-bg);
    color: var(--color-tooltip-text);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    pointer-events: none;
    z-index: 100;
    max-width: 200px;
    box-shadow: var(--shadow-lg);
    transition: background-color var(--transition-theme),
      color var(--transition-theme);
  }
</style>
