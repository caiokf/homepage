<template>
  <div class="articles-page">
    <div class="content">
      <h1 class="page-title">articles</h1>

      <div class="articles-list">
        <article v-for="article in articles" :key="article.frontmatter.slug" class="article-card">
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
</template>

<script setup lang="ts">
  import { getAllArticles } from "../domain/articles/data";
  import BadgeGroup from "../components/molecules/BadgeGroup.vue";

  const articles = getAllArticles();

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

  .content {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  .page-title {
    margin-bottom: var(--space-8);
    text-align: center;
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

  @media (max-width: 768px) {
    .articles-page {
      padding: var(--space-6);
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
</style>
