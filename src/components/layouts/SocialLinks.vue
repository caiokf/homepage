<template>
  <div ref="containerRef" class="social-links-container" :class="{ compact: isCompact }">
    <!-- Expanded view (icons) -->
    <div v-if="!isCompact" class="social-links">
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
  import { socialsConfig } from "../../config/socials-config";
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
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .social-link:hover {
    opacity: 1;
    transform: translateY(-2px);
  }

  .social-icon {
    width: 18px;
    height: 18px;
    filter: invert(1);
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
  @media (max-width: 800px) {
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
  }
</style>
