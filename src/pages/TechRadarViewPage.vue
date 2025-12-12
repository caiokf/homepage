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

      <!-- Radar visualization (handles mobile/desktop switching internally) -->
      <div class="radar-section">
        <div class="radar-wrapper">
          <TechRadar
            :radar="radar"
            :selected-quadrant="selectedQuadrant"
            @quadrant-selected="handleQuadrantSelected"
            @blip-selected="handleBlipSelected"
            @blip-hovered="handleBlipHovered"
          />
          <RadarLegend v-if="!isMobile" />

          <!-- Overlay blip list when a quadrant is selected (desktop only) -->
          <div
            v-if="!isMobile && selectedQuadrant && selectedQuadrantObj"
            class="table-overlay"
            :class="tableOverlayPosition"
          >
            <BlipListByQuadrant
              :quadrant-name="selectedQuadrantObj.name"
              :quadrant-position="selectedQuadrant"
              :blips="selectedQuadrantBlips"
              :highlighted-blip-id="hoveredBlipId"
              :expanded-blip-id="expandedBlipId"
              @blip-hover="handleTableBlipHover"
              @blip-click="handleBlipSelected"
              @blip-toggle="handleBlipToggle"
            />
          </div>
        </div>
      </div>

      <!-- Mobile: Blip list when a quadrant is selected -->
      <div v-if="isMobile && selectedQuadrant && selectedQuadrantObj" class="mobile-blip-list">
        <BlipListByQuadrant
          :quadrant-name="selectedQuadrantObj.name"
          :quadrant-position="selectedQuadrant"
          :blips="selectedQuadrantBlips"
          :highlighted-blip-id="hoveredBlipId"
          :expanded-blip-id="expandedBlipId"
          @blip-hover="handleTableBlipHover"
          @blip-click="handleBlipSelected"
          @blip-toggle="handleBlipToggle"
        />
      </div>

      <!-- Mobile: Full blip list when no quadrant selected -->
      <div v-if="isMobile && !selectedQuadrant" class="mobile-blip-list">
        <BlipList
          :quadrants="allQuadrantsWithBlips"
          :highlighted-blip-id="hoveredBlipId"
          :expanded-blip-id="expandedBlipId"
          @blip-hover="handleTableBlipHover"
          @blip-click="handleBlipSelected"
          @blip-toggle="handleBlipToggle"
        />
      </div>

      <!-- Desktop: Blip list below radar when all quadrants visible -->
      <div v-if="!isMobile && !selectedQuadrant" class="table-wrapper table-bottom">
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
  import TechRadar from "../domain/radar/components/TechRadar.vue";
  import BlipList from "../domain/radar/components/BlipList.vue";
  import BlipListByQuadrant from "../domain/radar/components/BlipListByQuadrant.vue";
  import RadarLegend from "../domain/radar/components/RadarLegend.vue";
  import Search from "../domain/radar/components/Search.vue";
  import RadarHeader from "../domain/radar/components/RadarHeader.vue";
  import SpotlightLoader from "../components/atoms/BaseSpotlightLoader.vue";
  import { Radar } from "../domain/radar/models/radar";
  import { SampleDataProvider } from "../domain/radar/data/providers/sample-data-provider";
  import { GoogleSheetsProvider } from "../domain/radar/data/providers/google-sheets-provider";
  import type { TechRadarDataProvider } from "../domain/radar/data/tech-radar-data-provider";
  import type { PositionedBlip, QuadrantGeometryConfig } from "../domain/radar/geometry/quadrant.geometry";
  import {
    type QuadrantPosition,
    graphConfig,
    RADAR_SHEET_ID,
    GOOGLE_API_KEY,
  } from "../domain/radar/config";
  import { RingGeometry } from "../domain/radar/geometry/ring.geometry";
  import { QuadrantGeometry } from "../domain/radar/geometry/quadrant.geometry";

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

  const MIN_LOADING_DURATION = 1500;

  const radar = shallowRef<Radar | null>(null);
  const selectedQuadrant = ref<QuadrantPosition | null>(null);
  const hoveredBlipId = ref<number | null>(null);
  const expandedBlipId = ref<number | null>(null);
  const isMobile = ref(false);

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

  // Get the selected quadrant object
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

  // Get all quadrants with their positioned blips (for "all quadrants" view)
  const QUADRANT_ORDER: QuadrantPosition[] = ["NW", "NE", "SE", "SW"];

  const allQuadrantsWithBlips = computed(() => {
    if (!radar.value) return [];

    const ringRadii = RingGeometry.calculateRadii(graphConfig.quadrantSize);

    const quadrantsWithBlips = radar.value.quadrants.map((quadrant) => {
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

    // Sort by defined quadrant order
    return quadrantsWithBlips.sort(
      (a, b) => QUADRANT_ORDER.indexOf(a.position) - QUADRANT_ORDER.indexOf(b.position)
    );
  });

  // Position the table overlay on the opposite side of the selected quadrant
  const tableOverlayPosition = computed(() => {
    switch (selectedQuadrant.value) {
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
    transition: background-color var(--transition-theme), color var(--transition-theme);
  }

  /* When quadrant is selected, prevent page scroll */
  .tech-radar-view:has(.table-overlay) {
    height: calc(100vh - 112px);
    overflow: hidden;
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

  /* Radar Section */
  .radar-section {
    display: flex;
    justify-content: center;
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
    width: calc(50% - var(--space-4));
    /*
     * Calculate height: viewport - header(56px) - footer(56px) - RadarHeader(~56px)
     * - main padding top(32px) - search container + margin(~80px) - bottom margin(32px)
     */
    max-height: calc(100vh - 312px);
    overflow-y: auto;
    overflow-x: hidden;
    background: transparent;
    border-radius: var(--radius-lg);
    padding: 0;
    box-sizing: border-box;
  }

  .table-overlay.overlay-left {
    left: 0;
  }

  .table-overlay.overlay-right {
    right: 0;
  }

  /* Mobile blip list */
  .mobile-blip-list {
    margin-top: var(--space-4);
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
    .radar-wrapper {
      width: 100%;
      max-width: 1056px;
    }

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
