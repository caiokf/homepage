<template>
  <Transition name="fade">
    <div v-if="showHint" class="scroll-fade-hint" aria-hidden="true">
      <div class="fade-layer"></div>
      <div class="scroll-indicator">
        <span class="scroll-chevron">›</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";

  const showHint = ref(false);

  // Threshold from bottom (in px) when hint should hide
  const HIDE_THRESHOLD = 200;
  // Minimum scroll height to show hint
  const MIN_SCROLLABLE = 300;

  function checkScroll() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const scrollableDistance = documentHeight - windowHeight;
    const distanceFromBottom = scrollableDistance - scrollTop;

    // Show hint if there's enough scrollable content and we're not near the bottom
    showHint.value = scrollableDistance > MIN_SCROLLABLE && distanceFromBottom > HIDE_THRESHOLD;
  }

  onMounted(() => {
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", checkScroll);
    window.removeEventListener("resize", checkScroll);
  });
</script>

<style scoped>
  .scroll-fade-hint {
    position: fixed;
    bottom: 56px; /* Above footer */
    left: 0;
    right: 0;
    pointer-events: none;
    z-index: 50;
  }

  .fade-layer {
    height: 48px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      oklch(from var(--color-background) l c h / 0.5) 50%,
      oklch(from var(--color-background) l c h / 0.8) 100%
    );
    backdrop-filter: blur(1px);
    mask-image: linear-gradient(to bottom, transparent, black 40%);
  }

  .scroll-indicator {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .scroll-chevron {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    transform: rotate(90deg);
    animation: bounce 1.5s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: rotate(90deg) translateX(0);
      opacity: 0.5;
    }
    50% {
      transform: rotate(90deg) translateX(4px);
      opacity: 1;
    }
  }

  /* Transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 300ms ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Dark theme - use darker background */
  [data-theme="dark"] .fade-layer {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      oklch(0.13 0.01 260 / 0.5) 50%,
      oklch(0.13 0.01 260 / 0.8) 100%
    );
  }

  /* Light theme */
  :root:not([data-theme="dark"]) .fade-layer,
  [data-theme="light"] .fade-layer {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      oklch(0.985 0.005 260 / 0.5) 50%,
      oklch(0.985 0.005 260 / 0.8) 100%
    );
  }
</style>
