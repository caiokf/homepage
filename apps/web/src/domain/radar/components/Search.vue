<template>
  <Search
    :results="filteredBlips"
    placeholder="search technologies..."
    aria-label="Search technologies"
    empty-message="No technologies found"
    :min-chars="2"
    @input="handleQueryChange"
    @select="emit('select', $event)"
  >
    <template #result="{ result }">
      <div class="radar-search-result">
        <span class="result-name" v-html="highlightName(result.blip.name)"></span>
        <span class="result-meta">
          {{ result.quadrantName }} &middot; {{ result.blip.ring.name }}
        </span>
      </div>
    </template>
  </Search>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import Fuse, { type FuseResultMatch } from "fuse.js";
  import Search from "../../../components/organisms/Search.vue";
  import type { Radar } from "../models/radar";
  import type { Blip } from "../models/blip";
  import type { QuadrantPosition } from "../types";

  type SearchResult = {
    blip: Blip;
    quadrant: QuadrantPosition;
    quadrantName: string;
  };

  type FuseSearchResult = {
    item: SearchResult;
    matches?: readonly FuseResultMatch[];
  };

  const props = defineProps<{
    radar: Radar;
  }>();

  const emit = defineEmits<{
    (e: "select", result: SearchResult): void;
  }>();

  const searchQuery = ref("");

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

  // Fuse.js instance for fuzzy search
  const fuse = computed(() => {
    return new Fuse<SearchResult>(allBlips.value, {
      keys: [
        { name: "blip.name", weight: 2 },
        { name: "quadrantName", weight: 1 },
        { name: "blip.ring.name", weight: 0.5 },
      ],
      threshold: 0.2,
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  });

  // Store match indices for highlighting
  const searchMatches = ref<Map<string, readonly [number, number][]>>(new Map());

  // Filter blips by search query using Fuse.js
  const filteredBlips = computed(() => {
    if (searchQuery.value.length < 2) {
      searchMatches.value = new Map();
      return [];
    }

    const results = fuse.value.search(searchQuery.value) as FuseSearchResult[];

    // Build match indices map
    const newMatches = new Map<string, readonly [number, number][]>();
    results.forEach((r) => {
      const nameMatch = r.matches?.find((m) => m.key === "blip.name");
      if (nameMatch?.indices) {
        newMatches.set(r.item.blip.name, nameMatch.indices);
      }
    });
    searchMatches.value = newMatches;

    return results.map((r) => r.item);
  });

  // Highlight matching text in blip name
  function highlightName(name: string): string {
    const indices = searchMatches.value.get(name);
    if (!indices || indices.length === 0) {
      return escapeHtml(name);
    }

    // Sort indices by start position
    const sorted = [...indices].sort((a, b) => a[0] - b[0]);

    let result = "";
    let lastEnd = 0;

    for (const [start, end] of sorted) {
      if (end - start < 1) continue; // Skip single char matches
      result += escapeHtml(name.slice(lastEnd, start));
      result += `<mark class="search-highlight">${escapeHtml(name.slice(start, end + 1))}</mark>`;
      lastEnd = end + 1;
    }

    result += escapeHtml(name.slice(lastEnd));
    return result;
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function handleQueryChange(query: string) {
    searchQuery.value = query;
  }
</script>

<style scoped>
  .radar-search-result {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .result-name {
    display: block;
    font-weight: var(--font-medium);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-primary);
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

  .search-highlight {
    background: oklch(0.85 0.15 90);
    color: oklch(0.3 0.05 90);
    padding: 0 2px;
    border-radius: 2px;
  }

  [data-theme="dark"] .search-highlight {
    background: oklch(0.45 0.12 90);
    color: oklch(0.95 0.02 90);
  }
</style>
