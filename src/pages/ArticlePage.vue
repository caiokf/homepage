<template>
  <div class="article-page">
    <div v-if="article" class="content">
      <header class="article-header">
        <router-link to="/articles" class="back-link">[back to articles]</router-link>

        <h1 class="article-title">{{ article.frontmatter.title }}</h1>

        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.frontmatter.date) }}</span>
          <span class="article-author">by Caio Kinzel Filho</span>
        </div>

        <div class="article-tags">
          <span
            v-for="tag in article.frontmatter.tags"
            :key="tag"
            class="article-tag"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <article class="article-content" v-html="article.html"></article>

      <footer class="article-footer">
        <router-link to="/articles" class="back-link">[back to articles]</router-link>
      </footer>
    </div>

    <div v-else class="not-found">
      <h1 class="page-title">article not found</h1>
      <p>The article you're looking for doesn't exist.</p>
      <router-link to="/articles" class="back-link">[back to articles]</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { getArticleBySlug } from "../content/articles";

  const route = useRoute();
  const slug = computed(() => route.params.slug as string);
  const article = computed(() => getArticleBySlug(slug.value));

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
</script>

<style scoped>
  .article-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  .content {
    max-width: 800px;
    margin: 0 auto;
  }

  .back-link {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-primary);
    text-decoration: none;
    text-transform: lowercase;
    margin-bottom: var(--space-6);
    transition: opacity var(--transition-fast);
  }

  .back-link:hover {
    opacity: 0.8;
  }

  .article-header {
    margin-bottom: var(--space-8);
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--color-border);
  }

  .article-title {
    font-family: var(--font-mono);
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-4) 0;
    text-transform: lowercase;
    line-height: var(--leading-tight);
  }

  .article-title::before {
    content: "// ";
    color: var(--color-primary);
  }

  .article-meta {
    display: flex;
    gap: var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-4);
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

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .article-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-primary);
    background: var(--color-primary-light);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    text-transform: lowercase;
  }

  .article-footer {
    margin-top: var(--space-8);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
  }

  .not-found {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  .not-found p {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-6);
  }

  @media (max-width: 768px) {
    .article-page {
      padding: var(--space-6);
    }

    .article-title {
      font-size: var(--text-2xl);
    }

    .article-meta {
      flex-direction: column;
      gap: var(--space-1);
    }

    .article-author::before {
      content: "";
    }
  }
</style>

<style>
  /* Global styles for article content (not scoped) */
  .article-content {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-relaxed);
    color: var(--color-text-primary);
  }

  .article-content h2 {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: var(--space-8) 0 var(--space-4) 0;
    text-transform: lowercase;
  }

  .article-content h2::before {
    content: "## ";
    color: var(--color-primary);
  }

  .article-content h3 {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: var(--space-6) 0 var(--space-3) 0;
    text-transform: lowercase;
  }

  .article-content h3::before {
    content: "### ";
    color: var(--color-primary);
  }

  .article-content p {
    margin: 0 0 var(--space-4) 0;
    color: var(--color-text-secondary);
  }

  .article-content ul,
  .article-content ol {
    margin: 0 0 var(--space-4) 0;
    padding-left: var(--space-6);
    color: var(--color-text-secondary);
  }

  .article-content li {
    margin-bottom: var(--space-2);
    list-style: disc;
  }

  .article-content ol li {
    list-style: decimal;
  }

  .article-content strong {
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
  }

  .article-content em {
    font-style: italic;
  }

  .article-content a {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .article-content a:hover {
    opacity: 0.8;
  }

  .article-content code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--color-background-subtle);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    color: var(--color-primary);
  }

  .article-content pre {
    background: var(--color-background-subtle);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    overflow-x: auto;
    margin: 0 0 var(--space-4) 0;
  }

  .article-content pre code {
    background: none;
    padding: 0;
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .article-content blockquote {
    border-left: 3px solid var(--color-primary);
    margin: 0 0 var(--space-4) 0;
    padding-left: var(--space-4);
    color: var(--color-text-muted);
    font-style: italic;
  }

  .article-content hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-8) 0;
  }
</style>
