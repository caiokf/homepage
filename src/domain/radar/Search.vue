<template>
  <div class="radar-search">
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="search technologies..."
        class="search-input"
        @input="handleInput"
        @focus="showResults = true"
        @blur="handleBlur"
        @keydown.down.prevent="navigateResults(1)"
        @keydown.up.prevent="navigateResults(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="closeResults"
      />
      <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        />
      </svg>
    </div>

    <ul v-if="showResults && filteredBlips.length > 0" class="search-results">
      <li
        v-for="(result, index) in filteredBlips"
        :key="`${result.quadrant}-${result.blip.name}`"
        :class="['search-result', { highlighted: index === highlightedIndex }]"
        @mousedown.prevent="selectResult(result)"
        @mouseenter="highlightedIndex = index"
      >
        <span class="result-name">{{ result.blip.name }}</span>
        <span class="result-meta">
          {{ result.quadrantName }} &middot; {{ result.blip.ring.name }}
        </span>
      </li>
    </ul>

    <div
      v-else-if="
        showResults && searchQuery.length >= 2 && filteredBlips.length === 0
      "
      class="no-results"
    >
      No technologies found
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import type { Radar } from "../../models/radar";
  import type { Blip } from "../../models/blip";
  import type { QuadrantPosition } from "../../config/radar-config";

  type SearchResult = {
    blip: Blip;
    quadrant: QuadrantPosition;
    quadrantName: string;
  };

  const props = defineProps<{
    radar: Radar;
  }>();

  const emit = defineEmits<{
    (e: "select", result: SearchResult): void;
  }>();

  const searchQuery = ref("");
  const showResults = ref(false);
  const highlightedIndex = ref(0);

  // Get all blips from all quadrants
  const allBlips = computed<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    for (const quadrant of props.radar.quadrants) {
      for (const blip of quadrant.blips()) {
        results.push({
          blip,
          quadrant: quadrant.position,
          quadrantName: quadrant.name,
        });
      }
    }

    return results;
  });

  // Filter blips by search query
  const filteredBlips = computed(() => {
    if (searchQuery.value.length < 2) return [];

    const query = searchQuery.value.toLowerCase();

    return allBlips.value.filter(
      (result) =>
        result.blip.name.toLowerCase().includes(query) ||
        result.blip.description.toLowerCase().includes(query)
    );
  });

  function handleInput() {
    showResults.value = true;
    highlightedIndex.value = 0;
  }

  function handleBlur() {
    // Delay to allow click on result
    setTimeout(() => {
      showResults.value = false;
    }, 200);
  }

  function closeResults() {
    showResults.value = false;
    searchQuery.value = "";
  }

  function navigateResults(direction: number) {
    const newIndex = highlightedIndex.value + direction;
    if (newIndex >= 0 && newIndex < filteredBlips.value.length) {
      highlightedIndex.value = newIndex;
    }
  }

  function selectHighlighted() {
    if (filteredBlips.value.length > 0) {
      selectResult(filteredBlips.value[highlightedIndex.value]);
    }
  }

  function selectResult(result: SearchResult) {
    emit("select", result);
    closeResults();
  }
</script>

<style scoped>
  .radar-search {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  .search-input-container {
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: var(--space-3) var(--space-4) var(--space-3) 44px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    background: transparent;
    color: var(--color-text-primary);
    outline: none;
    transition:
      border-color var(--transition-fast),
      background-color var(--transition-theme),
      color var(--transition-theme);
  }

  .search-input:focus {
    border-color: var(--color-primary);
    background: var(--color-surface);
  }

  .search-input::placeholder {
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    text-transform: lowercase;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text-muted);
    transition: color var(--transition-theme);
    width: 16px;
    height: 16px;
  }

  .search-input:focus + .search-icon {
    color: var(--color-primary);
  }

  .search-icon path {
    fill: currentColor;
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: var(--space-2) 0 0;
    padding: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    list-style: none;
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme);
  }

  .search-result {
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-subtle);
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-theme);
  }

  .search-result:last-child {
    border-bottom: none;
  }

  .search-result.highlighted {
    background: var(--color-surface-hover);
  }

  .search-result.highlighted .result-name {
    color: var(--color-primary);
  }

  .result-name {
    display: block;
    font-weight: var(--font-medium);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-primary);
    margin-bottom: 2px;
    text-transform: lowercase;
    transition: color var(--transition-theme);
  }

  .result-meta {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    text-transform: lowercase;
    transition: color var(--transition-theme);
  }

  .no-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: var(--space-2) 0 0;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    text-transform: lowercase;
    z-index: 100;
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme),
      color var(--transition-theme);
  }
</style>
