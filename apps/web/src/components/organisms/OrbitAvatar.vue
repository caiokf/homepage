<template>
  <div ref="containerRef" class="orbit-avatar" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- Orbit SVG Background -->
    <svg class="orbit-svg" :class="{ 'pulse-active': isPulsing }" viewBox="0 0 400 400" aria-hidden="true">
      <!-- Inner orbit ring (decorative, no nodes) -->
      <g class="orbit-layer orbit-layer-inner">
        <circle cx="200" cy="200" r="80" class="orbit-ring orbit-ring-inner" />
      </g>

      <!-- Middle orbit - ring + 4 nodes -->
      <g class="orbit-layer orbit-layer-middle">
        <circle cx="200" cy="200" r="130" class="orbit-ring orbit-ring-middle" />
        <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('5') }">
          <circle cx="292" cy="108" r="6" />
        </g>
        <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('6') }">
          <circle cx="292" cy="292" r="6" />
        </g>
        <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('7') }">
          <circle cx="108" cy="292" r="6" />
        </g>
        <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('8') }">
          <circle cx="108" cy="108" r="6" />
        </g>
      </g>

      <!-- Outer orbit - ring + 5 nodes -->
      <g class="orbit-layer orbit-layer-outer">
        <circle cx="200" cy="200" r="180" class="orbit-ring orbit-ring-outer" />
        <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('0') }">
          <circle cx="200" cy="20" r="8" />
        </g>
        <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('1') }">
          <circle cx="371" cy="144" r="8" />
        </g>
        <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('2') }">
          <circle cx="306" cy="346" r="8" />
        </g>
        <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('3') }">
          <circle cx="94" cy="346" r="8" />
        </g>
        <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('4') }">
          <circle cx="29" cy="144" r="8" />
        </g>
      </g>
    </svg>

    <!-- Avatar in center -->
    <div class="avatar-wrapper" :class="{ 'pulse-active': isPulsing }" @click="triggerGravitationalPulse">
      <img
        :src="currentAvatarImage"
        alt="Caio Kinzel Filho"
        class="avatar"
        :class="{ 'avatar-entering': !hasEnteredAvatar }"
        @animationend="onAvatarAnimationEnd"
      />
      <div class="pulse-ring pulse-ring-1" :class="{ active: isPulsing }"></div>
      <div class="pulse-ring pulse-ring-2" :class="{ active: isPulsing }"></div>
      <div class="pulse-ring pulse-ring-3" :class="{ active: isPulsing }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
  import avatarImage from "../../assets/images/avatar.png";
  import avatarSunglassesImage from "../../assets/images/avatar-sunglasses.png";

  // Sunglasses avatar for dark-to-light transition
  const showSunglasses = ref(false);
  const currentAvatarImage = computed(() =>
    showSunglasses.value ? avatarSunglassesImage : avatarImage
  );
  let themeObserver: MutationObserver | null = null;

  onMounted(() => {
    themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const html = document.documentElement;
          if (html.classList.contains("theme-to-light")) {
            showSunglasses.value = true;
          } else if (html.classList.contains("theme-to-dark")) {
            showSunglasses.value = false;
          }
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });
  });

  // Orbit node configuration with their base positions
  const orbitNodes = [
    // Outer orbit (r=180) - 5 nodes at 72° intervals
    { id: "0", cx: 200, cy: 20, r: 180, angle: -90 },
    { id: "1", cx: 371, cy: 144, r: 180, angle: -18 },
    { id: "2", cx: 306, cy: 346, r: 180, angle: 54 },
    { id: "3", cx: 94, cy: 346, r: 180, angle: 126 },
    { id: "4", cx: 29, cy: 144, r: 180, angle: 198 },
    // Middle orbit (r=130) - 4 nodes at 90° intervals
    { id: "5", cx: 292, cy: 108, r: 130, angle: -45 },
    { id: "6", cx: 292, cy: 292, r: 130, angle: 45 },
    { id: "7", cx: 108, cy: 292, r: 130, angle: 135 },
    { id: "8", cx: 108, cy: 108, r: 130, angle: -135 },
  ];

  // Reactive state for mouse tracking
  const containerRef = ref<HTMLElement | null>(null);
  const mousePos = reactive({ x: 0, y: 0, active: false });
  const nodeOffsets = reactive<Record<string, { x: number; y: number }>>(
    Object.fromEntries(orbitNodes.map((n) => [n.id, { x: 0, y: 0 }]))
  );

  // Avatar entrance tracking
  const hasEnteredAvatar = ref(false);
  const onAvatarAnimationEnd = (e: AnimationEvent) => {
    if (e.animationName === "avatarEntrance") {
      hasEnteredAvatar.value = true;
    }
  };

  // Gravitational pulse state
  const isPulsing = ref(false);
  const pulseNodeState = reactive<Record<string, { x: number; y: number; vx: number; vy: number }>>(
    Object.fromEntries(orbitNodes.map((n) => [n.id, { x: 0, y: 0, vx: 0, vy: 0 }]))
  );
  let pulseAnimationFrame: number | null = null;

  // Spring physics constants
  const SPRING_STIFFNESS = 0.08;
  const SPRING_DAMPING = 0.85;
  const INITIAL_PULL_STRENGTH = 0.7;

  const triggerGravitationalPulse = () => {
    if (isPulsing.value) return;

    isPulsing.value = true;

    orbitNodes.forEach((node) => {
      const dx = 200 - node.cx;
      const dy = 200 - node.cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pullDistance = distance * INITIAL_PULL_STRENGTH;

      pulseNodeState[node.id] = {
        x: (dx / distance) * pullDistance,
        y: (dy / distance) * pullDistance,
        vx: 0,
        vy: 0,
      };
    });

    animatePulse();

    setTimeout(() => {
      isPulsing.value = false;
    }, 600);
  };

  const animatePulse = () => {
    let allSettled = true;

    orbitNodes.forEach((node) => {
      const state = pulseNodeState[node.id];
      const springForceX = -state.x * SPRING_STIFFNESS;
      const springForceY = -state.y * SPRING_STIFFNESS;

      state.vx = (state.vx + springForceX) * SPRING_DAMPING;
      state.vy = (state.vy + springForceY) * SPRING_DAMPING;
      state.x += state.vx;
      state.y += state.vy;

      nodeOffsets[node.id] = { x: state.x, y: state.y };

      const velocity = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      const displacement = Math.sqrt(state.x * state.x + state.y * state.y);
      if (velocity > 0.1 || displacement > 0.5) {
        allSettled = false;
      }
    });

    if (!allSettled) {
      pulseAnimationFrame = requestAnimationFrame(animatePulse);
    } else {
      orbitNodes.forEach((node) => {
        nodeOffsets[node.id] = { x: 0, y: 0 };
        pulseNodeState[node.id] = { x: 0, y: 0, vx: 0, vy: 0 };
      });
      pulseAnimationFrame = null;
    }
  };

  // Gravitational pull settings
  const ATTRACTION_RADIUS = 100;
  const MAX_PULL = 16;
  const PULL_STRENGTH = 0.4;

  const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;

    mousePos.x = (event.clientX - rect.left) * scaleX;
    mousePos.y = (event.clientY - rect.top) * scaleY;
    mousePos.active = true;

    updateNodeOffsets();
  };

  const handleMouseLeave = () => {
    mousePos.active = false;
    orbitNodes.forEach((node) => {
      nodeOffsets[node.id] = { x: 0, y: 0 };
    });
  };

  const updateNodeOffsets = () => {
    if (!mousePos.active) return;

    orbitNodes.forEach((node) => {
      const dx = mousePos.x - node.cx;
      const dy = mousePos.y - node.cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ATTRACTION_RADIUS && distance > 0) {
        const pullFactor = (1 - distance / ATTRACTION_RADIUS) * PULL_STRENGTH;
        const pull = Math.min(pullFactor * MAX_PULL, MAX_PULL);

        nodeOffsets[node.id] = {
          x: (dx / distance) * pull,
          y: (dy / distance) * pull,
        };
      } else {
        nodeOffsets[node.id] = { x: 0, y: 0 };
      }
    });
  };

  const getNodeTransform = (nodeId: string) => {
    const offset = nodeOffsets[nodeId];
    if (!offset || (offset.x === 0 && offset.y === 0)) return undefined;
    return `translate(${offset.x}px, ${offset.y}px)`;
  };

  onUnmounted(() => {
    if (pulseAnimationFrame) {
      cancelAnimationFrame(pulseAnimationFrame);
    }
    if (themeObserver) {
      themeObserver.disconnect();
    }
  });
