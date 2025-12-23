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

      <!-- Week cells -->
      <div class="weeks-container">
        <button
          v-for="week in weeksInYear"
          :key="week.key"
          class="week-cell"
          :class="{
            [`intensity-${week.intensity}`]: true,
            selected: isWeekSelected(week),
            future: week.isFuture,
          }"
          :title="`${week.label}: ${week.count} ${week.count === 1 ? 'entry' : 'entries'}`"
          :disabled="week.count === 0 && !isWeekSelected(week)"
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
    year: number;
    weekNumber: number;
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
    years.add(currentYear); // Always include current year

    props.entryCounts.forEach((_, key) => {
      const year = parseInt(key.split("-")[0]);
      if (!isNaN(year)) years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a);
  });

  // Month labels for the selected year
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

  // Generate all weeks for the selected year
  const weeksInYear = computed((): WeekData[] => {
    const weeks: WeekData[] = [];
    const year = selectedYear.value;
    const today = new Date();

    // Start from first Monday of the year (or last Monday of previous year)
    const jan1 = new Date(year, 0, 1);
    const dayOfWeek = jan1.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const firstMonday = new Date(year, 0, 1 + daysToMonday);

    // Generate 52-53 weeks
    for (let weekNum = 1; weekNum <= 53; weekNum++) {
      const startDate = new Date(firstMonday);
      startDate.setDate(firstMonday.getDate() + (weekNum - 1) * 7);

      // Stop if we've gone into next year significantly
      if (startDate.getFullYear() > year && weekNum > 1) break;

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const weekKey = `${year}-${String(weekNum).padStart(2, "0")}`;
      const count = props.entryCounts.get(weekKey) || 0;
      const isFuture = startDate > today;

      weeks.push({
        key: weekKey,
        year,
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

  function selectYear(year: number) {
    selectedYear.value = year;
    emit("select-week", null); // Clear selection when changing year
  }

  function isWeekSelected(week: WeekData): boolean {
    return props.selectedWeekKey === week.key;
  }

  function toggleWeek(week: WeekData) {
    if (isWeekSelected(week)) {
      emit("select-week", null);
    } else if (week.count > 0) {
      emit("select-week", week.key);
    }
  }

  // Ensure selected year includes the selected week
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
    gap: 2px;
    padding-left: 0;
  }

  .month-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: lowercase;
  }

  .weeks-container {
    display: grid;
    grid-template-columns: repeat(53, 1fr);
    gap: 2px;
  }

  .week-cell {
    aspect-ratio: 1;
    min-width: 10px;
    max-width: 16px;
    border-radius: 2px;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .week-cell:disabled {
    cursor: default;
  }

  .week-cell:not(:disabled):hover {
    transform: scale(1.2);
    outline: 2px solid var(--color-text-muted);
    outline-offset: 1px;
  }

  .week-cell.selected {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
    transform: scale(1.1);
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
    width: 10px;
    height: 10px;
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
    .weeks-container {
      gap: 1px;
    }

    .week-cell {
      min-width: 6px;
      max-width: 10px;
    }

    .month-label {
      font-size: 10px;
    }
  }

  @media (--sm) {
    .month-labels {
      display: none;
    }

    .matrix-header {
      justify-content: center;
    }
  }
</style>
