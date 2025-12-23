<template>
  <div class="contribution-matrix">
    <div class="matrix-header">
      <button
        v-for="year in availableYears"
        :key="year"
        class="year-tab"
        :class="{ active: selectedYear === year }"
        @click="selectYear(year)"
      >
        {{ year }}
      </button>
    </div>

    <div class="matrix-content">
      <!-- Weeks grid: 13 columns × 4 rows = 52 weeks -->
      <div class="weeks-grid">
        <button
          v-for="(week, index) in weeksInYear"
          :key="week.key"
          class="week-cell"
          :class="{
            [`intensity-${week.intensity}`]: true,
            selected: week.key === selectedWeekKey,
            future: week.isFuture,
          }"
          :style="{ '--cell-index': index }"
          :title="`${week.label}: ${week.count} ${week.count === 1 ? 'entry' : 'entries'}`"
          :disabled="week.count === 0 && week.key !== selectedWeekKey"
          @click="toggleWeek(week)"
        >
          <span class="sr-only">{{ week.label }}: {{ week.count }} entries</span>
        </button>
      </div>

      <!-- Tag radar chart -->
      <div class="tag-radar">
        <svg :viewBox="`0 0 ${radarSize} ${radarSize}`" class="radar-svg">
          <!-- Background rings -->
          <circle
            v-for="ring in 4"
            :key="ring"
            :cx="radarCenter"
            :cy="radarCenter"
            :r="(radarRadius / 4) * ring"
            class="radar-ring"
          />

          <!-- Axis lines -->
          <line
            v-for="(tag, index) in topTags"
            :key="`axis-${tag.name}`"
            :x1="radarCenter"
            :y1="radarCenter"
            :x2="getAxisPoint(index, topTags.length).x"
            :y2="getAxisPoint(index, topTags.length).y"
            class="radar-axis"
          />

          <!-- Data polygon -->
          <polygon
            v-if="topTags.length > 0"
            :points="radarPolygonPoints"
            class="radar-polygon"
          />

          <!-- Data points -->
          <circle
            v-for="(tag, index) in topTags"
            :key="`point-${tag.name}`"
            :cx="getDataPoint(tag, index, topTags.length).x"
            :cy="getDataPoint(tag, index, topTags.length).y"
            r="4"
            class="radar-point"
          />

          <!-- Labels -->
          <text
            v-for="(tag, index) in topTags"
            :key="`label-${tag.name}`"
            :x="getLabelPoint(index, topTags.length).x"
            :y="getLabelPoint(index, topTags.length).y"
            class="radar-label"
            :text-anchor="getLabelAnchor(index, topTags.length)"
          >
            {{ tag.name }}
          </text>
        </svg>
      </div>
    </div>

    <div class="matrix-legend">
      <span class="legend-label">less</span>
      <span class="legend-cell intensity-0"></span>
      <span class="legend-cell intensity-1"></span>
      <span class="legend-cell intensity-2"></span>
      <span class="legend-cell intensity-3"></span>
      <span class="legend-cell intensity-4"></span>
      <span class="legend-label">more</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";

  type WeekData = {
    key: string;
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    count: number;
    intensity: number;
    label: string;
    isFuture: boolean;
  };

  type TagCount = {
    name: string;
    count: number;
  };

  type Props = {
    entryCounts: Map<string, number>;
    tagCounts: TagCount[];
    selectedWeekKey?: string | null;
  };

  type Emits = {
    (e: "select-week", weekKey: string | null): void;
  };

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const currentYear = new Date().getFullYear();
  const selectedYear = ref(currentYear);

  const availableYears = computed(() => {
    const years = new Set<number>();
    years.add(currentYear);

    props.entryCounts.forEach((_, key) => {
      const year = parseInt(key.split("-")[0]);
      if (!isNaN(year)) years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a);
  });

  // Top 5 tags for radar chart
  const topTags = computed(() => {
    return props.tagCounts.slice(0, 5);
  });

  // Radar chart configuration
  const radarSize = 140;
  const radarCenter = radarSize / 2;
  const radarRadius = 50;
  const labelOffset = 18;

  const maxTagCount = computed(() => {
    if (topTags.value.length === 0) return 1;
    return Math.max(...topTags.value.map(t => t.count));
  });

  function getAxisPoint(index: number, total: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    return {
      x: radarCenter + radarRadius * Math.cos(angle),
      y: radarCenter + radarRadius * Math.sin(angle),
    };
  }

  function getDataPoint(tag: TagCount, index: number, total: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const ratio = tag.count / maxTagCount.value;
    const r = radarRadius * ratio;
    return {
      x: radarCenter + r * Math.cos(angle),
      y: radarCenter + r * Math.sin(angle),
    };
  }

  function getLabelPoint(index: number, total: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = radarRadius + labelOffset;
    return {
      x: radarCenter + r * Math.cos(angle),
      y: radarCenter + r * Math.sin(angle),
    };
  }

  function getLabelAnchor(index: number, total: number): string {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = Math.cos(angle);
    if (x < -0.1) return "end";
    if (x > 0.1) return "start";
    return "middle";
  }

  const radarPolygonPoints = computed(() => {
    return topTags.value
      .map((tag, index) => {
        const point = getDataPoint(tag, index, topTags.value.length);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  });

  // Generate 52 weeks for the year (13 columns × 4 rows)
  const weeksInYear = computed((): WeekData[] => {
    const weeks: WeekData[] = [];
    const year = selectedYear.value;
    const today = new Date();

    // Find the first Monday of week 1
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() || 7;
    const firstMonday = new Date(jan4);
    firstMonday.setDate(jan4.getDate() - dayOfWeek + 1);

    for (let weekNum = 1; weekNum <= 52; weekNum++) {
      const startDate = new Date(firstMonday);
      startDate.setDate(firstMonday.getDate() + (weekNum - 1) * 7);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const weekKey = `${year}-${String(weekNum).padStart(2, "0")}`;
      const count = props.entryCounts.get(weekKey) || 0;
      const isFuture = startDate > today;

      weeks.push({
        key: weekKey,
        weekNumber: weekNum,
        startDate,
        endDate,
        count,
        intensity: getIntensity(count),
        label: formatWeekLabel(startDate, endDate),
        isFuture,
      });
    }

    return weeks;
  });

  function getIntensity(count: number): number {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  }

  function formatWeekLabel(start: Date, end: Date): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  }

  function toggleWeek(week: WeekData) {
    if (week.key === props.selectedWeekKey) {
      emit("select-week", null);
    } else if (week.count > 0) {
      emit("select-week", week.key);
    }
  }

  function selectYear(year: number) {
    selectedYear.value = year;
    emit("select-week", null);
  }

  watch(
    () => props.selectedWeekKey,
    (newKey) => {
      if (newKey) {
        const year = parseInt(newKey.split("-")[0]);
        if (!isNaN(year) && year !== selectedYear.value) {
          selectedYear.value = year;
        }
      }
    }
  );
</script>

<style scoped>
  .contribution-matrix {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .matrix-header {
    display: flex;
    gap: var(--space-2);
    justify-content: flex-end;
  }

  .year-tab {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .year-tab:hover {
    color: var(--color-text-secondary);
    background: var(--color-surface-hover);
  }

  .year-tab.active {
    color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .matrix-content {
    display: flex;
    align-items: center;
    gap: var(--space-6);
  }

  .weeks-grid {
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-auto-flow: column;
    gap: 2px;
    flex: 1;
  }

  .week-cell {
    aspect-ratio: 1;
    width: 100%;
    max-width: 16px;
    border-radius: 2px;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    justify-self: center;
  }

  .week-cell:disabled {
    cursor: default;
  }

  .week-cell:not(:disabled):hover {
    transform: scale(1.3);
    outline: 2px solid var(--color-text-muted);
    outline-offset: 1px;
    z-index: 1;
  }

  .week-cell.selected {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
    transform: scale(1.2);
    z-index: 1;
  }

  .week-cell.future {
    opacity: 0.3;
  }

  /* Intensity levels - GitHub-style green gradient */
  .week-cell.intensity-0,
  .legend-cell.intensity-0 {
    background: var(--color-border);
  }

  .week-cell.intensity-1,
  .legend-cell.intensity-1 {
    background: oklch(0.75 0.12 145);
  }

  .week-cell.intensity-2,
  .legend-cell.intensity-2 {
    background: oklch(0.6 0.14 145);
  }

  .week-cell.intensity-3,
  .legend-cell.intensity-3 {
    background: oklch(0.5 0.14 145);
  }

  .week-cell.intensity-4,
  .legend-cell.intensity-4 {
    background: oklch(0.4 0.12 145);
  }

  /* Dark theme adjustments */
  [data-theme="dark"] .week-cell.intensity-0,
  [data-theme="dark"] .legend-cell.intensity-0 {
    background: var(--color-border);
  }

  [data-theme="dark"] .week-cell.intensity-1,
  [data-theme="dark"] .legend-cell.intensity-1 {
    background: oklch(0.35 0.08 145);
  }

  [data-theme="dark"] .week-cell.intensity-2,
  [data-theme="dark"] .legend-cell.intensity-2 {
    background: oklch(0.45 0.1 145);
  }

  [data-theme="dark"] .week-cell.intensity-3,
  [data-theme="dark"] .legend-cell.intensity-3 {
    background: oklch(0.55 0.12 145);
  }

  [data-theme="dark"] .week-cell.intensity-4,
  [data-theme="dark"] .legend-cell.intensity-4 {
    background: oklch(0.65 0.14 145);
  }

  /* Tag Radar Chart */
  .tag-radar {
    width: 140px;
    height: 140px;
    flex-shrink: 0;
  }

  .radar-svg {
    width: 100%;
    height: 100%;
  }

  .radar-ring {
    fill: none;
    stroke: var(--color-border);
    stroke-width: 1;
  }

  .radar-axis {
    stroke: var(--color-border);
    stroke-width: 1;
  }

  .radar-polygon {
    fill: oklch(0.55 0.12 145 / 0.3);
    stroke: oklch(0.55 0.12 145);
    stroke-width: 2;
  }

  [data-theme="dark"] .radar-polygon {
    fill: oklch(0.55 0.12 145 / 0.2);
    stroke: oklch(0.65 0.14 145);
  }

  .radar-point {
    fill: oklch(0.5 0.14 145);
  }

  [data-theme="dark"] .radar-point {
    fill: oklch(0.65 0.14 145);
  }

  .radar-label {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: var(--color-text-muted);
    dominant-baseline: middle;
  }

  .matrix-legend {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
  }

  .legend-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .legend-cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (--md) {
    .matrix-content {
      flex-direction: column;
      gap: var(--space-4);
    }

    .weeks-grid {
      gap: 2px;
    }

    .week-cell {
      max-width: 14px;
    }

    .tag-radar {
      width: 120px;
      height: 120px;
    }

    .legend-cell {
      width: 10px;
      height: 10px;
    }
  }

  @media (--sm) {
    .matrix-header {
      justify-content: center;
    }

    .weeks-grid {
      gap: 2px;
    }

    .week-cell {
      max-width: 10px;
    }

    .tag-radar {
      width: 100px;
      height: 100px;
    }

    .radar-label {
      font-size: 8px;
    }
  }
</style>
