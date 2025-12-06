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
        v-for="(quadrantConfig, index) in quadrantConfigs"
        :key="`rings-${quadrantConfig.order}`"
        :class="[
          'quadrant-group',
          quadrantConfig.order,
          {
            'quadrant-hidden': selectedQuadrant && selectedQuadrant !== quadrantConfig.order,
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
      </g>

      <!-- Layer 3: Ring labels, blips, and quadrant names -->
      <g
        v-for="(quadrantConfig, index) in quadrantConfigs"
        :key="`content-${quadrantConfig.order}`"
        :class="[
          'quadrant-group',
          quadrantConfig.order,
          {
            'quadrant-hidden': selectedQuadrant && selectedQuadrant !== quadrantConfig.order,
            'quadrant-zoomed': selectedQuadrant === quadrantConfig.order,
          },
        ]"
        :transform="getQuadrantTransform(quadrantConfig.order)"
        :style="getQuadrantStyle(quadrantConfig.order)"
      >
        <!-- Ring names -->
        <text
          v-for="(ringLabel, ringIndex) in getRingLabels(quadrantConfig)"
          :key="`ring-label-${ringIndex}`"
          :x="ringLabel.x"
          :y="ringLabel.y"
          class="ring-name"
        >
          {{ ringLabel.name }}
        </text>

        <!-- Blips -->
        <g
          v-for="blip in getPositionedBlips(index)"
          :key="`blip-${blip.id}`"
          :class="[
            'blip',
            quadrantConfig.order,
            { 'blip-new': blip.isNew, 'blip-faded': hoveredBlip && hoveredBlip.id !== blip.id },
          ]"
          :transform="`translate(${blip.x}, ${blip.y})`"
          @mouseenter="handleBlipHover(blip)"
          @mouseleave="handleBlipLeave()"
          @click.stop="handleBlipClick(blip)"
        >
          <!-- Circle for blip -->
          <circle
            :r="blip.width / 2"
            :class="['blip-circle', quadrantConfig.order]"
          />
          <!-- Outer ring for new blips -->
          <circle
            v-if="blip.isNew"
            :r="blip.width / 2 + 4"
            class="blip-new-indicator"
            fill="none"
            stroke-width="2"
          />
          <!-- Blip number -->
          <text class="blip-text" text-anchor="middle" dominant-baseline="central">
            {{ blip.blipText }}
          </text>
        </g>

        <!-- Quadrant name -->
        <text
          :x="getQuadrantNamePosition(quadrantConfig.order).x"
          :y="getQuadrantNamePosition(quadrantConfig.order).y"
          :class="['quadrant-name', quadrantConfig.order]"
        >
          {{ quadrantConfig.quadrant?.name }}
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
import { ref, computed, onMounted, onUnmounted, type CSSProperties } from 'vue'
import * as d3 from 'd3'
import type { Radar } from '../models/radar'
import { Ring } from '../models/ring'
import type { PositionedBlip, QuadrantGeometry } from '../data/types'
import {
  graphConfig,
  RING_NAMES,
  type QuadrantOrder,
} from '../config/radar-config'

const props = defineProps<{
  radar: Radar
}>()

