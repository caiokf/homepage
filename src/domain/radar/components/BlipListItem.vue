<template>
  <li
    :class="['blip-item', { selected: isSelected, highlighted: isHighlighted }]"
    :style="{ '--stagger-delay': `${staggerIndex * 30}ms` }"
    @mouseenter="$emit('hover', blip)"
    @mouseleave="$emit('hover', null)"
  >
    <button
      ref="headerRef"
      class="blip-header"
      :aria-expanded="isSelected"
      @click="toggleExpand"
    >
      <span class="blip-number">{{ blip.blipText }}.</span>
      <span class="blip-name">{{ blip.name }}</span>
      <BaseBadge v-if="blip.isNew" variant="success">NEW</BaseBadge>
      <BaseBadge v-else-if="blip.status === 'moved in'" variant="warning">IN</BaseBadge>
      <BaseBadge v-else-if="blip.status === 'moved out'" variant="warning">OUT</BaseBadge>
      <span class="expand-arrow" :class="{ rotated: isSelected }">&#9660;</span>
    </button>
    <div class="blip-description" :class="{ visible: isSelected }">
      <div v-html="blip.description || 'No description available.'"></div>
    </div>
  </li>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from "vue";
  import type { PositionedBlip } from "../types";
  import BaseBadge from "../../../components/atoms/BaseBadge.vue";
  import { STICKY_HEADER_HEIGHT, TRANSITION_DURATION_MS } from "../constants";

  const props = defineProps<{
    blip: PositionedBlip;
    staggerIndex: number;
    isHighlighted: boolean;
    isSelected: boolean;
  }>();

  const emit = defineEmits<{
    hover: [blip: PositionedBlip | null];
    click: [blip: PositionedBlip];
    toggle: [blipId: number];
  }>();

  const headerRef = ref<HTMLButtonElement | null>(null);

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Find the closest scrollable ancestor
  function getScrollableParent(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;
    let parent = element.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      const overflow = style.overflow;
      const isScrollableY =
        overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay" ||
        overflow === "auto" ||
        overflow === "scroll";
      if (isScrollableY && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return (document.scrollingElement as HTMLElement | null) ?? null;
  }

  // Scroll the header to the top (just below sticky header) when selected
  // Using immediate: true ensures this runs on mount if already selected
  watch(
    () => props.isSelected,
    async (selected) => {
      if (!selected) return;

      // Wait for DOM update and transition to complete before calculating scroll position
      await nextTick();
      await delay(TRANSITION_DURATION_MS);

      const header = headerRef.value;
      if (!header) return;

      const scrollContainer = getScrollableParent(header);
      if (!scrollContainer) return;

      const headerRect = header.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const targetScrollTop =
        scrollContainer.scrollTop + headerRect.top - containerRect.top - STICKY_HEADER_HEIGHT;

      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    },
    { immediate: true }
  );

  function toggleExpand() {
    emit("toggle", props.blip.id);
  }
</script>

<style scoped>
  @keyframes slideInFromRight {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .blip-item {
    list-style: none;
    border-bottom: 1px solid var(--color-border-subtle);
    transition: border-color var(--transition-theme);
    animation: slideInFromRight 300ms ease-out backwards;
    animation-delay: var(--stagger-delay, 0ms);
  }

  .blip-item.highlighted {
    background: var(--color-surface-highlight);
    transition: background-color var(--transition-theme);
  }

  .blip-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: var(--text-base);
    color: var(--color-text-primary);
    transition: background-color var(--transition-fast),
      color var(--transition-theme);
  }

  .blip-header:hover {
    background: var(--color-surface-hover);
  }

  .blip-number {
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    color: var(--color-text-secondary);
    min-width: 24px;
    transition: color var(--transition-theme);
  }

  .blip-name {
    flex: 1;
    font-weight: var(--font-medium);
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    transition: color var(--transition-theme);
  }

  .expand-arrow {
    font-size: 10px;
    color: var(--color-text-muted);
    transition: transform var(--transition-fast), color var(--transition-theme);
  }

  .expand-arrow.rotated {
    transform: rotate(180deg);
  }

  .blip-description {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-slow), padding var(--transition-slow);
    padding: 0 var(--space-4);
  }

  .blip-description.visible {
    max-height: none;
    padding: var(--space-4) var(--space-4) var(--space-4) 48px;
  }

  .blip-description :deep(p) {
    margin: 0 0 var(--space-2) 0;
    color: var(--color-text-secondary);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    font-family: var(--font-sans);
    transition: color var(--transition-theme);
  }

  .blip-description :deep(p:last-child) {
    margin-bottom: 0;
  }

  .blip-description :deep(a) {
    color: var(--color-link);
    text-decoration: underline;
  }

  .blip-description :deep(a:hover) {
    color: var(--color-link-hover);
  }

  .blip-description :deep(ul),
  .blip-description :deep(ol) {
    margin: var(--space-2) 0;
    padding-left: var(--space-6);
    color: var(--color-text-secondary);
  }

  .blip-description :deep(li) {
    margin-bottom: var(--space-1);
  }

  .blip-description :deep(code) {
    background: var(--color-surface);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  /* Usage section - primary "my take" */
  .blip-description :deep(.blip-content-usage) {
    margin-bottom: var(--space-4);
  }

  .blip-description :deep(.blip-content-usage p) {
    color: var(--color-text-primary);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
  }

  /* Description section - muted "official explanation" */
  .blip-description :deep(.blip-content-description) {
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-subtle);
    transition: border-color var(--transition-theme);
  }

  .blip-description :deep(.blip-content-description p) {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-style: italic;
    line-height: var(--leading-relaxed);
  }
</style>
