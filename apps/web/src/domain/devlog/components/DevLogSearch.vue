<template>
  <div class="devlog-search">
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="search entries..."
        class="search-input"
        @input="handleInput"
      />
      <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        />
      </svg>
      <button v-if="searchQuery" class="clear-button" @click="clearSearch">
        &times;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";

  const emit = defineEmits<{
    (e: "search", query: string): void;
  }>();

  const searchQuery = ref("");

  function handleInput() {
    emit("search", searchQuery.value);
  }

  function clearSearch() {
    searchQuery.value = "";
    emit("search", "");
  }

  watch(searchQuery, (newValue) => {
    emit("search", newValue);
  });
</script>

<style scoped>
  .devlog-search {
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
    transition: border-color var(--transition-fast), background-color var(--transition-theme),
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

  .clear-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: var(--text-lg);
    cursor: pointer;
    padding: 0 var(--space-1);
    line-height: 1;
    transition: color var(--transition-fast);
  }

  .clear-button:hover {
    color: var(--color-text-primary);
  }
</style>
