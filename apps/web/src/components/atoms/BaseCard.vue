<template>
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  <component :is="tag" class="base-card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </header>
||||||| ancestor
  <div class="app-card">
    <div class="card-header">
      <div class="card-controls">
        <span class="control"></span>
        <span class="control"></span>
        <span class="control"></span>
      </div>
      <span class="card-title">caiokf://{{ title }}</span>
    </div>
=======
  <div class="app-card">
    <div class="card-header">
||||||| ancestor
  <div class="app-card">
    <div class="card-header">
=======
  <component :is="tag" class="app-card">
    <header class="card-header">
>>>>>>> theirs
      <BaseWindowControls />
<<<<<<< ours
      <span class="card-title">caiokf://{{ title }}</span>
    </div>
>>>>>>> theirs
||||||| ancestor
      <span class="card-title">caiokf://{{ title }}</span>
    </div>
=======
      <slot name="header">
        <span class="card-title">caiokf://{{ title }}</span>
      </slot>
||||||| ancestor
  <component :is="tag" class="app-card">
    <header class="card-header">
      <BaseWindowControls />
      <slot name="header">
        <span class="card-title">caiokf://{{ title }}</span>
      </slot>
=======
  <component :is="tag" class="base-card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
>>>>>>> theirs
    </header>
>>>>>>> theirs
    <div class="card-body">
      <slot></slot>
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
      <BaseCursor v-if="showCursor" />
||||||| ancestor
      <span v-if="showCursor" class="cursor"></span>
=======
>>>>>>> theirs
||||||| ancestor
      <span v-if="showCursor" class="cursor"></span>
=======
>>>>>>> theirs
||||||| ancestor
      <BaseCursor v-if="showCursor" />
=======
>>>>>>> theirs
    </div>
  </component>
</template>

<script setup lang="ts">
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  import BaseCursor from "./BaseCursor.vue";

||||||| ancestor
=======
  import BaseWindowControls from "./BaseWindowControls.vue";

>>>>>>> theirs
||||||| ancestor
  import BaseWindowControls from "./BaseWindowControls.vue";

=======
>>>>>>> theirs
||||||| ancestor
=======
  import BaseWindowControls from "./BaseWindowControls.vue";

>>>>>>> theirs
||||||| ancestor
  import BaseWindowControls from "./BaseWindowControls.vue";

=======
>>>>>>> theirs
||||||| ancestor
  import BaseCursor from "./BaseCursor.vue";

=======
>>>>>>> theirs
  withDefaults(
    defineProps<{
<<<<<<< ours
      tag?: "div" | "article" | "section";
<<<<<<< ours
||||||| ancestor
      title?: string;
      showCursor?: boolean;
=======
      tag?: "div" | "article" | "section";
      title?: string;
      showCursor?: boolean;
>>>>>>> theirs
||||||| ancestor
      title?: string;
      showCursor?: boolean;
=======
>>>>>>> theirs
    }>(),
    {
<<<<<<< ours
      tag: "div",
<<<<<<< ours
||||||| ancestor
      title: "terminal",
      showCursor: true,
=======
      tag: "div",
      title: "terminal",
      showCursor: true,
>>>>>>> theirs
||||||| ancestor
      title: "terminal",
      showCursor: true,
=======
>>>>>>> theirs
    }
  );
</script>

<style scoped>
  .base-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    max-width: 100%;
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme),
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    background: var(--color-background-subtle);
    border-bottom: 1px solid var(--color-border);
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme),
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .card-header:hover {
    background: var(--color-surface-hover);
  }

  .card-header:hover ~ .card-body {
    transform: translateY(1px);
  }

  .base-card:has(.card-header:hover) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  .card-body {
    padding: var(--space-6);
<<<<<<< ours
<<<<<<< ours
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    transition:
      color var(--transition-theme),
      transform 0.2s ease;
  }
||||||| ancestor
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    transition:
      color var(--transition-theme),
      transform 0.2s ease;
  }
<<<<<<< ours

  .cursor {
    display: inline-block;
    width: 10px;
    height: 1.2em;
    background: var(--color-primary);
    margin-left: var(--space-1);
    vertical-align: text-bottom;
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
||||||| ancestor
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    transition:
      color var(--transition-theme),
      transform 0.2s ease;
  }

  .cursor {
    display: inline-block;
    width: 10px;
    height: 1.2em;
    background: var(--color-primary);
    margin-left: var(--space-1);
    vertical-align: text-bottom;
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
=======
    transition: transform 0.2s ease;
>>>>>>> theirs
  }
=======
    transition: transform 0.2s ease;
  }
>>>>>>> theirs
||||||| ancestor
=======

>>>>>>> theirs
</style>
