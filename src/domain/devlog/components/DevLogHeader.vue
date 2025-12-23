<template>
  <div class="devlog-header">
    <div class="header-content">
      <ContributionMatrix
        :entry-counts="entryCounts"
        :selected-week-key="selectedWeekKey"
        @select-week="$emit('select-week', $event)"
      />
      <TagRadar :tags="tagCounts" />
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
    activeTags: Set<string>;
    selectedWeekKey: string | null;
  };

  defineProps<Props>();

  defineEmits<{
    (e: "select-week", weekKey: string | null): void;
    (e: "toggle-tag", tag: string): void;
    (e: "clear-filters"): void;
  }>();
</script>

<style scoped>
  .devlog-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: var(--space-6);
  }

  @media (--md) {
    .header-content {
      flex-direction: column;
      gap: var(--space-4);
    }
  }

  @media (--sm) {
    .devlog-header {
      padding: var(--space-3);
    }
  }
</style>
