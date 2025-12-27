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
        <span v-if="contentIndexed" class="search-status" title="Full-text search enabled"></span>
      </div>

      <!-- Entries list (flat, no week grouping) -->
      <div class="entries-container">
        <div v-if="fetchError" class="error-state">
          <p>{{ fetchError }}</p>
        </div>

        <div v-else-if="filteredEntries.length === 0" class="no-entries">
          <p>no entries yet. check back soon!</p>
        </div>

        <div class="entries-list">
          <article
            v-for="(entry, index) in filteredEntries"
            :key="entry.slug"
            class="entry-card"
            :class="{ expanded: expandedSlug === entry.slug }"
            :style="getStaggerStyle(index)"
          >
            <button class="entry-header" @click="toggleEntry(entry.slug)">
              <span class="entry-date">{{ formatDate(entry.date) }}</span>
              <h2 class="entry-title">
                <span class="expand-icon" :class="{ rotated: expandedSlug === entry.slug }">›</span>
                <span v-html="highlightTitle(entry.title, entry.slug)"></span>
              </h2>
              <!-- Relevance score bar (only visible during search) -->
              <div v-if="isSearching" class="relevance-indicator">
                <div
                  class="relevance-bar"
                  :style="{ '--relevance': `${getRelevancePercent(entry.slug)}%` }"
                ></div>
                <span class="relevance-score">{{ getRelevancePercent(entry.slug) }}%</span>
              </div>
              <BadgeGroup :items="entry.tags" gap="xs" class="entry-tags" />
            </button>

            <div class="entry-content-wrapper">
              <div v-if="expandedSlug === entry.slug" class="entry-content">
                <div v-if="loadingContent === entry.slug" class="content-loading">loading...</div>
                <div v-else v-html="highlightContent(entryContent[entry.slug] || '')"></div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, onMounted, nextTick } from "vue";
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
  import { useStaggerAnimation } from "../composables/useStaggerAnimation";

  const { getStaggerStyle } = useStaggerAnimation({ delayIncrement: 100 });

  const entries = ref<EntryMetadata[]>([]);
  const isLoading = ref(true);
  const fetchError = ref<string | null>(null);
  const loadingContent = ref<string | null>(null);
  const entryContent = reactive<Record<string, string>>({});

  // Plain text content for search (stripped HTML)
  const searchableContent = reactive<Record<string, string>>({});
  const contentIndexed = ref(false);

  // Initialize Fuse.js lazily
  let fuse: Fuse<EntryMetadata> | null = null;

  // Extended type for search that includes content
  type SearchableEntry = EntryMetadata & { content?: string };

  // Strip HTML tags for plain text search
  function stripHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  // Create Fuse instance with current data
  function createFuseIndex(includeContent: boolean) {
    const searchData: SearchableEntry[] = entries.value.map((entry) => ({
      ...entry,
      content: includeContent ? searchableContent[entry.slug] : undefined,
    }));

    const keys = [
      { name: "title", weight: 2 },
      { name: "tags", weight: 1.5 },
    ];

    if (includeContent) {
      keys.push({ name: "content", weight: 1 });
    }

    fuse = new Fuse<SearchableEntry>(searchData, {
      keys,
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: false,
      minMatchCharLength: 2,
    });
  }

  // Background load all content for search indexing
  async function loadContentForSearch() {
    const loadPromises = entries.value.map(async (entry) => {
      if (!entryContent[entry.slug]) {
        try {
          const content = await fetchEntryContent(entry.filename);
          entryContent[entry.slug] = content.html;
          searchableContent[entry.slug] = stripHtml(content.html);
        } catch (error) {
          console.warn(`Failed to load content for ${entry.slug}:`, error);
        }
      } else {
        // Already loaded, just ensure searchable content exists
        searchableContent[entry.slug] = stripHtml(entryContent[entry.slug]);
      }
    });

    await Promise.all(loadPromises);

    // Rebuild Fuse index with content
    createFuseIndex(true);
    contentIndexed.value = true;
  }

  onMounted(async () => {
    try {
      entries.value = await fetchIndex();
      // Initial index without content
      createFuseIndex(false);
    } catch (error) {
      entries.value = [];
      fetchError.value = "failed to load entries. please try again later.";
      console.error("Failed to fetch devlog index:", error);
    } finally {
      isLoading.value = false;
    }

    // After render, background load content for full-text search
    nextTick(() => {
      // Small delay to ensure UI is fully interactive first
      setTimeout(loadContentForSearch, 500);
    });
  });

  const entryCounts = computed(() => getEntryCounts(entries.value));

  type MatchInfo = {
    titleIndices: readonly [number, number][];
    score: number; // 0 = perfect match, 1 = no match
  };

  // Store search match indices and scores
  const searchMatches = ref<Map<string, MatchInfo>>(new Map());

  // Check if we're in search mode
  const isSearching = computed(() => searchQuery.value.length >= 2);

  // Get relevance percentage for an entry (inverted score: 100% = perfect match)
  function getRelevancePercent(slug: string): number {
    const matchInfo = searchMatches.value.get(slug);
    if (!matchInfo) return 0;
    // Fuse score is 0-1 where 0 is perfect, invert and scale to percentage
    return Math.round((1 - matchInfo.score) * 100);
  }

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

      // Build match indices and scores map
      const newMatches = new Map<string, MatchInfo>();
      searchResults.forEach((r) => {
        const titleMatch = r.matches?.find((m) => m.key === "title");
        newMatches.set(r.item.slug, {
          titleIndices: titleMatch?.indices || [],
          score: r.score ?? 1,
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
  function highlightContent(html: string): string {
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
    // Prevent toggling while content is loading
    if (loadingContent.value) {
      return;
    }

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
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  .search-status {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-primary);
    opacity: 0;
    animation: fadeIn 300ms ease-out forwards;
  }

  @keyframes fadeIn {
    to {
      opacity: 0.7;
    }
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

  .error-state {
    text-align: center;
    padding: var(--space-8);
    color: var(--color-error, #dc2626);
    font-family: var(--font-mono);
    background: var(--color-error-bg, oklch(0.95 0.03 25));
    border: 1px solid var(--color-error-border, oklch(0.85 0.08 25));
    border-radius: var(--radius-md);
  }

  [data-theme="dark"] .error-state {
    background: oklch(0.25 0.05 25);
    border-color: oklch(0.35 0.1 25);
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
    animation: entrySlideIn 400ms ease-out backwards;
    animation-delay: var(--stagger-delay, 0ms);
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

  /* Relevance indicator */
  .relevance-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .relevance-bar {
    width: 48px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .relevance-bar::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: var(--relevance, 0%);
    background: var(--color-primary);
    border-radius: 2px;
    animation: relevanceGrow 400ms cubic-bezier(0.4, 0, 0.2, 1) backwards;
  }

  @keyframes relevanceGrow {
    from {
      width: 0%;
    }
    to {
      width: var(--relevance, 0%);
    }
  }

  .relevance-score {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    min-width: 32px;
    text-align: right;
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

    .relevance-indicator {
      order: 1;
      width: 100%;
      margin-top: var(--space-1);
    }

    .relevance-bar {
      flex: 1;
      max-width: 120px;
    }

    .entry-tags {
      order: 2;
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