</script>

<style scoped>
  .orbit-avatar {
    position: relative;
    width: 320px;
    height: 320px;
    flex-shrink: 0;
  }

  .orbit-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .orbit-layer {
    transform-origin: 200px 200px;
    will-change: transform;
  }

  .orbit-layer-outer {
    animation: orbit-rotate var(--orbit-speed, 60s) linear infinite;
  }

  .orbit-layer-middle {
    animation: orbit-rotate calc(var(--orbit-speed, 60s) * 0.7) linear infinite;
  }

  .orbit-layer-inner {
    animation: orbit-rotate calc(var(--orbit-speed, 60s) * 0.4) linear infinite;
  }

  @keyframes orbit-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .orbit-ring {
    fill: none;
    stroke: var(--color-border);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.5;
  }

  .orbit-ring-inner {
    stroke-dasharray: 2 2;
  }

  .orbit-node {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .pulse-active .orbit-node {
    transition: none;
  }

  .pulse-active .orbit-node circle {
    animation: nodeGlow 600ms ease-out;
  }

  @keyframes nodeGlow {
    0% {
      filter: drop-shadow(0 0 0 currentColor);
    }
    30% {
      filter: drop-shadow(0 0 12px currentColor);
    }
    100% {
      filter: drop-shadow(0 0 0 currentColor);
    }
  }

  .orbit-node circle {
    fill: var(--color-primary);
    opacity: 0.8;
    transition: filter 0.2s ease;
  }

  .orbit-node:hover circle {
    filter: drop-shadow(0 0 6px currentColor);
  }

  .orbit-outer circle {
    fill: var(--color-primary);
  }

  .orbit-middle circle {
    fill: var(--color-primary);
    opacity: 0.6;
  }

  @keyframes avatarEntrance {
    0% {
      opacity: 0;
      transform: scale(0.8);
      filter: drop-shadow(0 0 0 rgba(61, 138, 138, 0));
    }
    60% {
      opacity: 1;
      transform: scale(1.05);
      filter: drop-shadow(0 0 20px rgba(61, 138, 138, 0.6));
    }
    100% {
      opacity: 1;
      transform: scale(1);
      filter: drop-shadow(0 0 12px rgba(61, 138, 138, 0.3));
    }
  }

  .avatar-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .avatar {
    width: 140px;
    height: 140px;
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 3px solid var(--color-primary);
    box-shadow: 0 0 40px #3d8a8a33;
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .avatar.avatar-entering {
    animation: avatarEntrance 800ms ease-out forwards;
  }

  .avatar:hover {
    transform: scale(1.05);
  }

  .avatar:active {
    transform: scale(0.95);
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-primary);
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
    pointer-events: none;
  }

  .pulse-ring.active {
    animation: pulseRingExpand 600ms ease-out forwards;
  }

  .pulse-ring-2.active {
    animation-delay: 80ms;
  }

  .pulse-ring-3.active {
    animation-delay: 160ms;
  }

  @keyframes pulseRingExpand {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
      border-width: 3px;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.8);
      opacity: 0;
      border-width: 1px;
    }
  }
</style>
