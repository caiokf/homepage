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
      <!-- Month labels -->
      <div class="month-labels">
        <span v-for="month in monthLabels" :key="month.index" class="month-label">
          {{ month.name }}
        </span>
      </div>

      <!-- Grid: 12 columns (months) × 5 rows (weeks per month) -->
      <div class="weeks-grid">
        <template v-for="month in 12" :key="month">
          <button
            v-for="weekInMonth in 5"
            :key="`${month}-${weekInMonth}`"
            class="week-cell"
            :class="getCellClasses(month - 1, weekInMonth - 1)"
            :title="getCellTitle(month - 1, weekInMonth - 1)"
            :disabled="!getCellData(month - 1, weekInMonth - 1)?.count"
            @click="handleCellClick(month - 1, weekInMonth - 1)"
          >
            <span class="sr-only">{{ getCellTitle(month - 1, weekInMonth - 1) }}</span>
          </button>
        </template>
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
    year: number;
    month: number;
    weekInMonth: number;
    startDate: Date;
    endDate: Date;
    count: number;
    intensity: number;
    label: string;
    isFuture: boolean;
  };

  type Props = {
    entryCounts: Map<string, number>; // "YYYY-WW" -> count
    selectedWeekKey?: string | null;
  };

  type Emits = {
    (e: "select-week", weekKey: string | null): void;
  };

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const currentYear = new Date().getFullYear();
  const selectedYear = ref(currentYear);

  // Extract available years from entry counts
  const availableYears = computed(() => {
    const years = new Set<number>();
    years.add(currentYear);

    props.entryCounts.forEach((_, key) => {
      const year = parseInt(key.split("-")[0]);
      if (!isNaN(year)) years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a);
  });

  const monthLabels = computed(() => {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    return months.map((name, index) => ({ name, index }));
  });

  // Build a grid map: [month][weekInMonth] -> WeekData
  const weekGrid = computed(() => {
    const grid: (WeekData | null)[][] = Array.from({ length: 12 }, () =>
      Array.from({ length: 5 }, () => null)
    );

    const year = selectedYear.value;
    const today = new Date();

    // Iterate through each month
    for (let month = 0; month < 12; month++) {
      // Find all Mondays in this month
      const firstOfMonth = new Date(year, month, 1);
      const lastOfMonth = new Date(year, month + 1, 0);

      let weekInMonth = 0;
      let current = new Date(firstOfMonth);

      // Find first Monday on or after the 1st
      while (current.getDay() !== 1) {
        current.setDate(current.getDate() + 1);
      }

      // If the first Monday is after the 7th, there's a partial week at start
      if (current.getDate() > 7) {
        // Start from the Monday before
        current.setDate(current.getDate() - 7);
      } else if (current.getDate() > 1) {
        // There's a partial week at the start of the month
        const partialStart = new Date(year, month, 1);
        const partialEnd = new Date(current);
        partialEnd.setDate(partialEnd.getDate() - 1);

        if (partialStart.getMonth() === month) {
          const weekKey = getWeekKeyForDate(partialStart);
          const count = props.entryCounts.get(weekKey) || 0;

          grid[month][weekInMonth] = {
            key: weekKey,
            year,
            month,
            weekInMonth,
            startDate: partialStart,
            endDate: partialEnd,
            count,
            intensity: getIntensity(count),
            label: formatWeekLabel(partialStart, partialEnd),
            isFuture: partialStart > today,
          };
          weekInMonth++;
        }
      }

      // Process full weeks
      while (current <= lastOfMonth && weekInMonth < 5) {
        const weekStart = new Date(current);
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Only include if the week starts in this month
        if (weekStart.getMonth() === month || weekStart < firstOfMonth) {
          const effectiveStart =
            weekStart.getMonth() === month ? weekStart : firstOfMonth;
          const weekKey = getWeekKeyForDate(effectiveStart);
          const count = props.entryCounts.get(weekKey) || 0;

          grid[month][weekInMonth] = {
            key: weekKey,
            year,
            month,
            weekInMonth,
            startDate: effectiveStart,
            endDate: weekEnd > lastOfMonth ? lastOfMonth : weekEnd,
            count,
            intensity: getIntensity(count),
            label: formatWeekLabel(
              effectiveStart,
              weekEnd > lastOfMonth ? lastOfMonth : weekEnd
            ),
            isFuture: effectiveStart > today,
          };
          weekInMonth++;
        }

        current.setDate(current.getDate() + 7);
      }
    }

    return grid;
  });

  function getWeekKeyForDate(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
  }

  function getIntensity(count: number): number {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  }

  function formatWeekLabel(start: Date, end: Date): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  }

  function getCellData(month: number, weekInMonth: number): WeekData | null {
    return weekGrid.value[month]?.[weekInMonth] || null;
  }

  function getCellClasses(month: number, weekInMonth: number): Record<string, boolean> {
    const data = getCellData(month, weekInMonth);
    return {
      [`intensity-${data?.intensity ?? 0}`]: true,
      selected: data?.key === props.selectedWeekKey,
      future: data?.isFuture ?? false,
      empty: !data,
    };
  }

  function getCellTitle(month: number, weekInMonth: number): string {
    const data = getCellData(month, weekInMonth);
    if (!data) return "";
    return `${data.label}: ${data.count} ${data.count === 1 ? "entry" : "entries"}`;
  }

  function handleCellClick(month: number, weekInMonth: number) {
    const data = getCellData(month, weekInMonth);
    if (!data || data.count === 0) return;

    if (data.key === props.selectedWeekKey) {
      emit("select-week", null);
    } else {
      emit("select-week", data.key);
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
    grid-template-columns: repeat(12, 1fr);
    gap: 3px;
  }

  .month-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: lowercase;
    text-align: center;
  }

  .weeks-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-auto-flow: column;
    gap: 3px;
  }

  .week-cell {
    aspect-ratio: 1;
    width: 100%;
    max-width: 20px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    justify-self: center;
  }

  .week-cell:disabled {
    cursor: default;
  }

  .week-cell.empty {
    visibility: hidden;
  }

  .week-cell:not(:disabled):not(.empty):hover {
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
