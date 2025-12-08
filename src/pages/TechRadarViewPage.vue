<template>
  <div class="tech-radar-view">
    <!-- Quadrant navigation tabs (hidden on mobile) -->
    <RadarHeader
      v-if="radar"
      :radar="radar"
      :selected-quadrant="selectedQuadrant"
      class="desktop-nav"
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

      <!-- Mobile back button (when quadrant selected) -->
      <button
        v-if="selectedQuadrant"
        class="mobile-back-btn bracket-link"
        @click="handleQuadrantSelected(null)"
      >
        all quadrants
      </button>

      <!-- Main radar and table container (hidden on mobile unless quadrant selected) -->
      <main class="radar-layout" :class="layoutClasses">
        <!-- Table on LEFT (for NE/NW quadrants - radar moves right) -->
        <div
          v-if="selectedQuadrant && selectedQuadrantObj && isRadarOnRight"
          class="table-wrapper table-side table-left"
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
          <RadarLegend />
        </div>

        <!-- Table on RIGHT (for SW/SE quadrants - radar moves left) -->
        <div
          v-if="selectedQuadrant && selectedQuadrantObj && !isRadarOnRight"
          class="table-wrapper table-side table-right"
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

      <!-- Blip list below radar when all quadrants visible -->
      <div v-if="!selectedQuadrant" class="table-wrapper table-bottom">
        <BlipList
          :quadrants="allQuadrantsWithBlips"
          :highlighted-blip-id="hoveredBlipId"
          @blip-hover="handleTableBlipHover"
          @blip-click="handleBlipSelected"
        />
      </div>
    </div>

    <div v-else class="loading">
      <div class="spinner"></div>
      <p>Loading radar data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, ref, computed, onMounted } from "vue";
  import TechRadar from "../components/radar/TechRadar.vue";
  import BlipList from "../components/radar/BlipList.vue";
  import BlipListByQuadrant from "../components/radar/BlipListByQuadrant.vue";
  import RadarLegend from "../components/radar/RadarLegend.vue";
  import Search from "../components/radar/Search.vue";
  import RadarHeader from "../components/radar/RadarHeader.vue";
  import { Radar } from "../models/radar";
  import { SampleDataProvider } from "../data/providers/sample-data-provider";
  import type { TechRadarDataProvider } from "../data/tech-radar-data-provider";
  import type {
    PositionedBlip,
    QuadrantGeometryConfig,
  } from "../models/quadrant.geometry";
  import { type QuadrantPosition, graphConfig } from "../config/radar-config";
  import { RingGeometry } from "../models/ring.geometry";
  import { QuadrantGeometry } from "../models/quadrant.geometry";

  type SearchResult = {
    blip: { name: string };
    quadrant: QuadrantPosition;
    quadrantName: string;
  };

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

    return QuadrantGeometry.calculateBlipPositions(
      selectedQuadrantObj.value.blips(),
      geometry
    );
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
        blips: QuadrantGeometry.calculateBlipPositions(
          quadrant.blips(),
          geometry
        ),
      };
    });
  });

  // Determine if radar should move to the right (NE/NW quadrants selected)
  // NE/NW quadrants are on LEFT side of radar, so radar moves RIGHT, table on LEFT
  // SW/SE quadrants are on RIGHT side of radar, so radar moves LEFT, table on RIGHT
  const isRadarOnRight = computed(() => {
    return selectedQuadrant.value === "NE" || selectedQuadrant.value === "NW";
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
        width: "1056px",
      };
    }

    // Shrink when zoomed to single quadrant
    return {
      width: "620px",
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

  /* Radar Layout */
  .radar-layout {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 1056px;
    margin: 0 auto;
  }

  .radar-layout.has-selection {
    gap: 36px;
  }

  .radar-wrapper {
    transition: width 1s ease;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* Table Wrapper - shared styles */
  .table-wrapper {
    box-sizing: border-box;
  }

  /* Side table (when single quadrant selected) */
  .table-wrapper.table-side {
    width: 400px;
    flex-shrink: 0;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
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

  /* Bottom table (when all quadrants visible) */
  .table-wrapper.table-bottom {
    width: 1056px;
    margin: var(--space-8) auto 0;
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

  .quadrant-card.NE { background-color: var(--color-teal); }
  .quadrant-card.NW { background-color: var(--color-orange); }
  .quadrant-card.SW { background-color: var(--color-green); }
  .quadrant-card.SE { background-color: var(--color-red); }

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

  /* NE quadrant: rings in bottom-right corner */
  .quadrant-card.NE .quadrant-card__rings {
    bottom: -60px;
    right: -60px;
  }
  .quadrant-card.NE .quadrant-card__rings::before {
    bottom: 40px;
    right: 40px;
  }
  .quadrant-card.NE .quadrant-card__rings::after {
    bottom: 25px;
    right: 25px;
  }
  .quadrant-card.NE .quadrant-card__rings span {
    bottom: 10px;
    right: 10px;
  }

  /* NW quadrant: rings in bottom-left corner */
  .quadrant-card.NW .quadrant-card__rings {
    bottom: -60px;
    left: -60px;
  }
  .quadrant-card.NW .quadrant-card__rings::before {
    bottom: 40px;
    left: 40px;
  }
  .quadrant-card.NW .quadrant-card__rings::after {
    bottom: 25px;
    left: 25px;
  }
  .quadrant-card.NW .quadrant-card__rings span {
    bottom: 10px;
    left: 10px;
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

  /* Mobile back button */
  .mobile-back-btn {
    display: none;
    margin-bottom: var(--space-4);
    background: none;
    border: none;
    cursor: pointer;
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
    /* Hide desktop nav, show mobile grid */
    .desktop-nav {
      display: none;
    }

    .mobile-quadrant-grid {
      display: grid;
    }

    .mobile-back-btn {
      display: inline-block;
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
      animation: none;
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
