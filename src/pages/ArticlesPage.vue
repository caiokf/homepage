<template>
  <div class="articles-page">
    <div class="content">
      <h1 class="page-title">articles</h1>
      <p class="placeholder-text">Blog posts and technical articles coming soon.</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .articles-page {
    min-height: calc(100vh - 112px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
  }

  .content {
    max-width: 600px;
    text-align: center;
  }

  .page-title {
    margin-bottom: var(--space-6);
  }

  .placeholder-text {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    color: var(--color-text-muted);
  }

  @media (max-width: 768px) {
    .articles-page {
      padding: var(--space-6);
    }

    .placeholder-text {
      font-size: var(--text-md);
    }
  }
</style>
