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

      <!-- Mobile quadrant grid (shows below 1000px) -->
      <div v-if="!selectedQuadrant" class="mobile-quadrant-grid">
        <button
          v-for="quadrant in radar.quadrants"
          :key="quadrant.position"
          :class="['quadrant-card', quadrant.position]"
          @click="handleQuadrantSelected(quadrant.position)"
        >
          <div class="quadrant-card__rings"><span></span></div>
          <span class="quadrant-card__name">{{ quadrant.name }}</span>
          <span class="quadrant-card__count">{{ quadrant.blips().length }} items</span>
        </button>
      </div>

      <!-- Main radar and table container (hidden on mobile unless quadrant selected) -->
      <main class="radar-layout" :class="layoutClasses">
        <div class="radar-wrapper">
          <TechRadar
            ref="techRadarRef"
            :radar="radar"
            :selected-quadrant="selectedQuadrant"
            @quadrant-selected="handleQuadrantSelected"
            @blip-selected="handleBlipSelected"
            @blip-hovered="handleBlipHovered"
          />
          <RadarLegend />

          <!-- Overlay blip list at the top when one quadrant is selected -->
          <div
            v-if="selectedQuadrant && selectedQuadrantObj"
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
      </main>

      <!-- Blip list below radar when all quadrants visible -->
      <div v-if="!selectedQuadrant" class="table-wrapper table-bottom">
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
      <div class="spotlight-container">
        <div class="spotlight spotlight-ne"></div>
        <div class="spotlight spotlight-nw"></div>
        <div class="spotlight spotlight-sw"></div>
        <div class="spotlight spotlight-se"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, ref, computed, onMounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import TechRadar from "../components/radar/TechRadar.vue";
  import BlipList from "../components/radar/BlipList.vue";
  import BlipListByQuadrant from "../components/radar/BlipListByQuadrant.vue";
  import RadarLegend from "../components/radar/RadarLegend.vue";
  import Search from "../components/radar/Search.vue";
  import RadarHeader from "../components/radar/RadarHeader.vue";
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
    blip: { name: string };
    quadrant: QuadrantPosition;
    quadrantName: string;
  };

  const route = useRoute();

  // Data provider - use Google Sheets if configured, otherwise fallback to sample data
  const dataProvider: TechRadarDataProvider =
    RADAR_SHEET_ID && GOOGLE_API_KEY
      ? new GoogleSheetsProvider({ sheetId: RADAR_SHEET_ID, apiKey: GOOGLE_API_KEY })
      : new SampleDataProvider();

  const MIN_LOADING_DURATION = 100000;

  const radar = shallowRef<Radar | null>(null);
  const techRadarRef = ref<InstanceType<typeof TechRadar> | null>(null);
  const selectedQuadrant = ref<QuadrantPosition | null>(null);
  const hoveredBlipId = ref<number | null>(null);
  const expandedBlipId = ref<number | null>(null);

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
    const versionId = route.params.id as string;
    if (versionId) {
      await loadVersion(decodeURIComponent(versionId));
    }
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

  // Layout classes for the radar-layout container
  const layoutClasses = computed(() => ({
    "has-selection": !!selectedQuadrant.value,
  }));

  // Position the table overlay on the opposite side of the selected quadrant
  // All overlays at the top, but left/right based on opposite quadrant
  const tableOverlayPosition = computed(() => {
    switch (selectedQuadrant.value) {
      case "NE": // top-right -> overlay top-left
        return "overlay-left";
      case "NW": // top-left -> overlay top-right
        return "overlay-right";
      case "SW": // bottom-left -> overlay top-right
        return "overlay-right";
      case "SE": // bottom-right -> overlay top-left
        return "overlay-left";
      default:
        return "";
    }
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
    justify-content: center;
    align-items: flex-start;
    width: 1056px;
    margin: 0 auto;
  }

  .radar-wrapper {
    position: relative;
    width: 1056px;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* Table Wrapper - shared styles */
  .table-wrapper {
    box-sizing: border-box;
  }

  /* Overlay table at the top of radar */
  .table-overlay {
    position: absolute;
    top: 0;
    width: 50%;
    height: 50%;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--color-background);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-sizing: border-box;
  }

  .table-overlay.overlay-left {
    left: 0;
  }

  .table-overlay.overlay-right {
    right: 0;
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

  .spotlight-container {
    position: relative;
    width: 500px;
    height: 500px;
  }

  .spotlight {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.8;
  }

  .spotlight-ne {
    background-color: var(--quadrant-NE);
    animation: dance-ne 8s linear infinite;
  }

  .spotlight-nw {
    background-color: var(--quadrant-NW);
    animation: dance-nw 15s linear infinite;
  }

  .spotlight-sw {
    background-color: var(--quadrant-SW);
    animation: dance-sw 13s linear infinite;
  }

  .spotlight-se {
    background-color: var(--quadrant-SE);
    animation: dance-se 14s linear infinite;
  }

  /* NE: smooth orbit around top-right area */
  @keyframes dance-ne {
    0% {
      transform: translate(280px, 40px) scale(1);
    }
    12.5% {
      transform: translate(310px, 70px) scale(1.05);
    }
    25% {
      transform: translate(300px, 110px) scale(1.08);
    }
    37.5% {
      transform: translate(260px, 130px) scale(1.05);
    }
    50% {
      transform: translate(220px, 110px) scale(1);
    }
    62.5% {
      transform: translate(200px, 70px) scale(0.95);
    }
    75% {
      transform: translate(220px, 30px) scale(0.92);
    }
    87.5% {
      transform: translate(260px, 20px) scale(0.95);
    }
    100% {
      transform: translate(280px, 40px) scale(1);
    }
  }

  /* NW: smooth orbit around top-left area */
  @keyframes dance-nw {
    0% {
      transform: translate(60px, 60px) scale(1.05);
    }
    12.5% {
      transform: translate(30px, 90px) scale(1);
    }
    25% {
      transform: translate(20px, 130px) scale(0.95);
    }
    37.5% {
      transform: translate(40px, 160px) scale(0.92);
    }
    50% {
      transform: translate(80px, 150px) scale(0.95);
    }
    62.5% {
      transform: translate(110px, 120px) scale(1);
    }
    75% {
      transform: translate(100px, 80px) scale(1.05);
    }
    87.5% {
      transform: translate(70px, 50px) scale(1.08);
    }
    100% {
      transform: translate(60px, 60px) scale(1.05);
    }
  }

  /* SW: smooth orbit around bottom-left area */
  @keyframes dance-sw {
    0% {
      transform: translate(50px, 280px) scale(0.95);
    }
    12.5% {
      transform: translate(30px, 250px) scale(1);
    }
    25% {
      transform: translate(40px, 210px) scale(1.05);
    }
    37.5% {
      transform: translate(70px, 190px) scale(1.08);
    }
    50% {
      transform: translate(110px, 200px) scale(1.05);
    }
    62.5% {
      transform: translate(130px, 230px) scale(1);
    }
    75% {
      transform: translate(120px, 270px) scale(0.95);
    }
    87.5% {
      transform: translate(80px, 290px) scale(0.92);
    }
    100% {
      transform: translate(50px, 280px) scale(0.95);
    }
  }

  /* SE: smooth orbit around bottom-right area */
  @keyframes dance-se {
    0% {
      transform: translate(290px, 270px) scale(1.08);
    }
    12.5% {
      transform: translate(260px, 290px) scale(1.05);
    }
    25% {
      transform: translate(220px, 280px) scale(1);
    }
    37.5% {
      transform: translate(200px, 250px) scale(0.95);
    }
    50% {
      transform: translate(210px, 210px) scale(0.92);
    }
    62.5% {
      transform: translate(240px, 190px) scale(0.95);
    }
    75% {
      transform: translate(280px, 200px) scale(1);
    }
    87.5% {
      transform: translate(310px, 230px) scale(1.05);
    }
    100% {
      transform: translate(290px, 270px) scale(1.08);
    }
  }

  /* Mobile Quadrant Grid - hidden by default, shown below 1000px */
  .mobile-quadrant-grid {
    display: none;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .quadrant-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-6) var(--space-4);
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    min-height: 100px;
    overflow: hidden;
  }

  .quadrant-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .quadrant-card:active {
    transform: translateY(0);
  }

  .quadrant-card.NE {
    background-color: var(--quadrant-NE);
    order: 2; /* top-right */
  }
  .quadrant-card.NW {
    background-color: var(--quadrant-NW);
    order: 1; /* top-left */
  }
  .quadrant-card.SW {
    background-color: var(--quadrant-SW);
    order: 3; /* bottom-left */
  }
  .quadrant-card.SE {
    background-color: var(--quadrant-SE);
    order: 4; /* bottom-right */
  }

  /* Ring decorations in inner corners */
  .quadrant-card__rings {
    position: absolute;
    width: 120px;
    height: 120px;
    pointer-events: none;
  }

  .quadrant-card__rings::before,
  .quadrant-card__rings::after,
  .quadrant-card__rings span {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.25);
  }

  /* Ring 1 - smallest */
  .quadrant-card__rings::before {
    width: 40px;
    height: 40px;
  }

  /* Ring 2 - medium */
  .quadrant-card__rings::after {
    width: 70px;
    height: 70px;
  }

  /* Ring 3 - largest */
  .quadrant-card__rings span {
    width: 100px;
    height: 100px;
  }

  /* NE quadrant: rings in bottom-left corner (opposite of position) */
  .quadrant-card.NE .quadrant-card__rings {
    bottom: -60px;
    left: -60px;
  }
  .quadrant-card.NE .quadrant-card__rings::before {
    bottom: 40px;
    left: 40px;
  }
  .quadrant-card.NE .quadrant-card__rings::after {
    bottom: 25px;
    left: 25px;
  }
  .quadrant-card.NE .quadrant-card__rings span {
    bottom: 10px;
    left: 10px;
  }

  /* NW quadrant: rings in bottom-right corner */
  .quadrant-card.NW .quadrant-card__rings {
    bottom: -60px;
    right: -60px;
  }
  .quadrant-card.NW .quadrant-card__rings::before {
    bottom: 40px;
    right: 40px;
  }
  .quadrant-card.NW .quadrant-card__rings::after {
    bottom: 25px;
    right: 25px;
  }
  .quadrant-card.NW .quadrant-card__rings span {
    bottom: 10px;
    right: 10px;
  }

  /* SW quadrant: rings in top-right corner */
  .quadrant-card.SW .quadrant-card__rings {
    top: -60px;
    right: -60px;
  }
  .quadrant-card.SW .quadrant-card__rings::before {
    top: 40px;
    right: 40px;
  }
  .quadrant-card.SW .quadrant-card__rings::after {
    top: 25px;
    right: 25px;
  }
  .quadrant-card.SW .quadrant-card__rings span {
    top: 10px;
    right: 10px;
  }

  /* SE quadrant: rings in top-left corner */
  .quadrant-card.SE .quadrant-card__rings {
    top: -60px;
    left: -60px;
  }
  .quadrant-card.SE .quadrant-card__rings::before {
    top: 40px;
    left: 40px;
  }
  .quadrant-card.SE .quadrant-card__rings::after {
    top: 25px;
    left: 25px;
  }
  .quadrant-card.SE .quadrant-card__rings span {
    top: 10px;
    left: 10px;
  }

  .quadrant-card__name {
    position: relative;
    z-index: 1;
    font-family: var(--font-mono);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: white;
    text-transform: lowercase;
    text-align: center;
    margin-bottom: var(--space-1);
  }

  .quadrant-card__count {
    position: relative;
    z-index: 1;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: rgba(255, 255, 255, 0.8);
    text-transform: lowercase;
  }

  /* Responsive Styles */
  @media (max-width: 1200px) {
    .radar-layout {
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .radar-layout.has-selection {
      gap: var(--space-6);
    }

    .table-wrapper.table-side {
      flex: none;
      max-width: 100%;
      width: 100%;
    }

    .table-wrapper.table-bottom {
      width: 100%;
    }
  }

  @media (max-width: 1000px) {
    /* Show mobile quadrant grid */
    .mobile-quadrant-grid {
      display: grid;
    }

    /* Hide radar and bottom table on mobile when no quadrant selected */
    .radar-layout {
      display: none;
    }

    .radar-layout.has-selection {
      display: flex;
      flex-direction: column;
    }

    .table-wrapper.table-bottom {
      display: none;
    }

    /* When quadrant is selected, show only the table */
    .table-wrapper.table-side {
      width: 100%;
      max-height: none;
    }

    /* Hide radar wrapper on mobile */
    .radar-wrapper {
      display: none;
    }

    .main-content {
      padding: var(--space-4);
    }
  }

  @media (max-width: 480px) {
    .quadrant-card {
      padding: var(--space-4) var(--space-3);
      min-height: 80px;
    }

    .quadrant-card__name {
      font-size: var(--text-sm);
    }
  }
</style>
