<template>
  <div class="tech-radar" :class="{ 'quadrant-selected': selectedQuadrant }">
    <!-- Back button when quadrant is selected -->
    <button
      v-if="selectedQuadrant"
      class="back-button"
      @click="deselectQuadrant"
    >
      &larr; Back to full radar
    </button>

    <svg
      ref="svgRef"
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="viewBox"
      class="radar-svg"
      :class="{ 'is-zoomed': selectedQuadrant }"
    >
      <!-- Layer 1: Ring arcs -->
      <g
        v-for="quadrantConfig in quadrantConfigs"
        :key="`rings-${quadrantConfig.order}`"
        :class="[
          'quadrant-group',
          quadrantConfig.order,
          {
            'quadrant-hidden':
              selectedQuadrant && selectedQuadrant !== quadrantConfig.order,
            'quadrant-zoomed': selectedQuadrant === quadrantConfig.order,
          },
        ]"
        :transform="getQuadrantTransform(quadrantConfig.order)"
        :style="getQuadrantStyle(quadrantConfig.order)"
      >
        <!-- Clickable background for quadrant selection -->
        <g
          class="quadrant-background"
          @click="selectQuadrant(quadrantConfig.order)"
        >
          <!-- Ring arcs -->
          <path
            v-for="(ringPath, ringIndex) in getRingPaths(quadrantConfig)"
            :key="`ring-${ringIndex}`"
            :d="ringPath"
            :class="['ring-arc', `ring-arc-${ringIndex}`]"
          />
        </g>
      </g>

      <!-- Layer 2: Separator lines (drawn on top of rings, under blips) -->
      <g
        v-if="!selectedQuadrant"
        :transform="getQuadrantTransform('first')"
        class="quadrant-separators"
      >
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
          v-for="(label, index) in getRingLabelsOnSeparators()"
          :key="`ring-label-${index}`"
          :x="label.x"
          :y="label.y"
          class="ring-label-separator"
        >
          {{ label.name }}
        </text>
      </g>

      <!-- Layer 3: Ring labels, blips, and quadrant names -->
      <g
        v-for="(quadrantConfig, index) in quadrantConfigs"
        :key="`content-${quadrantConfig.order}`"
        :class="[
          'quadrant-group',
          quadrantConfig.order,
          {
            'quadrant-hidden':
              selectedQuadrant && selectedQuadrant !== quadrantConfig.order,
            'quadrant-zoomed': selectedQuadrant === quadrantConfig.order,
          },
        ]"
        :transform="getQuadrantTransform(quadrantConfig.order)"
        :style="getQuadrantStyle(quadrantConfig.order)"
      >
        <!-- Clickable background (invisible, for interaction) -->
        <g
          class="quadrant-background"
          @click="selectQuadrant(quadrantConfig.order)"
        >
          <path
            v-for="(ringPath, ringIndex) in getRingPaths(quadrantConfig)"
            :key="`ring-invisible-${ringIndex}`"
            :d="ringPath"
            class="ring-arc-invisible"
          />
        </g>

        <!-- Blips -->
        <g
          v-for="blip in getPositionedBlips(index)"
          :key="`blip-${blip.id}`"
          :class="[
            'blip',
            quadrantConfig.order,
            { 'blip-faded': hoveredBlip && hoveredBlip.id !== blip.id },
          ]"
          :transform="`translate(${blip.x - 18}, ${blip.y - 18})`"
          @mouseenter="handleBlipHover(blip)"
          @mouseleave="handleBlipLeave()"
          @click.stop="handleBlipClick(blip)"
        >
          <!-- Main circle (36x36 coordinate space, circle at cx=18, cy=18, r=12) -->
          <circle
            cx="18"
            cy="18"
            r="12"
            :class="['blip-circle', quadrantConfig.order]"
          />

          <!-- Indicator based on status -->
          <path
            v-if="blip.isNew"
            :d="getOuterCirclePath()"
            :class="['blip-indicator', quadrantConfig.order]"
            opacity="1"
          />
          <path
            v-else-if="blip.status === 'moved in'"
            :d="getMovedInPath(quadrantConfig.order)"
            :class="['blip-indicator', quadrantConfig.order]"
            opacity="1"
          />
          <path
            v-else-if="blip.status === 'moved out'"
            :d="getMovedOutPath(quadrantConfig.order)"
            :class="['blip-indicator', quadrantConfig.order]"
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
            fill="white"
          >
            {{ blip.blipText }}
          </text>
        </g>

        <!-- Quadrant name with caret -->
        <g :class="['quadrant-name-group', quadrantConfig.order]">
          <foreignObject
            :x="getQuadrantLabelX(quadrantConfig.order)"
            :y="getQuadrantLabelY(quadrantConfig.order)"
            width="150"
            height="40"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              :class="['quadrant-name-text', quadrantConfig.order]"
            >
              {{ quadrantConfig.quadrant?.name }}
            </div>
          </foreignObject>
        </g>
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
import { ref, computed, onMounted, onUnmounted, type CSSProperties } from "vue";
import * as d3 from "d3";
import type { Radar } from "../models/radar";
import { Ring } from "../models/ring";
import type { PositionedBlip, QuadrantGeometry } from "../data/types";
import { graphConfig, type QuadrantOrder } from "../config/radar-config";
import {
  getZoomedViewBoxOffset,
  getQuadrantLabelX as calcQuadrantLabelX,
  getQuadrantLabelY as calcQuadrantLabelY,
  getSeparatorLines as calcSeparatorLines,
  getRingLabelsOnSeparators as calcRingLabelsOnSeparators,
  getOuterCirclePath,
  getMovedInPath,
  getMovedOutPath,
} from "./radar-geometry";

