<template>
  <div class="articles-page">
    <h1 class="page-title">articles</h1>

    <div class="page-layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">contents</h3>
        <nav class="toc-nav">
          <a
            v-for="article in articles"
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
            v-for="article in articles"
            :id="article.frontmatter.slug"
            :key="article.frontmatter.slug"
            class="article-card"
          >
            <router-link :to="`/articles/${article.frontmatter.slug}`" class="article-link">
              <header class="article-header">
                <h2 class="article-title">{{ article.frontmatter.title }}</h2>
                <div class="article-meta">
                  <span class="article-date">{{ formatDate(article.frontmatter.date) }}</span>
                  <span class="article-author">by Caio Kinzel Filho</span>
                </div>
              </header>

              <p class="article-excerpt">{{ getExcerpt(article.content) }}</p>

              <footer class="article-footer">
                <BadgeGroup :items="article.frontmatter.tags" />
                <span class="read-more-link" aria-hidden="true">read more</span>
              </footer>
            </router-link>
          </article>
        </div>

        <p v-if="articles.length === 0" class="no-articles">No articles yet. Check back soon!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import { getAllArticles } from "../domain/articles/data";
  import BadgeGroup from "../components/molecules/BadgeGroup.vue";

  const articles = getAllArticles();
  const activeSlug = ref(articles[0]?.frontmatter.slug ?? "");

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
    // Remove markdown formatting and get first paragraph
    const plainText = content
      .replace(/^---[\s\S]*?---/m, "") // Remove frontmatter if present
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*|__/g, "") // Remove bold
      .replace(/\*|_/g, "") // Remove italic
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, "") // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  }
</script>

<style scoped>
  .articles-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  .page-title {
    margin-bottom: var(--space-8);
    text-align: center;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
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
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-4) 0;
  }

  .sidebar-title::before {
    content: "// ";
    color: var(--color-primary);
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

  .article-card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: background-color var(--transition-theme), box-shadow var(--transition-theme),
      transform var(--transition-fast);
  }

  .article-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .article-link {
    display: block;
    padding: var(--space-6);
    text-decoration: none;
    color: inherit;
  }

  .article-header {
    margin-bottom: var(--space-4);
  }

  .article-title {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-2) 0;
    text-transform: lowercase;
    transition: color var(--transition-fast);
  }

  .article-title::before {
    content: "// ";
    color: var(--color-primary);
  }

  .article-card:hover .article-title {
    color: var(--color-primary);
  }

  .article-meta {
    display: flex;
    gap: var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .article-date {
    text-transform: lowercase;
  }

  .article-author {
    text-transform: lowercase;
  }

  .article-author::before {
    content: "• ";
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

    .article-link {
      padding: var(--space-4);
    }

    .article-title {
      font-size: var(--text-lg);
    }

    .article-meta {
      flex-direction: column;
      gap: var(--space-1);
    }

    .article-author::before {
      content: "";
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
  }
</style>
