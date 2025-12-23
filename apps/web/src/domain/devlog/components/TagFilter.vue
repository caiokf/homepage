<template>
  <div class="tag-filter-bar">
    <button
      v-for="tag in tags"
      :key="tag.name"
      class="tag-filter"
      :class="{ active: activeTags.has(tag.name) }"
      @click="toggleTag(tag.name)"
    >
      {{ tag.name }} <span class="tag-count">[{{ tag.count }}]</span>
    </button>
    <button v-if="showClear" class="clear-filters" @click="clearAll">
      clear
    </button>
  </div>
</template>

<script setup lang="ts">
  type TagCount = {
    name: string;
    count: number;
  };

  type Props = {
    tags: TagCount[];
    activeTags: Set<string>;
    showClear?: boolean;
  };

  type Emits = {
    (e: "toggle", tag: string): void;
    (e: "clear"): void;
  };

  defineProps<Props>();
  const emit = defineEmits<Emits>();

  function toggleTag(tag: string) {
    emit("toggle", tag);
  }

  function clearAll() {
    emit("clear");
  }
</script>

<style scoped>
  .tag-filter-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2);
  }

  .tag-filter {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-transform: lowercase;
  }

  .tag-filter:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-hover);
  }

  .tag-filter.active {
    color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .tag-count {
    opacity: 0.6;
    margin-left: 2px;
  }

  .clear-filters {
    padding: 2px 8px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    background: transparent;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-transform: lowercase;
  }

  .clear-filters:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    border-style: solid;
  }
</style>
