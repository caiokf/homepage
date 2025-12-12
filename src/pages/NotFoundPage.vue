<template>
  <div class="not-found-page">
    <BaseCard title="error" :show-cursor="false">
      <div class="not-found-content">
        <p class="error-line"><span class="prompt">$</span> cat /{{ path }}</p>
        <p class="error-output"><span class="error-code">404</span> page not found</p>
        <p class="error-description">how did we end up here?</p>
        <p class="cursor-line"><span class="prompt">$</span> <span class="cursor">_</span></p>
      </div>
    </BaseCard>
    <BaseBracketLink to="/" class="home-link">look at caio again</BaseBracketLink>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import BaseCard from "../components/atoms/BaseCard.vue";
  import BaseBracketLink from "../components/atoms/BaseBracketLink.vue";

  const route = useRoute();
  const path = computed(() => route.path.slice(1) || "unknown");
</script>

<style scoped>
  .not-found-page {
    min-height: calc(100vh - 112px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    padding: var(--space-8);
  }

  .not-found-content {
    min-width: 320px;
  }

  .error-line {
    margin: 0 0 var(--space-3);
    font-size: var(--text-base);
    color: var(--color-text-primary);
  }

  .prompt {
    color: var(--color-primary);
    margin-right: var(--space-2);
  }

  .error-output {
    margin: var(--space-4) 0;
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-xl);
  }

  .error-code {
    color: var(--color-red);
    font-weight: var(--font-bold);
    margin-right: var(--space-2);
  }

  .error-description {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin: 0;
    line-height: var(--leading-relaxed);
  }

  .cursor-line {
    margin: var(--space-4) 0 0;
    font-size: var(--text-base);
    color: var(--color-text-primary);
  }

  .cursor {
    color: var(--color-text-primary);
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .home-link {
    font-size: var(--text-base);
  }
</style>
