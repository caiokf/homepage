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

    <div class="matrix-grid">
      <!-- Month labels aligned to columns -->
      <div class="month-labels">
        <span
          v-for="label in monthPositions"
          :key="label.month"
          class="month-label"
          :style="{ gridColumn: label.column }"
        >
          {{ label.name }}
        </span>
      </div>

      <!-- Grid: 13 columns × 4 rows = 52 weeks -->
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

  type Props = {
    entryCounts: Map<string, number>;
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

  // Calculate which column each month starts at
  const monthPositions = computed(() => {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const positions: { month: number; name: string; column: number }[] = [];
    const year = selectedYear.value;

    for (let month = 0; month < 12; month++) {
      const firstOfMonth = new Date(year, month, 1);
      const weekNum = getISOWeekNumber(firstOfMonth);
      const column = Math.ceil(weekNum / 4); // Which column (1-13)

      // Only add if this month starts in a new column
      const existing = positions.find(p => p.column === column);
      if (!existing) {
        positions.push({ month, name: months[month], column });
      }
    }

    return positions;
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

  function getISOWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

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

  .matrix-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .month-labels {
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    gap: 3px;
  }

  .month-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: lowercase;
  }

  .weeks-grid {
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-auto-flow: column;
    gap: 3px;
  }

  .week-cell {
    aspect-ratio: 1;
    width: 100%;
    max-width: 18px;
    border-radius: 3px;
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
    background: var(--color-background-subtle);
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
    background: var(--color-surface);
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

  .matrix-legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
    border-radius: 3px;
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
    .weeks-grid {
      gap: 2px;
    }

    .week-cell {
      max-width: 14px;
      border-radius: 2px;
    }

    .month-label {
      font-size: 10px;
    }

    .legend-cell {
      width: 10px;
      height: 10px;
    }
  }

  @media (--sm) {
    .month-labels {
      display: none;
    }

    .matrix-header {
      justify-content: center;
    }

    .weeks-grid {
      gap: 2px;
    }

    .week-cell {
      max-width: 10px;
      border-radius: 2px;
    }
  }
</style>