const emit = defineEmits<{
  (e: 'quadrant-selected', order: QuadrantOrder | null): void
  (e: 'blip-selected', blip: PositionedBlip): void
  (e: 'blip-hovered', blip: PositionedBlip | null): void
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const tooltipRef = ref<HTMLDivElement | null>(null)
const hoveredBlip = ref<PositionedBlip | null>(null)
const mousePosition = ref({ x: 0, y: 0 })
const selectedQuadrant = ref<QuadrantOrder | null>(null)

const radarSize = computed(() => graphConfig.radarSize)
const quadrantSize = computed(() => graphConfig.quadrantSize)

// SVG dimensions change based on selection
const svgWidth = computed(() => selectedQuadrant.value ? quadrantSize.value * 2 : radarSize.value)
const svgHeight = computed(() => selectedQuadrant.value ? quadrantSize.value * 2 : radarSize.value)

const viewBox = computed(() => {
  if (!selectedQuadrant.value) {
    return `0 0 ${radarSize.value} ${radarSize.value}`
  }
  // When zoomed, show just the selected quadrant (half the radar in each dimension)
  const offset = getZoomedViewBoxOffset(selectedQuadrant.value)
  const zoomSize = radarSize.value / 2
  return `${offset.x} ${offset.y} ${zoomSize} ${zoomSize}`
})

function getZoomedViewBoxOffset(order: QuadrantOrder): { x: number; y: number } {
  const center = radarSize.value / 2
  // Offset to show just the selected quadrant (quarter of the radar)
  switch (order) {
    case 'first': // top-right
      return { x: center, y: 0 }
    case 'second': // top-left
      return { x: 0, y: 0 }
    case 'third': // bottom-left
      return { x: 0, y: center }
    case 'fourth': // bottom-right
      return { x: center, y: center }
    default:
      return { x: 0, y: 0 }
  }
}

// Compute ring radii
const ringRadii = computed(() => Ring.calculateRadii(quadrantSize.value))

// Quadrant configurations with their geometries
const quadrantConfigs = computed(() => props.radar.quadrants)

// Cache positioned blips per quadrant
const positionedBlipsCache = computed(() => {
  const cache: PositionedBlip[][] = []

  for (const config of quadrantConfigs.value) {
    if (!config.quadrant) {
      cache.push([])
      continue
    }

    const geometry: QuadrantGeometry = {
      startAngle: config.startAngle,
      quadrantSize: quadrantSize.value,
      ringRadii: ringRadii.value,
      center: { x: 0, y: 0 },
    }

    cache.push(config.quadrant.calculateBlipPositions(geometry))
  }

  return cache
})

function getPositionedBlips(quadrantIndex: number): PositionedBlip[] {
  return positionedBlipsCache.value[quadrantIndex] || []
}

function getQuadrantTransform(_order: QuadrantOrder): string {
  // All quadrants share the same center - the center of the radar
  const centerX = radarSize.value / 2
  const centerY = radarSize.value / 2
  return `translate(${centerX}, ${centerY})`
}

function getQuadrantStyle(order: QuadrantOrder): CSSProperties {
  if (!selectedQuadrant.value) {
    return {}
  }
  if (selectedQuadrant.value === order) {
    return {}
  }
  return { opacity: 0, pointerEvents: 'none' }
}

function getRingPaths(quadrantConfig: (typeof quadrantConfigs.value)[number]): string[] {
  const paths: string[] = []
  // Convert to radians and adjust for D3's coordinate system
  // D3 arc: 0 = 12 o'clock, positive = clockwise
  // We need to offset by -π/2 to align with standard math coordinates
  const startAngle = ((quadrantConfig.startAngle - 90) * Math.PI) / 180
  const endAngle = startAngle + Math.PI / 2 // 90 degree arc clockwise

  for (let i = 0; i < ringRadii.value.length - 1; i++) {
    const arc = d3
      .arc()
      .innerRadius(ringRadii.value[i])
      .outerRadius(ringRadii.value[i + 1])
      .startAngle(startAngle)
      .endAngle(endAngle)

    paths.push(arc({} as any) || '')
  }

  return paths
}

function getRingLabels(
  quadrantConfig: (typeof quadrantConfigs.value)[number]
): Array<{ x: number; y: number; name: string }> {
  const labels: Array<{ x: number; y: number; name: string }> = []
  // Position labels at 45 degrees into the quadrant (middle of the arc)
  // Adjust for D3/SVG coordinate system
  const midAngle = ((quadrantConfig.startAngle - 90 + 45) * Math.PI) / 180

  for (let i = 0; i < RING_NAMES.length; i++) {
    const radius = (ringRadii.value[i] + ringRadii.value[i + 1]) / 2

    labels.push({
      x: radius * Math.sin(midAngle), // sin for x in D3's rotated system
      y: -radius * Math.cos(midAngle), // -cos for y (SVG y-axis is inverted)
      name: RING_NAMES[i],
    })
  }

  return labels
}

function getQuadrantNamePosition(order: QuadrantOrder): { x: number; y: number } {
  const offset = quadrantSize.value * 0.85

  switch (order) {
    case 'first':
      return { x: offset * 0.7, y: -offset * 0.85 }
    case 'second':
      return { x: -offset * 0.7, y: -offset * 0.85 }
    case 'third':
      return { x: -offset * 0.7, y: offset * 0.95 }
    case 'fourth':
      return { x: offset * 0.7, y: offset * 0.95 }
    default:
      return { x: 0, y: 0 }
  }
}

function getSeparatorLines(): Array<{ angle: number; x1: number; y1: number; x2: number; y2: number }> {
  // Separator lines at the boundaries between quadrants
  // Boundaries are at 0°, 90°, -90°, and 180°
  const boundaryAngles = [0, 90, -90, 180]
  const outerRadius = ringRadii.value[ringRadii.value.length - 1]

  return boundaryAngles.map(angle => {
    // Convert to D3's coordinate system (offset by -90° and convert to radians)
    const angleInRadians = ((angle - 90) * Math.PI) / 180

    return {
      angle,
      x1: 0,
      y1: 0,
      x2: outerRadius * Math.sin(angleInRadians),
      y2: -outerRadius * Math.cos(angleInRadians),
    }
  })
}

// Quadrant selection
function selectQuadrant(order: QuadrantOrder) {
  if (selectedQuadrant.value) return // Already zoomed, don't re-zoom
  selectedQuadrant.value = order
  emit('quadrant-selected', order)
}

function deselectQuadrant() {
  selectedQuadrant.value = null
  emit('quadrant-selected', null)
}

// Tooltip positioning
const tooltipStyle = computed<CSSProperties>(() => {
  if (!hoveredBlip.value) return { display: 'none' }

  return {
    left: `${mousePosition.value.x + 15}px`,
    top: `${mousePosition.value.y - 10}px`,
  }
})

function handleBlipHover(blip: PositionedBlip) {
  hoveredBlip.value = blip
  emit('blip-hovered', blip)
}

function handleBlipLeave() {
  hoveredBlip.value = null
  emit('blip-hovered', null)
}

function handleBlipClick(blip: PositionedBlip) {
  emit('blip-selected', blip)
}

// Track mouse position for tooltip
function handleMouseMove(e: MouseEvent) {
  mousePosition.value = { x: e.clientX, y: e.clientY }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
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
  fill: #bababa;
}
.ring-arc-1 {
  fill: #cacaca;
}
.ring-arc-2 {
  fill: #dadada;
}
.ring-arc-3 {
  fill: #eeeeee;
}

/* Quadrant blip colors */
.blip-circle.first {
  fill: #1f8290;
}
.blip-circle.second {
  fill: #a06908;
}
.blip-circle.third {
  fill: #517b5c;
}
.blip-circle.fourth {
  fill: #9b293c;
}

/* New blip indicator */
.blip-new-indicator {
  stroke: currentColor;
}
.first .blip-new-indicator {
  stroke: #1f8290;
}
.second .blip-new-indicator {
  stroke: #a06908;
}
.third .blip-new-indicator {
  stroke: #517b5c;
}
.fourth .blip-new-indicator {
  stroke: #9b293c;
}

/* Blip text */
.blip-text {
  fill: white;
  font-size: 9px;
  font-style: italic;
  pointer-events: none;
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

/* Quadrant names */
.quadrant-name {
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  pointer-events: none;
}
.quadrant-name.first {
  fill: #1f8290;
}
.quadrant-name.second {
  fill: #a06908;
}
.quadrant-name.third {
  fill: #517b5c;
}
.quadrant-name.fourth {
  fill: #9b293c;
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
