<template>
  <div id="app">
    <header>
      <h1>Tech Radar</h1>
      <p class="subtitle">Technology choices for our engineering teams</p>
    </header>

    <div v-if="radar" class="main-content">
      <!-- Search bar -->
      <div class="search-container">
        <RadarSearch :radar="radar" @select="handleSearchSelect" />
      </div>

      <!-- Main radar and table container -->
      <main class="radar-layout" :class="{ 'has-selection': selectedQuadrant }">
        <div class="radar-wrapper">
          <TechRadar
            ref="techRadarRef"
            :radar="radar"
            @quadrant-selected="handleQuadrantSelected"
            @blip-selected="handleBlipSelected"
            @blip-hovered="handleBlipHovered"
          />
        </div>

        <div v-if="selectedQuadrant && selectedQuadrantConfig" class="table-wrapper">
          <QuadrantTable
            :quadrant-name="selectedQuadrantConfig.quadrant?.name || ''"
            :quadrant-order="selectedQuadrant"
            :blips="selectedQuadrantBlips"
            :highlighted-blip-id="hoveredBlipId"
            @blip-hover="handleTableBlipHover"
            @blip-click="handleBlipSelected"
          />
        </div>
      </main>

      <!-- Legend -->
      <RadarLegend />
    </div>

    <div v-else class="loading">
      <div class="spinner"></div>
      <p>Loading radar data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, computed, onMounted } from 'vue'
import TechRadar from './components/TechRadar.vue'
import QuadrantTable from './components/QuadrantTable.vue'
import RadarLegend from './components/RadarLegend.vue'
import RadarSearch from './components/RadarSearch.vue'
import { createRadarFromData } from './data/radar-factory'
import { sampleRadarData } from './data/sample-data'
import { Radar } from './models/radar'
import { Ring } from './models/ring'
import type { PositionedBlip, QuadrantGeometry } from './data/types'
import { type QuadrantOrder, graphConfig } from './config/radar-config'

interface SearchResult {
  blip: { name: string }
  quadrant: QuadrantOrder
  quadrantName: string
}

const radar = shallowRef<Radar | null>(null)
const techRadarRef = ref<InstanceType<typeof TechRadar> | null>(null)
const selectedQuadrant = ref<QuadrantOrder | null>(null)
const hoveredBlipId = ref<number | null>(null)

onMounted(() => {
  radar.value = createRadarFromData(sampleRadarData)
})

// Get the selected quadrant configuration
const selectedQuadrantConfig = computed(() => {
  if (!radar.value || !selectedQuadrant.value) return null
  return radar.value.quadrants.find((q) => q.order === selectedQuadrant.value)
})

// Get positioned blips for the selected quadrant
const selectedQuadrantBlips = computed<PositionedBlip[]>(() => {
  if (!selectedQuadrantConfig.value?.quadrant) return []

  const ringRadii = Ring.calculateRadii(graphConfig.quadrantSize)
  const geometry: QuadrantGeometry = {
    startAngle: selectedQuadrantConfig.value.startAngle,
    quadrantSize: graphConfig.quadrantSize,
    ringRadii,
    center: { x: 0, y: 0 },
  }

  return selectedQuadrantConfig.value.quadrant.calculateBlipPositions(geometry)
})

function handleQuadrantSelected(order: QuadrantOrder | null) {
  selectedQuadrant.value = order
}

function handleBlipSelected(blip: PositionedBlip) {
  console.log('Blip selected:', blip.name)
}

function handleBlipHovered(blip: PositionedBlip | null) {
  hoveredBlipId.value = blip?.id ?? null
}

function handleTableBlipHover(blip: PositionedBlip | null) {
  hoveredBlipId.value = blip?.id ?? null
}

function handleSearchSelect(result: SearchResult) {
  console.log('Search selected:', result.blip.name, 'in', result.quadrantName)
  // Zoom to the quadrant
  selectedQuadrant.value = result.quadrant
}
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: #f5f5f5;
}

header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

header h1 {
  margin: 0 0 0.5rem;
  font-size: 2.5rem;
  font-weight: 600;
  font-family: var(--font-mono);
}

header .subtitle {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
  font-family: var(--font-sans);
}

.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.radar-layout {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
}

.radar-layout.has-selection {
  flex-wrap: wrap;
}

.radar-wrapper {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.table-wrapper {
  flex: 0 0 400px;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .radar-layout {
    flex-direction: column;
    align-items: center;
  }

  .table-wrapper {
    flex: none;
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  header h1 {
    font-size: 1.8rem;
  }

  header .subtitle {
    font-size: 0.9rem;
  }

  .main-content {
    padding: 1rem;
  }

  .radar-wrapper {
    padding: 0.5rem;
    overflow-x: auto;
  }
}
</style>
