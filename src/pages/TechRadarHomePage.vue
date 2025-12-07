<template>
  <div class="tech-radar-home">
    <div class="content">
      <h1 class="page-title">tech radar</h1>
      <p class="description">
        The Tech Radar is a tool to visualize technology choices. It provides a
        snapshot of the technologies, tools, languages, and frameworks that are
        relevant to our engineering work.
      </p>
      <p class="description">
        Items are organized into quadrants (Techniques, Platforms, Tools, and
        Languages & Frameworks) and rings (Adopt, Trial, Assess, and Hold) based
        on their current recommendation status.
      </p>

      <div class="radar-links">
        <router-link to="/tech-radar/sample" class="radar-link">
          <span class="link-text">[view sample radar]</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .tech-radar-home {
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

  .description {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }

  .radar-links {
    margin-top: var(--space-8);
  }

  .radar-link {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-primary);
    text-decoration: none;
    transition:
      opacity var(--transition-fast),
      transform var(--transition-fast);
  }

  .radar-link:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }

  .link-text {
    text-transform: lowercase;
  }

  @media (max-width: 768px) {
    .tech-radar-home {
      padding: var(--space-6);
    }

    .page-title {
      font-size: var(--text-2xl);
    }

    .description {
      font-size: var(--text-base);
    }

    .radar-link {
      font-size: var(--text-md);
    }
  }
</style>
