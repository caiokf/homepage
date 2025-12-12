<template>
  <div :class="['badge-group', `badge-group--gap-${gap}`, `badge-group--${align}`]">
    <BaseBadge v-for="item in items" :key="item" :variant="variant" :size="size">
      {{ item }}
    </BaseBadge>
  </div>
</template>

<script setup lang="ts">
  import BaseBadge from "../atoms/BaseBadge.vue";

  interface Props {
    items: string[];
    variant?: "primary" | "muted" | "success" | "warning";
    size?: "sm" | "md";
    gap?: "xs" | "sm";
    align?: "start" | "end";
  }

  withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "sm",
    gap: "sm",
    align: "start",
  });
</script>

<style scoped>
  .badge-group {
    display: flex;
    flex-wrap: wrap;
  }

  /* Gap variants */
  .badge-group--gap-xs {
    gap: var(--space-1);
  }

  .badge-group--gap-sm {
    gap: var(--space-2);
  }

  /* Alignment */
  .badge-group--start {
    justify-content: flex-start;
  }

  .badge-group--end {
    justify-content: flex-end;
  }
</style>
