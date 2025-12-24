<template>
  <div class="devlog-page">
    <h1 class="page-title">dev log</h1>

    <template v-if="isLoading">
      <div class="loading-state">
        <p>loading entries...</p>
      </div>
    </template>

    <template v-else>
      <DevLogHeader
        :entry-counts="entryCounts"
        :tag-counts="allTags"
        :tag-counts-by-year="tagCountsByYear"
        :active-tags="activeTags"
        :selected-week-key="selectedWeekKey"
        @select-week="handleWeekSelect"
        @toggle-tag="toggleTag"
        @clear-filters="clearFilters"
      />

      <div class="search-container">
        <DevLogSearch @search="handleSearch" />
      </div>

      <!-- Entries list (flat, no week grouping) -->
      <div class="entries-container">
        <div v-if="filteredEntries.length === 0" class="no-entries">
          <p>no entries yet. check back soon!</p>
        </div>

        <div class="entries-list">
          <div
            v-for="(entry, index) in filteredEntries"
            :key="entry.slug"
            class="entry-card"
            :class="{ expanded: expandedSlug === entry.slug }"
            :style="{ '--entry-delay': `${index * 50}ms` }"
          >
            <button class="entry-header" @click="toggleEntry(entry.slug)">
              <span class="entry-date">{{ formatDate(entry.date) }}</span>
              <h3 class="entry-title">
                <span class="expand-icon" :class="{ rotated: expandedSlug === entry.slug }">›</span>
                <span v-html="highlightTitle(entry.title, entry.slug)"></span>
              </h3>
              <BadgeGroup :items="entry.tags" gap="xs" class="entry-tags" />
            </button>

            <div class="entry-content-wrapper">
              <div v-if="expandedSlug === entry.slug" class="entry-content">
                <div v-if="loadingContent === entry.slug" class="content-loading">
                  loading...
                </div>
                <div v-else v-html="highlightContent(entryContent[entry.slug] || '', entry.slug)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, onMounted } from "vue";
  import Fuse from "fuse.js";
  import {
    fetchIndex,
    fetchEntryContent,
    getEntryCounts,
    type EntryMetadata,
  } from "../domain/devlog/data";
  import DevLogHeader from "../domain/devlog/components/DevLogHeader.vue";
  import DevLogSearch from "../domain/devlog/components/DevLogSearch.vue";
  import BadgeGroup from "../components/molecules/BadgeGroup.vue";

  const entries = ref<EntryMetadata[]>([]);
  const isLoading = ref(true);
  const loadingContent = ref<string | null>(null);
  const entryContent = reactive<Record<string, string>>({});

  // Initialize Fuse.js lazily
  let fuse: Fuse<EntryMetadata> | null = null;

  onMounted(async () => {
    try {
      entries.value = await fetchIndex();
      fuse = new Fuse<EntryMetadata>(entries.value, {
        keys: [
          { name: "title", weight: 2 },
          { name: "tags", weight: 1.5 },
        ],
        threshold: 0.2,
        ignoreLocation: true,
        includeScore: true,
        includeMatches: true,
        useExtendedSearch: false,
        minMatchCharLength: 2,
      });
    } finally {
      isLoading.value = false;
    }
  });

  const entryCounts = computed(() => getEntryCounts(entries.value));

  type MatchInfo = {
    titleIndices: readonly [number, number][];
  };

  // Store search match indices
  const searchMatches = ref<Map<string, MatchInfo>>(new Map());

  // Selection state
  const selectedWeekKey = ref<string | null>(null);
  const expandedSlug = ref<string | null>(null);
  const searchQuery = ref("");

  // Tag filtering
  type TagInfo = { name: string; count: number };
  const activeTags = reactive(new Set<string>());

  const allTags = computed<TagInfo[]>(() => {
    const tagCounts = new Map<string, number>();
    entries.value.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  });

  const tagCountsByYear = computed<Map<number, TagInfo[]>>(() => {
    const yearTagCounts = new Map<number, Map<string, number>>();

    entries.value.forEach((entry) => {
      const year = new Date(entry.date).getFullYear();
      if (!yearTagCounts.has(year)) {
        yearTagCounts.set(year, new Map());
      }
      const tagMap = yearTagCounts.get(year)!;
      entry.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const result = new Map<number, TagInfo[]>();
    yearTagCounts.forEach((tagMap, year) => {
      const tags = Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      result.set(year, tags);
    });

    return result;
  });

  // Filter entries by tags, selected week, and search query
  const filteredEntries = computed(() => {
    let result: EntryMetadata[];

    // Filter by search query using Fuse.js
    if (searchQuery.value.length >= 2 && fuse) {
      const searchResults = fuse.search(searchQuery.value);

      // Build match indices map
      const newMatches = new Map<string, MatchInfo>();
      searchResults.forEach((r) => {
        const titleMatch = r.matches?.find((m) => m.key === "title");
        newMatches.set(r.item.slug, {
          titleIndices: titleMatch?.indices || [],
        });
      });
      searchMatches.value = newMatches;

      result = searchResults.map((r) => r.item);
    } else {
      searchMatches.value = new Map();
      result = entries.value;
    }

    // Filter by selected week
    if (selectedWeekKey.value) {
      result = result.filter((entry) => entry.weekKey === selectedWeekKey.value);
    }

    // Filter by tags
    if (activeTags.size > 0) {
      result = result.filter((entry) => entry.tags.some((tag) => activeTags.has(tag)));
    }

    return result;
  });

  // Highlight matching text in title
  function highlightTitle(title: string, slug: string): string {
    const matchInfo = searchMatches.value.get(slug);
    if (!matchInfo || matchInfo.titleIndices.length === 0) {
      return escapeHtml(title);
    }

    return highlightText(title, matchInfo.titleIndices);
  }

  // Highlight matching text in content (HTML)
  function highlightContent(html: string, _slug: string): string {
    if (!searchQuery.value || searchQuery.value.length < 2) {
      return html;
    }

    // Simple approach: highlight the search query in the HTML text
    const query = searchQuery.value;
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return html.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function highlightText(text: string, indices: readonly [number, number][]): string {
    if (indices.length === 0) return escapeHtml(text);

    // Sort indices by start position
    const sorted = [...indices].sort((a, b) => a[0] - b[0]);

    let result = "";
    let lastEnd = 0;

    for (const [start, end] of sorted) {
      result += escapeHtml(text.slice(lastEnd, start));
      result += `<mark class="search-highlight">${escapeHtml(text.slice(start, end + 1))}</mark>`;
      lastEnd = end + 1;
    }

    result += escapeHtml(text.slice(lastEnd));
    return result;
  }

  function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function handleSearch(query: string) {
    searchQuery.value = query;
  }

  function toggleTag(tag: string) {
    if (activeTags.has(tag)) {
      activeTags.delete(tag);
    } else {
      activeTags.add(tag);
    }
  }

  function clearFilters() {
    activeTags.clear();
    selectedWeekKey.value = null;
  }

  function handleWeekSelect(weekKey: string | null) {
    selectedWeekKey.value = weekKey;
    expandedSlug.value = null;
  }

  async function toggleEntry(slug: string) {
    if (expandedSlug.value === slug) {
      expandedSlug.value = null;
    } else {
      expandedSlug.value = slug;

      // Load content if not already loaded
      // Find the entry to get the filename
      const entry = entries.value.find((e) => e.slug === slug);
      if (entry && !entryContent[slug]) {
        loadingContent.value = slug;
        try {
          const content = await fetchEntryContent(entry.filename);
          entryContent[slug] = content.html;
        } catch (error) {
          console.error("Failed to load entry content:", error);
          entryContent[slug] = "<p>Failed to load content.</p>";
        } finally {
          loadingContent.value = null;
        }
      }
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
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
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
</script>

<style scoped>
  .devlog-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
    max-width: 900px;
    margin: 0 auto;
  }

  .page-title {
    margin-bottom: var(--space-4);
    text-align: center;
  }

  .loading-state {
    text-align: center;
    padding: var(--space-12);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  .search-container {
    display: flex;
    justify-content: center;
    margin-top: var(--space-4);
  }

  /* Entries Container */
  .entries-container {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-6);
  }

  .no-entries {
    text-align: center;
    padding: var(--space-12);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  .entries-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  /* Entry Card */
  @keyframes entrySlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .entry-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: all var(--transition-fast);
    animation: entrySlideIn 300ms ease-out backwards;
    animation-delay: var(--entry-delay, 0ms);
  }

  .entry-card:hover {
    border-color: var(--color-border-strong);
  }

  .entry-card.expanded {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
  }

  .entry-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    text-align: left;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .entry-header:hover {
    background: var(--color-surface-hover);
  }

  .entry-date {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    flex-shrink: 0;
    width: 48px;
  }

  .entry-title {
    font-family: var(--font-mono);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0;
    line-height: var(--leading-tight);
    flex: 1;
  }

  .entry-tags {
    flex-shrink: 0;
  }

  .search-highlight,
  .entry-content :deep(.search-highlight) {
    background: oklch(0.85 0.15 90);
    color: oklch(0.3 0.05 90);
    padding: 0 2px;
    border-radius: 2px;
  }

  [data-theme="dark"] .search-highlight,
  [data-theme="dark"] .entry-content :deep(.search-highlight) {
    background: oklch(0.45 0.12 90);
    color: oklch(0.95 0.02 90);
  }

  .expand-icon {
    display: inline-block;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    transition: transform var(--transition-fast);
    margin-right: var(--space-1);
  }

  .expand-icon.rotated {
    transform: rotate(90deg);
  }

  /* Entry Content */
  .entry-content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--transition-normal);
  }

  .entry-card.expanded .entry-content-wrapper {
    grid-template-rows: 1fr;
  }

  .entry-content {
    overflow: hidden;
    padding: 0 var(--space-4) var(--space-4);
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    border-top: 1px solid var(--color-border-subtle);
    margin-top: var(--space-2);
    padding-top: var(--space-4);
  }

  .content-loading {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .entry-content :deep(p) {
    margin-bottom: var(--space-3);
  }

  .entry-content :deep(p:last-child) {
    margin-bottom: 0;
  }

  .entry-content :deep(a) {
    color: var(--color-link);
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 2px;
  }

  .entry-content :deep(a:hover) {
    text-decoration-color: var(--color-link);
  }

  .entry-content :deep(code) {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--color-background-subtle);
    padding: 2px 4px;
    border-radius: var(--radius-sm);
  }

  .entry-content :deep(pre) {
    background: var(--color-background-subtle);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: var(--space-3) 0;
  }

  .entry-content :deep(pre code) {
    background: none;
    padding: 0;
  }

  .entry-content :deep(ul),
  .entry-content :deep(ol) {
    padding-left: var(--space-5);
    margin-bottom: var(--space-3);
  }

  .entry-content :deep(li) {
    margin-bottom: var(--space-1);
  }

  .entry-content :deep(blockquote) {
    border-left: 3px solid var(--color-primary);
    padding-left: var(--space-4);
    margin: var(--space-3) 0;
    color: var(--color-text-muted);
    font-style: italic;
  }

  @media (--md) {
    .devlog-page {
      padding: var(--space-6);
    }

    .entry-header {
      flex-wrap: wrap;
    }

    .entry-tags {
      width: 100%;
      margin-top: var(--space-1);
    }
  }

  @media (--sm) {
    .devlog-page {
      padding: var(--space-4);
    }

    .entry-header {
      padding: var(--space-3);
    }

    .entry-content {
      padding: 0 var(--space-3) var(--space-3);
    }
  }
</style>
