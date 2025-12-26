<template>
  <BaseCard :tag="tag" class="app-card">
    <template #header>
      <BaseWindowControls />
      <slot name="header">
        <span class="card-title">caiokf://{{ title }}</span>
      </slot>
    </template>

    <slot></slot>
  </BaseCard>
</template>

<script setup lang="ts">
  import BaseCard from "../atoms/BaseCard.vue";
  import BaseWindowControls from "../atoms/BaseWindowControls.vue";

  withDefaults(
    defineProps<{
      tag?: "div" | "article" | "section";
      title?: string;
    }>(),
    {
      tag: "div",
      title: "terminal",
    }
  );
</script>

<style scoped>
  .card-title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-transform: lowercase;
  }
</style>
