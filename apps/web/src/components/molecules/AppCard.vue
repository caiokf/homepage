<template>
  <BaseCard :tag="tag" class="app-card">
    <template #header>
      <BaseWindowControls />
      <slot name="header" />
    </template>
    <slot />
  </BaseCard>
</template>

<script setup lang="ts">
  import BaseCard from "../atoms/BaseCard.vue";
  import BaseWindowControls from "../atoms/BaseWindowControls.vue";

  withDefaults(
    defineProps<{
      tag?: "div" | "article" | "section";
    }>(),
    {
      tag: "article",
    }
  );
</script>

<style scoped>
  .app-card :deep(.card-header) {
    justify-content: space-between;
  }
</style>
