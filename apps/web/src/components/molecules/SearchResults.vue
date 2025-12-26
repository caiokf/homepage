<<<<<<< ours
<template>
  <div v-if="show" class="search-results-container">
    <ul v-if="results.length > 0" class="search-results" role="listbox">
      <li
        v-for="(result, index) in results"
        :key="getResultKey(result)"
        :class="['search-result', { highlighted: index === highlightedIndex }]"
        role="option"
        :aria-selected="index === highlightedIndex"
        @mousedown.prevent="emit('select', index)"
        @mouseenter="emit('highlight', index)"
      >
        <slot name="result" :result="result" :index="index">
          <span class="search-result__text">{{ result }}</span>
        </slot>
      </li>
    </ul>
    <div v-else-if="emptyMessage" class="search-results-empty">
      {{ emptyMessage }}
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
  type Props<T> = {
    results: T[];
    show: boolean;
    highlightedIndex?: number;
    emptyMessage?: string;
  };

  const emit = defineEmits<{
    (e: "select", index: number): void;
    (e: "highlight", index: number): void;
  }>();

  withDefaults(defineProps<Props<T>>(), {
    highlightedIndex: -1,
    emptyMessage: "No results found",
  });

  function getResultKey(result: unknown, index?: number): string {
    if (typeof result === "string") return result;
    if (typeof result === "number") return String(result);
    if (result && typeof result === "object" && "id" in result) {
      return String((result as { id: unknown }).id);
    }
    return index !== undefined ? `result-${index}` : Math.random().toString();
  }
</script>

<style scoped>
  .search-results-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--space-2);
    z-index: 100;
  }

  .search-results {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    max-height: 300px;
    overflow-y: auto;
    transition: background-color var(--transition-theme), border-color var(--transition-theme);
  }

  .search-result {
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-subtle);
    transition: background-color var(--transition-fast), border-color var(--transition-theme);
  }

  .search-result:last-child {
    border-bottom: none;
  }

  .search-result.highlighted {
    background: var(--color-surface-hover);
  }

  .search-result__text {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-primary);
    text-transform: lowercase;
    transition: color var(--transition-theme);
  }

  .search-result.highlighted .search-result__text {
    color: var(--color-primary);
  }

  .search-results-empty {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    text-transform: lowercase;
    transition: background-color var(--transition-theme), border-color var(--transition-theme),
      color var(--transition-theme);
  }
</style>
|||||||
=======
<template>
  <div v-if="show" class="search-results-container">
    <ul v-if="results.length > 0" class="search-results" role="listbox">
      <li
        v-for="(result, index) in results"
        :key="getResultKey(result)"
        :class="['search-result', { highlighted: index === highlightedIndex }]"
        role="option"
        :aria-selected="index === highlightedIndex"
        @mousedown.prevent="emit('select', index)"
        @mouseenter="emit('highlight', index)"
      >
        <slot name="result" :result="result" :index="index">
          <span class="search-result__text">{{ result }}</span>
        </slot>
      </li>
    </ul>
    <div v-else-if="emptyMessage" class="search-results-empty">
      {{ emptyMessage }}
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
  type Props<T> = {
    results: T[];
    show: boolean;
    highlightedIndex?: number;
    emptyMessage?: string;
  };

  const emit = defineEmits<{
    (e: "select", index: number): void;
    (e: "highlight", index: number): void;
  }>();

  withDefaults(defineProps<Props<T>>(), {
    highlightedIndex: -1,
    emptyMessage: "No results found",
  });

  function getResultKey(result: unknown, index?: number): string {
    if (typeof result === "string") return result;
    if (typeof result === "number") return String(result);
    if (result && typeof result === "object" && "id" in result) {
      return String((result as { id: unknown }).id);
    }
    return index !== undefined ? `result-${index}` : Math.random().toString();
  }
</script>

<style scoped>
  .search-results-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--space-2);
    z-index: 100;
  }

  .search-results {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    max-height: 300px;
    overflow-y: auto;
    transition: background-color var(--transition-theme), border-color var(--transition-theme);
  }

  .search-result {
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-subtle);
    transition: background-color var(--transition-fast), border-color var(--transition-theme);
  }

  .search-result:last-child {
    border-bottom: none;
  }

  .search-result.highlighted {
    background: var(--color-surface-hover);
  }

  .search-result__text {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-primary);
    text-transform: lowercase;
    transition: color var(--transition-theme);
  }

  .search-result.highlighted .search-result__text {
    color: var(--color-primary);
  }

  .search-results-empty {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    text-transform: lowercase;
    transition: background-color var(--transition-theme), border-color var(--transition-theme),
      color var(--transition-theme);
  }
</style>
>>>>>>> theirs