const props = defineProps<{
  radar: Radar;
}>();

const emit = defineEmits<{
  (e: "quadrant-selected", order: QuadrantOrder | null): void;
  (e: "blip-selected", blip: PositionedBlip): void;
  (e: "blip-hovered", blip: PositionedBlip | null): void;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const tooltipRef = ref<HTMLDivElement | null>(null);
const hoveredBlip = ref<PositionedBlip | null>(null);
const mousePosition = ref({ x: 0, y: 0 });
const selectedQuadrant = ref<QuadrantOrder | null>(null);

const radarSize = computed(() => graphConfig.radarSize);
const quadrantSize = computed(() => graphConfig.quadrantSize);

// SVG dimensions change based on selection
const svgWidth = computed(() =>
  selectedQuadrant.value ? quadrantSize.value * 2 : radarSize.value
);
const svgHeight = computed(() =>
  selectedQuadrant.value ? quadrantSize.value * 2 : radarSize.value
);

const viewBox = computed(() => {
  if (!selectedQuadrant.value) {
    return `0 0 ${radarSize.value} ${radarSize.value}`;
  }
  // When zoomed, show just the selected quadrant (half the radar in each dimension)
  const offset = getZoomedViewBoxOffset(
    selectedQuadrant.value,
    radarSize.value
  );
  const zoomSize = radarSize.value / 2;
  return `${offset.x} ${offset.y} ${zoomSize} ${zoomSize}`;
});

// Compute ring radii
const ringRadii = computed(() => Ring.calculateRadii(quadrantSize.value));

// Quadrant configurations with their geometries
const quadrantConfigs = computed(() => props.radar.quadrants);

// Cache positioned blips per quadrant
const positionedBlipsCache = computed(() => {
  const cache: PositionedBlip[][] = [];

  for (const config of quadrantConfigs.value) {
    if (!config.quadrant) {
      cache.push([]);
      continue;
    }

    const geometry: QuadrantGeometry = {
      startAngle: config.startAngle,
      quadrantSize: quadrantSize.value,
      ringRadii: ringRadii.value,
      center: { x: 0, y: 0 },
    };

    cache.push(config.quadrant.calculateBlipPositions(geometry));
  }

  return cache;
});

function getPositionedBlips(quadrantIndex: number): PositionedBlip[] {
  return positionedBlipsCache.value[quadrantIndex] || [];
}

function getQuadrantTransform(_order: QuadrantOrder): string {
  // All quadrants share the same center - the center of the radar
  const centerX = radarSize.value / 2;
  const centerY = radarSize.value / 2;
  return `translate(${centerX}, ${centerY})`;
}

function getQuadrantStyle(order: QuadrantOrder): CSSProperties {
  if (!selectedQuadrant.value) {
    return {};
  }
  if (selectedQuadrant.value === order) {
    return {};
  }
  return { opacity: 0, pointerEvents: "none" };
}

function getRingPaths(
  quadrantConfig: (typeof quadrantConfigs.value)[number]
): string[] {
  const paths: string[] = [];
  // Convert to radians and adjust for D3's coordinate system
  // D3 arc: 0 = 12 o'clock, positive = clockwise
  // We need to offset by -π/2 to align with standard math coordinates
  const startAngle = ((quadrantConfig.startAngle - 90) * Math.PI) / 180;
  const endAngle = startAngle + Math.PI / 2; // 90 degree arc clockwise

  for (let i = 0; i < ringRadii.value.length - 1; i++) {
    const arc = d3
      .arc()
      .innerRadius(ringRadii.value[i])
      .outerRadius(ringRadii.value[i + 1])
      .startAngle(startAngle)
      .endAngle(endAngle);

    paths.push(arc({} as any) || "");
  }

  return paths;
}

function getQuadrantLabelX(order: QuadrantOrder): number {
  const outerRadius = ringRadii.value[ringRadii.value.length - 1];
  return calcQuadrantLabelX(order, outerRadius);
}

function getQuadrantLabelY(order: QuadrantOrder): number {
  const outerRadius = ringRadii.value[ringRadii.value.length - 1];
  return calcQuadrantLabelY(order, outerRadius);
}

function getSeparatorLines() {
  const outerRadius = ringRadii.value[ringRadii.value.length - 1];
  return calcSeparatorLines(outerRadius);
}

function getRingLabelsOnSeparators() {
  return calcRingLabelsOnSeparators(ringRadii.value);
}

// Quadrant selection
function selectQuadrant(order: QuadrantOrder) {
  if (selectedQuadrant.value) return; // Already zoomed, don't re-zoom
  selectedQuadrant.value = order;
  emit("quadrant-selected", order);
}

function deselectQuadrant() {
  selectedQuadrant.value = null;
  emit("quadrant-selected", null);
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

function handleBlipClick(blip: PositionedBlip) {
  emit("blip-selected", blip);
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
  display: inline-block;
}

.radar-svg {
  display: block;
  transition: width 0.5s ease, height 0.5s ease;
}

/* Back button */
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background: #163c4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  z-index: 10;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: #1f5266;
}

/* Quadrant group transitions */
.quadrant-group {
  transition: opacity 0.5s ease;
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

/* Separator lines between quadrants */
.separator-line {
  stroke: white;
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
.blip-circle.first {
  fill: var(--quadrant-first);
}
.blip-circle.second {
  fill: var(--quadrant-second);
}
.blip-circle.third {
  fill: var(--quadrant-third);
}
.blip-circle.fourth {
  fill: var(--quadrant-fourth);
}

/* Blip indicators (new, moved in, moved out) */
.blip-indicator {
  fill: none;
  stroke-width: 2;
}
.blip-indicator.first {
  fill: var(--quadrant-first);
}
.blip-indicator.second {
  fill: var(--quadrant-second);
}
.blip-indicator.third {
  fill: var(--quadrant-third);
}
.blip-indicator.fourth {
  fill: var(--quadrant-fourth);
}

/* Blip text */
.blip-text {
  pointer-events: none;
  font-style: normal;
  font-family: var(--font-mono);
}

/* Blip hover effects */
.blip {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.blip-faded {
  opacity: 0.3;
}

.blip:hover {
  opacity: 1;
}

/* Ring names */
.ring-name {
  fill: #333;
  font-size: 11px;
  font-weight: 500;
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}

/* Ring labels on separator lines */
.ring-label-separator {
  fill: #333;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
  paint-order: stroke fill;
  stroke: white;
  stroke-width: 4px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Quadrant names */
.quadrant-name-group {
  pointer-events: none;
}

.quadrant-name-text {
  font-size: 18px;
  font-weight: 600;
  font-family: var(--font-mono);
  max-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.2;
}

.quadrant-name-text.first {
  color: var(--quadrant-first);
  text-align: left;
}
.quadrant-name-text.second {
  color: var(--quadrant-second);
  text-align: left;
}
.quadrant-name-text.third {
  color: var(--quadrant-third);
  text-align: right;
}
.quadrant-name-text.fourth {
  color: var(--quadrant-fourth);
  text-align: right;
}

/* Tooltip */
.radar-tooltip {
  position: fixed;
  background: #163c4d;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  max-width: 200px;
}
</style>
