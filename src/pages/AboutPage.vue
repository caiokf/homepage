<template>
  <div class="about-page">
    <div class="about-content">
      <h1 class="page-title">about</h1>
      <p class="about-text">
        Welcome to my personal space. I'm a software engineer passionate about
        building great products and exploring new technologies.
      </p>
      <p class="about-text">
        This site serves as a hub for my tech radar, experience, and articles.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .about-page {
    min-height: calc(100vh - 112px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
  }

  .about-content {
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

  .about-text {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }

  .about-text:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .about-page {
      padding: var(--space-6);
    }

    .page-title {
      font-size: var(--text-2xl);
    }

    .about-text {
      font-size: var(--text-md);
    }
  }
</style>
