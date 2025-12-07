<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="header-title">Tech Radar</h1>
          <p class="header-subtitle">
            Technology choices for our engineering teams
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>

    <!-- Quadrant navigation tabs -->
    <RadarHeader
      v-if="radar"
      :radar="radar"
      :selected-quadrant="selectedQuadrant"
      @select="handleQuadrantSelected"
    />

    <div v-if="radar" class="main-content">
      <!-- Search bar -->
      <div class="search-container">
        <RadarSearch :radar="radar" @select="handleSearchSelect" />
      </div>

      <!-- Main radar and table container -->
      <main class="radar-layout" :class="layoutClasses">
        <!-- Table on LEFT (for NE/NW quadrants - radar moves right) -->
        <div
          v-if="selectedQuadrant && selectedQuadrantObj && isRadarOnRight"
          class="table-wrapper table-left"
        >
          <BlipListByQuadrant
            :quadrant-name="selectedQuadrantObj.name"
            :quadrant-position="selectedQuadrant"
            :blips="selectedQuadrantBlips"
            :highlighted-blip-id="hoveredBlipId"
            @blip-hover="handleTableBlipHover"
            @blip-click="handleBlipSelected"
          />
        </div>

        <div class="radar-wrapper" :style="radarWrapperStyle">
          <TechRadar
            ref="techRadarRef"
            :radar="radar"
            :selected-quadrant="selectedQuadrant"
            @quadrant-selected="handleQuadrantSelected"
            @blip-selected="handleBlipSelected"
            @blip-hovered="handleBlipHovered"
          />
        </div>

        <!-- Table on RIGHT (for SW/SE quadrants - radar moves left) -->
        <div
          v-if="selectedQuadrant && selectedQuadrantObj && !isRadarOnRight"
          class="table-wrapper table-right"
        >
          <BlipListByQuadrant
            :quadrant-name="selectedQuadrantObj.name"
            :quadrant-position="selectedQuadrant"
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
import { shallowRef, ref, computed, onMounted } from "vue";
import TechRadar from "./components/TechRadar.vue";
import BlipListByQuadrant from "./components/BlipListByQuadrant.vue";
import RadarLegend from "./components/RadarLegend.vue";
import RadarSearch from "./components/RadarSearch.vue";
import RadarHeader from "./components/RadarHeader.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import { Radar } from "./models/radar";
import { SampleDataProvider } from "./data/providers/sample-data-provider";
import type { TechRadarDataProvider } from "./data/tech-radar-data-provider";
import type { PositionedBlip, QuadrantGeometryConfig } from "./models/quadrant.geometry";
import { type QuadrantPosition, graphConfig } from "./config/radar-config";
import { useTheme } from "./composables/useTheme";
import { RingGeometry } from "./models/ring.geometry";
import { QuadrantGeometry } from "./models/quadrant.geometry";

type SearchResult = {
  blip: { name: string };
  quadrant: QuadrantPosition;
  quadrantName: string;
};

// Initialize theme system
useTheme();

// Data provider - can be swapped for different data sources
const dataProvider: TechRadarDataProvider = new SampleDataProvider();

const radar = shallowRef<Radar | null>(null);
const techRadarRef = ref<InstanceType<typeof TechRadar> | null>(null);
const selectedQuadrant = ref<QuadrantPosition | null>(null);
const hoveredBlipId = ref<number | null>(null);

onMounted(async () => {
  const data = await dataProvider.fetch();
  radar.value = Radar.create(data);
});

// Get the selected quadrant
const selectedQuadrantObj = computed(() => {
  if (!radar.value || !selectedQuadrant.value) return null;
  return radar.value.getQuadrant(selectedQuadrant.value);
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

  return QuadrantGeometry.calculateBlipPositions(selectedQuadrantObj.value.blips(), geometry);
});

// Determine if radar should move to the right (NE/NW quadrants selected)
// NE/NW quadrants are on LEFT side of radar, so radar moves RIGHT, table on LEFT
// SW/SE quadrants are on RIGHT side of radar, so radar moves LEFT, table on RIGHT
const isRadarOnRight = computed(() => {
  return (
    selectedQuadrant.value === "NE" || selectedQuadrant.value === "NW"
  );
});

// Layout classes for the radar-layout container
const layoutClasses = computed(() => ({
  "has-selection": !!selectedQuadrant.value,
  "table-on-left": isRadarOnRight.value,
  "table-on-right": selectedQuadrant.value && !isRadarOnRight.value,
}));

// Radar wrapper style - changes width when quadrant is selected
const radarWrapperStyle = computed(() => {
  if (!selectedQuadrant.value) {
    return {
      width: "1024px",
    };
  }

  // Shrink to 0.6 of original width (614px)
  return {
    width: "614px",
  };
});

function handleQuadrantSelected(position: QuadrantPosition | null) {
  selectedQuadrant.value = position;
}

function handleBlipSelected(blip: PositionedBlip) {
  console.log("Blip selected:", blip.name);
}

function handleBlipHovered(blip: PositionedBlip | null) {
  hoveredBlipId.value = blip?.id ?? null;
}

function handleTableBlipHover(blip: PositionedBlip | null) {
  hoveredBlipId.value = blip?.id ?? null;
}

function handleSearchSelect(result: SearchResult) {
  console.log("Search selected:", result.blip.name, "in", result.quadrantName);
  // Zoom to the quadrant
  selectedQuadrant.value = result.quadrant;
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: background-color var(--transition-theme),
    color var(--transition-theme);
}

/* Header Styles */
.app-header {
  background: linear-gradient(
    135deg,
    var(--color-header-start) 0%,
    var(--color-header-end) 100%
  );
  color: var(--color-text-inverse);
  padding: var(--space-8);
  transition: background var(--transition-theme);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.header-text {
  text-align: center;
}

.header-title {
  margin: 0 0 var(--space-2);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
}

.header-subtitle {
  margin: 0;
  font-size: var(--text-lg);
  opacity: 0.9;
  font-family: var(--font-sans);
}

/* Main Content */
.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--space-8);
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-8);
}

/* Radar Layout */
.radar-layout {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: flex-start;
  width: 1056px; /* 1024 + 2*16px padding */
  margin: 0 auto;
}

.radar-wrapper {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  transition: width 1s ease, background-color var(--transition-theme),
    box-shadow var(--transition-theme);
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Table Wrapper */
.table-wrapper {
  width: 410px;
  flex-shrink: 0;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  animation: slideIn 1s ease;
}

.table-wrapper.table-left {
  order: -1;
  animation-name: slideInFromLeft;
}

.table-wrapper.table-right {
  order: 1;
  animation-name: slideInFromRight;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: var(--color-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-4);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .radar-layout {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .table-wrapper {
    flex: none;
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header-title {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .main-content {
    padding: var(--space-4);
  }

  .radar-wrapper {
    padding: var(--space-2);
    overflow-x: auto;
  }
}
</style>
