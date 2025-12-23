<template>
  <div class="devlog-header">
    <div class="header-content">
      <ContributionMatrix
        :entry-counts="entryCounts"
        :selected-week-key="selectedWeekKey"
        @select-week="$emit('select-week', $event)"
        @select-year="selectedYear = $event"
      />
      <TagRadar :tags="filteredTagCounts" />
    </div>

    <TagFilter
      :tags="tagCounts"
      :active-tags="activeTags"
      :show-clear="activeTags.size > 0 || selectedWeekKey !== null"
      @toggle="$emit('toggle-tag', $event)"
      @clear="$emit('clear-filters')"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import ContributionMatrix from "./ContributionMatrix.vue";
  import TagRadar from "./TagRadar.vue";
  import TagFilter from "./TagFilter.vue";

  type TagCount = {
    name: string;
    count: number;
  };

  type Props = {
    entryCounts: Map<string, number>;
    tagCounts: TagCount[];
    tagCountsByYear: Map<number, TagCount[]>;
    activeTags: Set<string>;
    selectedWeekKey: string | null;
  };

  const props = defineProps<Props>();

  defineEmits<{
    (e: "select-week", weekKey: string | null): void;
    (e: "toggle-tag", tag: string): void;
    (e: "clear-filters"): void;
  }>();

  const selectedYear = ref(new Date().getFullYear());

  const filteredTagCounts = computed(() => {
    return props.tagCountsByYear.get(selectedYear.value) || [];
  });
</script>

<style scoped>
  .devlog-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  @media (--md) {
    .header-content {
      flex-direction: column;
      gap: var(--space-4);
    }
  }
</style>
