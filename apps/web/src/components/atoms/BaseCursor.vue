<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<template>
  <span
    class="base-cursor"
    :class="{ animate }"
    :style="{ animationDelay: `${delay}ms` }"
  ></span>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      delay?: number;
      animate?: boolean;
    }>(),
    {
      delay: 0,
      animate: false,
    }
  );
</script>

<style scoped>
  .base-cursor {
    display: inline-block;
    width: 0.2em;
    height: 1.2em;
    background: var(--color-primary);
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }

  .base-cursor.animate {
    animation: appear 200ms ease-out forwards, blink 1s step-end infinite;
  }

  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
</style>
|||||||
=======
<template>
  <span class="cursor" aria-hidden="true"></span>
</template>

<style scoped>
  .cursor {
    display: inline-block;
    width: 5px;
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
  }
</style>
>>>>>>> theirs
|||||||
=======
<template>
  <span class="cursor" aria-hidden="true"></span>
</template>

<style scoped>
  .cursor {
    display: inline-block;
    width: 5px;
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
  }
</style>
>>>>>>> theirs
|||||||
=======
<template>
  <span class="base-cursor" :class="{ animate }" :style="cursorStyle"></span>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  const props = withDefaults(
    defineProps<{
      delay?: number;
      animate?: boolean;
    }>(),
    {
      delay: 0,
      animate: false,
    }
  );

  const cursorStyle = computed(() =>
    props.delay ? { animationDelay: `${props.delay}ms` } : undefined
  );
</script>

<style scoped>
  .base-cursor {
    display: inline-block;
    width: 10px;
    height: 1.2em;
    background: var(--color-primary);
    margin-left: var(--space-1);
    vertical-align: text-bottom;
  }

  .base-cursor.animate {
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
</style>
>>>>>>> theirs
