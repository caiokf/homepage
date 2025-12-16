<template>
  <div class="articles-page">
    <h1 class="page-title">articles</h1>

    <!-- Tag Filter Bar -->
    <div class="tag-filter-bar">
      <button
        v-for="tag in allTags"
        :key="tag.name"
        class="tag-filter"
        :class="{ active: activeTags.has(tag.name) }"
        @click="toggleTag(tag.name)"
      >
        {{ tag.name }} <span class="tag-count">[{{ tag.count }}]</span>
      </button>
      <button v-if="activeTags.size > 0" class="clear-filters" @click="clearFilters">
        clear
      </button>
    </div>

    <div class="page-layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">contents</h3>
        <nav class="toc-nav">
          <a
            v-for="article in filteredArticles"
            :key="article.frontmatter.slug"
            :href="`#${article.frontmatter.slug}`"
            class="toc-link"
            :class="{ active: activeSlug === article.frontmatter.slug }"
            @click.prevent="scrollToArticle(article.frontmatter.slug)"
          >
            {{ article.frontmatter.title }}
          </a>
        </nav>
      </aside>

      <div class="content">
        <div class="articles-list">
          <article
            v-for="(article, index) in articles"
            :id="article.frontmatter.slug"
            :key="article.frontmatter.slug"
            class="article-card"
            :class="{ dimmed: !matchesFilter(article) }"
            :style="{ '--card-delay': `${index * 100}ms` }"
          >
            <!-- App Window Header -->
            <header class="card-header">
              <div class="window-controls">
                <span class="control close"></span>
                <span class="control minimize"></span>
                <span class="control maximize"></span>
              </div>
              <div class="card-meta">
                <span class="meta-date">{{ formatDate(article.frontmatter.date) }}</span>
                <span class="meta-reading-time">{{ getReadingTime(article.content) }}</span>
              </div>
            </header>

            <!-- Card Content -->
            <router-link :to="`/articles/${article.frontmatter.slug}`" class="article-link">
              <div class="card-content">
                <h2 class="article-title">{{ article.frontmatter.title }}</h2>
                <p class="article-excerpt">{{ getExcerpt(article.content) }}</p>

                <footer class="article-footer">
                  <BadgeGroup :items="article.frontmatter.tags" />
                  <span class="read-more-link" aria-hidden="true">read more</span>
                </footer>
              </div>
            </router-link>
          </article>
        </div>

        <p v-if="articles.length === 0" class="no-articles">No articles yet. Check back soon!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
  import { getAllArticles, type Article } from "../domain/articles/data";
  import BadgeGroup from "../components/molecules/BadgeGroup.vue";

  const articles = getAllArticles();
  const activeSlug = ref(articles[0]?.frontmatter.slug ?? "");

  // Tag filtering
  type TagInfo = { name: string; count: number };

  const activeTags = reactive(new Set<string>());

  const allTags = computed<TagInfo[]>(() => {
    const tagCounts = new Map<string, number>();
    articles.forEach((article) => {
      article.frontmatter.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  });

  function toggleTag(tag: string) {
    if (activeTags.has(tag)) {
      activeTags.delete(tag);
    } else {
      activeTags.add(tag);
    }
  }

  function clearFilters() {
    activeTags.clear();
  }

  function matchesFilter(article: Article): boolean {
    if (activeTags.size === 0) return true;
    return article.frontmatter.tags.some((tag) => activeTags.has(tag));
  }

  const filteredArticles = computed(() => {
    if (activeTags.size === 0) return articles;
    return articles.filter(matchesFilter);
  });

  function scrollToArticle(slug: string) {
    const element = document.getElementById(slug);
    if (element) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  // Intersection Observer to track which article is in view
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSlug.value = entry.target.id;
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    articles.forEach((article) => {
      const element = document.getElementById(article.frontmatter.slug);
      if (element) {
        observer?.observe(element);
      }
    });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

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
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function getExcerpt(content: string, maxLength = 200): string {
    const plainText = getPlainText(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  }

  function getPlainText(content: string): string {
    return content
      .replace(/^---[\s\S]*?---/m, "") // Remove frontmatter if present
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*|__/g, "") // Remove bold
      .replace(/\*|_/g, "") // Remove italic
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, "") // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .trim();
  }

  function getReadingTime(content: string): string {
    const plainText = getPlainText(content);
    const wordsPerMinute = 200;
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }
</script>

<style scoped>
  .articles-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  .page-title {
    margin-bottom: var(--space-6);
    text-align: center;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Tag Filter Bar */
  .tag-filter-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2);
    max-width: 1200px;
    margin: 0 auto var(--space-6) auto;
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--color-border);
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

  .page-layout {
    display: flex;
    gap: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }

  .sidebar {
    position: sticky;
    top: calc(56px + var(--space-8));
    width: 240px;
    flex-shrink: 0;
    height: fit-content;
    max-height: calc(100vh - 56px - var(--space-8) * 2);
    overflow-y: auto;
  }

  .sidebar-title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-muted);
    text-transform: lowercase;
    margin: 0 0 var(--space-4) 0;
  }

  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .toc-link {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-decoration: none;
    text-transform: lowercase;
    padding: var(--space-2) var(--space-3);
    border-left: 2px solid transparent;
    transition: all var(--transition-fast);
    line-height: var(--leading-normal);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .toc-link:hover {
    color: var(--color-text-secondary);
    background: var(--color-surface-hover);
  }

  .toc-link.active {
    color: var(--color-primary);
    border-left-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .content {
    flex: 1;
    max-width: var(--content-max-width);
    min-width: 0;
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  /* Card entrance animation */
  @keyframes cardSlideUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* App Window Card Styling */
  .article-card {
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    transition:
      background-color var(--transition-theme),
      box-shadow 0.2s ease,
      transform 0.2s ease,
      opacity 0.3s ease;
    animation: cardSlideUp 500ms ease-out backwards;
    animation-delay: var(--card-delay, 0ms);
  }

  .article-card:hover {
    box-shadow: var(--shadow-xl);
  }

  .article-card.dimmed {
    opacity: 0.35;
    transform: scale(0.98);
    pointer-events: auto;
  }

  .article-card.dimmed:hover {
    opacity: 0.55;
    transform: scale(0.99);
  }

  .article-card:not(.dimmed):has(.card-header:hover) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  /* Card Header - Window Chrome */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: 0;
    transition: background-color 0.2s ease;
  }

  .card-header:hover {
    background: var(--color-surface-hover);
  }

  .window-controls {
    display: flex;
    gap: 8px;
    padding: var(--space-3) var(--space-4);
  }

  .control {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    background: var(--color-border);
  }

  .control.close {
    background: #ff5f57;
  }

  .control.minimize {
    background: #febc2e;
  }

  .control.maximize {
    background: #28c840;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
  }

  .meta-date {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .meta-reading-time {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
  }

  /* Card Content */
  .article-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .card-content {
    padding: var(--space-5);
  }

  .article-title {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-3) 0;
    text-transform: lowercase;
    transition: color var(--transition-fast);
  }

  .article-card:hover .article-title {
    color: var(--color-primary);
  }

  .article-excerpt {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin: 0 0 var(--space-4) 0;
  }

  .article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .read-more-link {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-primary);
    text-transform: lowercase;
  }

  .read-more-link::before {
    content: "[";
  }

  .read-more-link::after {
    content: "]";
  }

  .no-articles {
    text-align: center;
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    color: var(--color-text-muted);
  }

  @media (--lg) {
    .sidebar {
      width: 200px;
    }
  }

  @media (--md) {
    .articles-page {
      padding: var(--space-6);
    }

    .tag-filter-bar {
      gap: var(--space-2);
      padding-bottom: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .page-layout {
      flex-direction: column;
    }

    .sidebar {
      position: static;
      width: 100%;
      max-height: none;
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--space-2);
    }

    .toc-nav {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .toc-link {
      border-left: none;
      border-bottom: 2px solid transparent;
      padding: var(--space-1) var(--space-2);
      font-size: var(--text-xs);
      -webkit-line-clamp: 1;
    }

    .toc-link.active {
      border-left-color: transparent;
      border-bottom-color: var(--color-primary);
    }

    .card-content {
      padding: var(--space-4);
    }

    .article-title {
      font-size: var(--text-base);
    }

    .article-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }

    .read-more-link {
      align-self: flex-end;
    }
  }

  @media (--sm) {
    .sidebar {
      display: none;
    }

    .window-controls {
      display: none;
    }

    .card-meta {
      width: 100%;
      justify-content: center;
    }
  }
</style>
