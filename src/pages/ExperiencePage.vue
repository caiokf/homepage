<template>
  <div class="experience-page">
    <div class="content">
      <h1 class="page-title">experience</h1>
      <p class="placeholder-text">
        Professional experience and career timeline coming soon.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .experience-page {
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
    font-family: var(--font-mono);
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-6);
    color: var(--color-text-primary);
    text-transform: lowercase;
  }

  .placeholder-text {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    color: var(--color-text-muted);
  }

  @media (max-width: 768px) {
    .experience-page {
      padding: var(--space-6);
    }

    .page-title {
      font-size: var(--text-2xl);
    }

    .placeholder-text {
      font-size: var(--text-md);
    }
  }
</style>
