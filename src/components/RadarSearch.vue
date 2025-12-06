<template>
  <div class="radar-search">
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search technologies..."
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
          fill="#999"
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        />
      </svg>
    </div>

    <ul
      v-if="showResults && filteredBlips.length > 0"
      class="search-results"
    >
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
      v-else-if="showResults && searchQuery.length >= 2 && filteredBlips.length === 0"
      class="no-results"
    >
      No technologies found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Radar } from '../models/radar'
import type { Blip } from '../models/blip'
import type { QuadrantOrder } from '../config/radar-config'

interface SearchResult {
  blip: Blip
  quadrant: QuadrantOrder
  quadrantName: string
}

const props = defineProps<{
  radar: Radar
}>()

const emit = defineEmits<{
  (e: 'select', result: SearchResult): void
}>()

const searchQuery = ref('')
const showResults = ref(false)
const highlightedIndex = ref(0)

// Get all blips from all quadrants
const allBlips = computed<SearchResult[]>(() => {
  const results: SearchResult[] = []

  for (const config of props.radar.quadrants) {
    if (!config.quadrant) continue

    for (const blip of config.quadrant.blips()) {
      results.push({
        blip,
        quadrant: config.order,
        quadrantName: config.quadrant.name,
      })
    }
  }

  return results
})

// Filter blips by search query
const filteredBlips = computed(() => {
  if (searchQuery.value.length < 2) return []

  const query = searchQuery.value.toLowerCase()

  return allBlips.value.filter(
    (result) =>
      result.blip.name.toLowerCase().includes(query) ||
      result.blip.description.toLowerCase().includes(query)
  )
})

function handleInput() {
  showResults.value = true
  highlightedIndex.value = 0
}

function handleBlur() {
  // Delay to allow click on result
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

function closeResults() {
  showResults.value = false
  searchQuery.value = ''
}

function navigateResults(direction: number) {
  const newIndex = highlightedIndex.value + direction
  if (newIndex >= 0 && newIndex < filteredBlips.value.length) {
    highlightedIndex.value = newIndex
  }
}

function selectHighlighted() {
  if (filteredBlips.value.length > 0) {
    selectResult(filteredBlips.value[highlightedIndex.value])
  }
}

function selectResult(result: SearchResult) {
  emit('select', result)
  closeResults()
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
  padding: 12px 16px 12px 44px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 4px 0 0;
  padding: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.search-result {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.search-result:last-child {
  border-bottom: none;
}

.search-result.highlighted {
  background: #f5f5f5;
}

.result-name {
  display: block;
  font-weight: 500;
  margin-bottom: 2px;
}

.result-meta {
  font-size: 12px;
  color: #666;
}

.no-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 4px 0 0;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  z-index: 100;
}
</style>
