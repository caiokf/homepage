<template>
  <div ref="containerRef" class="social-links-container" :class="{ compact: isCompact }">
    <!-- Expanded view (icons) -->
    <div v-if="!isCompact" class="social-links">
      <a
        v-for="social in socialsConfig"
        :key="social.network"
        :href="social.url"
        :aria-label="social.network"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="social-tooltip">{{ social.network }}</span>
        <span class="social-icon-wrapper">
          <img :src="social.icon" :alt="social.network" class="social-icon" />
        </span>
      </a>
    </div>

    <!-- Compact view (link with popup) -->
    <div v-else class="social-compact">
      <BaseBracketLink
        class="social-toggle"
        :aria-expanded="isPopupOpen"
        aria-controls="social-popup"
        @click="togglePopup"
        >socials</BaseBracketLink
      >

      <Transition name="popup">
        <div v-if="isPopupOpen" id="social-popup" class="social-popup">
          <a
            v-for="social in socialsConfig"
            :key="social.network"
            :href="social.url"
            :title="social.network"
            class="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="social.icon" :alt="social.network" class="social-icon" />
          </a>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import { socialsConfig } from "../../domain/layout/data";
  import BaseBracketLink from "../atoms/BaseBracketLink.vue";

  const containerRef = ref<HTMLElement | null>(null);
  const isCompact = ref(false);
  const isPopupOpen = ref(false);

  // Window width threshold where we switch to compact mode
  const COMPACT_WINDOW_THRESHOLD = 500;

  function checkSize() {
    isCompact.value = window.innerWidth < COMPACT_WINDOW_THRESHOLD;
    isPopupOpen.value = false;
  }

  function togglePopup() {
    isPopupOpen.value = !isPopupOpen.value;
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      isPopupOpen.value = false;
    }
  }

  onMounted(() => {
    checkSize();
    window.addEventListener("resize", checkSize);
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkSize);
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<style scoped>
  .social-links-container {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 150px;
    margin-left: var(--space-6);
    padding-left: var(--space-6);
    border-left: 1px solid oklch(1 0 0 / 0.15);
  }

  .social-links-container.compact {
    min-width: auto;
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .social-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }

  .social-link:hover {
    opacity: 1;
  }

  .social-link:focus-visible {
    opacity: 1;
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }

  /* Icon wrapper for bounce animation */
  .social-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .social-link:hover .social-icon-wrapper {
    transform: translateY(-3px) scale(1.15);
  }

  .social-icon {
    width: 18px;
    height: 18px;
    filter: invert(1);
  }

  /* Tooltip slide-up */
  .social-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    padding: var(--space-1) var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-primary);
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 200ms ease,
      transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .social-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--color-border);
  }

  .social-link:hover .social-tooltip,
  .social-link:focus-visible .social-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .social-compact {
    position: relative;
  }

  .social-toggle {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }

  .social-toggle:hover {
    opacity: 1;
  }

  .social-popup {
    position: fixed;
    bottom: calc(56px + var(--space-2));
    right: var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    height: 48px;
    padding: 0 var(--space-3);
    background: oklch(0.15 0 0 / 0.95);
    backdrop-filter: blur(16px);
    border-radius: var(--radius-md);
    border: 1px solid oklch(1 0 0 / 0.1);
    box-shadow: var(--shadow-lg);
  }

  .social-popup .social-icon {
    width: 24px;
    height: 24px;
  }

  .social-popup .social-link {
    opacity: 1;
  }

  .social-popup .social-link:hover {
    transform: scale(1.1);
  }

  /* Popup transition */
  .popup-enter-active,
  .popup-leave-active {
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .popup-enter-from,
  .popup-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }

  /* Light theme adjustments */
  :root:not([data-theme="dark"]) .social-links-container,
  [data-theme="light"] .social-links-container {
    border-left-color: oklch(0 0 0 / 0.15);
  }

  :root:not([data-theme="dark"]) .social-icon,
  [data-theme="light"] .social-icon {
    filter: invert(0);
  }

  :root:not([data-theme="dark"]) .social-popup,
  [data-theme="light"] .social-popup {
    background: oklch(0.98 0 0 / 0.95);
    border-color: oklch(0 0 0 / 0.1);
  }

  /* Mobile adjustments */
  @media (--md) {
    .social-links-container {
      margin-left: var(--space-4);
      padding-left: var(--space-4);
    }

    .social-links {
      gap: var(--space-3);
    }

    .social-icon {
      width: 16px;
      height: 16px;
    }

    /* Hide tooltips on smaller screens */
    .social-tooltip {
      display: none;
    }
  }
</style>
