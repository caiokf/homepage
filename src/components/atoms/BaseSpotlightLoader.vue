<template>
  <div class="spotlight-container" :style="containerStyle">
    <div class="spotlight spotlight-ne" :style="spotlightStyle"></div>
    <div class="spotlight spotlight-nw" :style="spotlightStyle"></div>
    <div class="spotlight spotlight-sw" :style="spotlightStyle"></div>
    <div class="spotlight spotlight-se" :style="spotlightStyle"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  type Props = {
    size?: number;
  };

  const props = withDefaults(defineProps<Props>(), {
    size: 180,
  });

  // Scale factor based on default size of 180
  const scale = computed(() => props.size / 180);

  const containerStyle = computed(() => ({
    width: `${500 * scale.value}px`,
    height: `${500 * scale.value}px`,
  }));

  const spotlightStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    filter: `blur(${60 * scale.value}px)`,
    "--scale": scale.value,
  }));
</script>

<style scoped>
  .spotlight-container {
    position: relative;
  }

  .spotlight {
    position: absolute;
    border-radius: 50%;
    opacity: 1;
  }

  .spotlight-ne {
    background-color: var(--quadrant-NE);
    animation: dance-ne 8s linear infinite;
  }

  .spotlight-nw {
    background-color: var(--quadrant-NW);
    animation: dance-nw 15s linear infinite;
  }

  .spotlight-sw {
    background-color: var(--quadrant-SW);
    animation: dance-sw 13s linear infinite;
  }

  .spotlight-se {
    background-color: var(--quadrant-SE);
    animation: dance-se 14s linear infinite;
  }

  /* NE: smooth orbit around top-right area */
  @keyframes dance-ne {
    0% {
      transform: translate(calc(280px * var(--scale)), calc(40px * var(--scale))) scale(1);
    }
    12.5% {
      transform: translate(calc(310px * var(--scale)), calc(70px * var(--scale))) scale(1.05);
    }
    25% {
      transform: translate(calc(300px * var(--scale)), calc(110px * var(--scale))) scale(1.08);
    }
    37.5% {
      transform: translate(calc(260px * var(--scale)), calc(130px * var(--scale))) scale(1.05);
    }
    50% {
      transform: translate(calc(220px * var(--scale)), calc(110px * var(--scale))) scale(1);
    }
    62.5% {
      transform: translate(calc(200px * var(--scale)), calc(70px * var(--scale))) scale(0.95);
    }
    75% {
      transform: translate(calc(220px * var(--scale)), calc(30px * var(--scale))) scale(0.92);
    }
    87.5% {
      transform: translate(calc(260px * var(--scale)), calc(20px * var(--scale))) scale(0.95);
    }
    100% {
      transform: translate(calc(280px * var(--scale)), calc(40px * var(--scale))) scale(1);
    }
  }

  /* NW: smooth orbit around top-left area */
  @keyframes dance-nw {
    0% {
      transform: translate(calc(60px * var(--scale)), calc(60px * var(--scale))) scale(1.05);
    }
    12.5% {
      transform: translate(calc(30px * var(--scale)), calc(90px * var(--scale))) scale(1);
    }
    25% {
      transform: translate(calc(20px * var(--scale)), calc(130px * var(--scale))) scale(0.95);
    }
    37.5% {
      transform: translate(calc(40px * var(--scale)), calc(160px * var(--scale))) scale(0.92);
    }
    50% {
      transform: translate(calc(80px * var(--scale)), calc(150px * var(--scale))) scale(0.95);
    }
    62.5% {
      transform: translate(calc(110px * var(--scale)), calc(120px * var(--scale))) scale(1);
    }
    75% {
      transform: translate(calc(100px * var(--scale)), calc(80px * var(--scale))) scale(1.05);
    }
    87.5% {
      transform: translate(calc(70px * var(--scale)), calc(50px * var(--scale))) scale(1.08);
    }
    100% {
      transform: translate(calc(60px * var(--scale)), calc(60px * var(--scale))) scale(1.05);
    }
  }

  /* SW: smooth orbit around bottom-left area */
  @keyframes dance-sw {
    0% {
      transform: translate(calc(50px * var(--scale)), calc(280px * var(--scale))) scale(0.95);
    }
    12.5% {
      transform: translate(calc(30px * var(--scale)), calc(250px * var(--scale))) scale(1);
    }
    25% {
      transform: translate(calc(40px * var(--scale)), calc(210px * var(--scale))) scale(1.05);
    }
    37.5% {
      transform: translate(calc(70px * var(--scale)), calc(190px * var(--scale))) scale(1.08);
    }
    50% {
      transform: translate(calc(110px * var(--scale)), calc(200px * var(--scale))) scale(1.05);
    }
    62.5% {
      transform: translate(calc(130px * var(--scale)), calc(230px * var(--scale))) scale(1);
    }
    75% {
      transform: translate(calc(120px * var(--scale)), calc(270px * var(--scale))) scale(0.95);
    }
    87.5% {
      transform: translate(calc(80px * var(--scale)), calc(290px * var(--scale))) scale(0.92);
    }
    100% {
      transform: translate(calc(50px * var(--scale)), calc(280px * var(--scale))) scale(0.95);
    }
  }

  /* SE: smooth orbit around bottom-right area */
  @keyframes dance-se {
    0% {
      transform: translate(calc(290px * var(--scale)), calc(270px * var(--scale))) scale(1.08);
    }
    12.5% {
      transform: translate(calc(260px * var(--scale)), calc(290px * var(--scale))) scale(1.05);
    }
    25% {
      transform: translate(calc(220px * var(--scale)), calc(280px * var(--scale))) scale(1);
    }
    37.5% {
      transform: translate(calc(200px * var(--scale)), calc(250px * var(--scale))) scale(0.95);
    }
    50% {
      transform: translate(calc(210px * var(--scale)), calc(210px * var(--scale))) scale(0.92);
    }
    62.5% {
      transform: translate(calc(240px * var(--scale)), calc(190px * var(--scale))) scale(0.95);
    }
    75% {
      transform: translate(calc(280px * var(--scale)), calc(200px * var(--scale))) scale(1);
    }
    87.5% {
      transform: translate(calc(310px * var(--scale)), calc(230px * var(--scale))) scale(1.05);
    }
    100% {
      transform: translate(calc(290px * var(--scale)), calc(270px * var(--scale))) scale(1.08);
    }
  }
</style>
