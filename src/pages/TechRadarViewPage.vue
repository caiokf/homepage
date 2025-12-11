<template>
  <div class="tech-radar-view">
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
        <Search :radar="radar" @select="handleSearchSelect" />
      </div>

      <!-- Desktop: Full radar with legend -->
      <TechRadarDesktop
        v-if="!isMobile"
        :radar="radar"
        :selected-quadrant="selectedQuadrant"
        :highlighted-blip-id="hoveredBlipId"
        :expanded-blip-id="expandedBlipId"
        @quadrant-selected="handleQuadrantSelected"
        @blip-selected="handleBlipSelected"
        @blip-hovered="handleBlipHovered"
        @blip-hover="handleTableBlipHover"
        @blip-click="handleBlipSelected"
        @blip-toggle="handleBlipToggle"
      />

      <!-- Mobile: Quadrant cards grid or blip list -->
      <TechRadarMobile
        v-else
        :radar="radar"
        :selected-quadrant="selectedQuadrant"
        :highlighted-blip-id="hoveredBlipId"
        :expanded-blip-id="expandedBlipId"
        @quadrant-selected="handleQuadrantSelected"
        @blip-hover="handleTableBlipHover"
        @blip-click="handleBlipSelected"
        @blip-toggle="handleBlipToggle"
      />

      <!-- Blip list below radar when all quadrants visible (desktop only) -->
      <div v-if="!selectedQuadrant && !isMobile" class="table-wrapper table-bottom">
        <BlipList
          :quadrants="allQuadrantsWithBlips"
          :highlighted-blip-id="hoveredBlipId"
          :expanded-blip-id="expandedBlipId"
          @blip-hover="handleTableBlipHover"
          @blip-click="handleBlipSelected"
          @blip-toggle="handleBlipToggle"
        />
      </div>
    </div>

    <div v-else class="loading">
      <SpotlightLoader :size="180" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, ref, computed, onMounted, onUnmounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import TechRadarDesktop from "../components/radar/TechRadarDesktop.vue";
  import TechRadarMobile from "../components/radar/TechRadarMobile.vue";
  import BlipList from "../components/radar/BlipList.vue";
  import Search from "../components/radar/Search.vue";
  import RadarHeader from "../components/radar/RadarHeader.vue";
  import SpotlightLoader from "../components/SpotlightLoader.vue";
  import { Radar } from "../models/radar";
  import { SampleDataProvider } from "../data/providers/sample-data-provider";
  import { GoogleSheetsProvider } from "../data/providers/google-sheets-provider";
  import type { TechRadarDataProvider } from "../data/tech-radar-data-provider";
  import type { PositionedBlip, QuadrantGeometryConfig } from "../models/quadrant.geometry";
  import {
    type QuadrantPosition,
    graphConfig,
    RADAR_SHEET_ID,
    GOOGLE_API_KEY,
  } from "../config/radar-config";
  import { RingGeometry } from "../models/ring.geometry";
  import { QuadrantGeometry } from "../models/quadrant.geometry";

  type SearchResult = {
    blip: { id: number; name: string };
    quadrant: QuadrantPosition;
    quadrantName: string;
  };

  const MOBILE_BREAKPOINT = 1000;

  const route = useRoute();

  // Data provider - use Google Sheets if configured, otherwise fallback to sample data
  const dataProvider: TechRadarDataProvider =
    RADAR_SHEET_ID && GOOGLE_API_KEY
      ? new GoogleSheetsProvider({ sheetId: RADAR_SHEET_ID, apiKey: GOOGLE_API_KEY })
      : new SampleDataProvider();

  const MIN_LOADING_DURATION = 1000;

  const radar = shallowRef<Radar | null>(null);
  const selectedQuadrant = ref<QuadrantPosition | null>(null);
  const hoveredBlipId = ref<number | null>(null);
  const expandedBlipId = ref<number | null>(null);
  const isMobile = ref(false);

  // Check if we're on mobile based on window width
  function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  }

  async function loadVersion(versionId: string) {
    radar.value = null;
    const startTime = Date.now();

    const data = await dataProvider.fetchVersion(versionId);

    // Ensure minimum loading duration for smooth animation
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_LOADING_DURATION) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_DURATION - elapsed));
    }

    radar.value = Radar.create(data);
  }

  onMounted(async () => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const versionId = route.params.id as string;
    if (versionId) {
      await loadVersion(decodeURIComponent(versionId));
    }
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });

  // Watch for route changes to reload data
  watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        await loadVersion(decodeURIComponent(newId as string));
      }
    }
  );

  // Get all quadrants with their positioned blips (for "all quadrants" view)
  const allQuadrantsWithBlips = computed(() => {
    if (!radar.value) return [];

    const ringRadii = RingGeometry.calculateRadii(graphConfig.quadrantSize);

    return radar.value.quadrants.map((quadrant) => {
      const geometry: QuadrantGeometryConfig = {
        startAngle: quadrant.startAngle,
        quadrantSize: graphConfig.quadrantSize,
        ringRadii,
        center: { x: 0, y: 0 },
      };

      return {
        position: quadrant.position,
        name: quadrant.name,
        blips: QuadrantGeometry.calculateBlipPositions(quadrant.blips(), geometry),
      };
    });
  });

  function handleQuadrantSelected(position: QuadrantPosition | null) {
    selectedQuadrant.value = position;
  }

  function handleBlipSelected(blip: PositionedBlip, quadrant?: QuadrantPosition) {
    // Select the quadrant and expand the blip in the list
    if (quadrant) {
      selectedQuadrant.value = quadrant;
    }
    expandedBlipId.value = blip.id;
  }

  function handleBlipHovered(blip: PositionedBlip | null) {
    hoveredBlipId.value = blip?.id ?? null;
  }

  function handleTableBlipHover(blip: PositionedBlip | null) {
    hoveredBlipId.value = blip?.id ?? null;
  }

  function handleSearchSelect(result: SearchResult) {
    // Zoom to the quadrant and expand the blip (same as clicking)
    selectedQuadrant.value = result.quadrant;
    expandedBlipId.value = result.blip.id;
  }

  function handleBlipToggle(blipId: number) {
    // Toggle: if clicking the same blip, close it; otherwise open the new one
    expandedBlipId.value = expandedBlipId.value === blipId ? null : blipId;
  }
</script>

<style scoped>
  .tech-radar-view {
    min-height: calc(100vh - 112px);
    background: var(--color-background);
    color: var(--color-text-primary);
    transition:
      background-color var(--transition-theme),
      color var(--transition-theme);
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

  /* Table Wrapper */
  .table-wrapper {
    box-sizing: border-box;
  }

  /* Bottom table (when all quadrants visible) */
  .table-wrapper.table-bottom {
    width: 1056px;
    margin: var(--space-8) auto 0;
  }

  /* Loading State */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 112px);
  }

  /* Responsive Styles */
  @media (max-width: 1200px) {
    .table-wrapper.table-bottom {
      width: 100%;
    }
  }

  @media (max-width: 1000px) {
    .main-content {
      padding: var(--space-4);
    }
  }
</style>
