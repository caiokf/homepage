<template>
  <div class="search" :class="{ 'is-open': showResults && resultsEnabled }">
    <SearchInput
      :model-value="query"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :clearable="clearable"
      @update:model-value="handleInput"
      @focus="showResults = true"
      @blur="handleBlur"
      @clear="handleClear"
      @keydown.down.prevent="navigateResults(1)"
      @keydown.up.prevent="navigateResults(-1)"
      @keydown.enter.prevent="selectHighlighted"
      @keydown.escape="closeSearch"
    />

    <template v-if="resultsEnabled">
      <SearchResults
        :results="results"
        :show="showResults && results.length > 0"
        :highlighted-index="highlightedIndex"
        :empty-message="emptyMessage"
        @select="selectResult"
        @highlight="highlightedIndex = $event"
      >
        <template #result="{ result }">
          <slot name="result" :result="result" />
        </template>
      </SearchResults>

      <div
        v-if="showResults && query.length >= minChars && results.length === 0"
        class="search-empty"
      >
        {{ emptyMessage }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
  import { ref } from "vue";
  import SearchInput from "../molecules/SearchInput.vue";
  import SearchResults from "../molecules/SearchResults.vue";

  type Props<T> = {
    results: T[];
    placeholder?: string;
    ariaLabel?: string;
    emptyMessage?: string;
    minChars?: number;
    clearable?: boolean;
    resultsEnabled?: boolean;
  };

  type Emits<T> = {
    (e: "input", query: string): void;
    (e: "select", result: T): void;
    (e: "close"): void;
  };

  const props = withDefaults(defineProps<Props<T>>(), {
    placeholder: "search...",
    ariaLabel: "Search",
    emptyMessage: "No results found",
    minChars: 0,
    clearable: false,
    resultsEnabled: true,
  });

  const emit = defineEmits<Emits<T>>();

  const query = ref("");
  const showResults = ref(false);
  const highlightedIndex = ref(0);

  function handleInput(value: string) {
    query.value = value;
    highlightedIndex.value = 0;
    emit("input", value);
  }

  function handleBlur() {
    // Delay to allow click on result
    setTimeout(() => {
      showResults.value = false;
    }, 200);
  }

  function closeSearch() {
    showResults.value = false;
    query.value = "";
    emit("close");
  }

  function handleClear() {
    query.value = "";
    emit("input", "");
  }

  function navigateResults(direction: number) {
    const newIndex = highlightedIndex.value + direction;
    if (newIndex >= 0 && newIndex < props.results.length) {
      highlightedIndex.value = newIndex;
    }
  }

  function selectHighlighted() {
    if (props.results.length > 0) {
      selectResult(highlightedIndex.value);
    }
  }

  function selectResult(index: number) {
    const result = props.results[index];
    if (result !== undefined) {
      emit("select", result);
      closeSearch();
    }
  }
</script>

<style scoped>
  .search {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  .search-empty {
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
    z-index: 100;
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme),
      color var(--transition-theme);
  }
</style>
