<template>
  <g :transform="`translate(${x - 18}, ${y - 18})`">
    <g
      :class="['blip', quadrantPosition, { 'blip-faded': isFaded }]"
      :style="entranceStyle"
      @mouseenter="$emit('hover', blip)"
      @mouseleave="$emit('leave')"
      @click.stop="$emit('click', blip)"
    >
      <!-- Invisible hit area for consistent hover -->
      <circle cx="18" cy="18" r="16" class="blip-hit-area" />

      <!-- Main circle -->
      <circle cx="18" cy="18" r="12" :class="['blip-circle', quadrantPosition]" />

      <!-- Status indicator -->
      <path
        v-if="blip.isNew"
        :d="BlipGeometry.getNewIndicatorPath()"
        :class="['blip-indicator', quadrantPosition]"
        opacity="1"
      />
      <path
        v-else-if="blip.status === 'moved in'"
        :d="BlipGeometry.getMovedInIndicatorPath(quadrantPosition)"
        :class="['blip-indicator', quadrantPosition]"
        opacity="1"
      />
      <path
        v-else-if="blip.status === 'moved out'"
        :d="BlipGeometry.getMovedOutIndicatorPath(quadrantPosition)"
        :class="['blip-indicator', quadrantPosition]"
        opacity="1"
      />

      <!-- Blip number -->
      <text
        x="18"
        y="19"
        class="blip-text"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="10px"
        font-weight="bold"
      >
        {{ blip.blipText }}
      </text>
    </g>
  </g>
</template>

<script setup lang="ts">
  import { computed, type CSSProperties } from "vue";
  import type { PositionedBlip, QuadrantPosition } from "../types";
  import { BlipGeometry } from "../geometry/blip-rendering.geometry";

  type Props = {
    blip: PositionedBlip;
    x: number;
    y: number;
    quadrantPosition: QuadrantPosition;
    blipIndex: number;
    isFaded: boolean;
  };

  const props = defineProps<Props>();

  defineEmits<{
    hover: [blip: PositionedBlip];
    leave: [];
    click: [blip: PositionedBlip];
  }>();

  const entranceStyle = computed<CSSProperties>(() => {
    // Ring index determines base delay (inner = 0, outer = 3)
    const ringDelay = props.blip.ringIndex * 50;
    // Small additional stagger within each ring
    const indexDelay = props.blipIndex * 20;
    const totalDelay = ringDelay + indexDelay;

    return {
      "--entrance-delay": `${totalDelay}ms`,
    } as CSSProperties;
  });
</script>

<style scoped>
  .blip-hit-area {
    fill: transparent;
    pointer-events: all;
  }

  .blip-circle.NE {
    fill: var(--quadrant-NE);
  }

  .blip-circle.NW {
    fill: var(--quadrant-NW);
  }

  .blip-circle.SW {
    fill: var(--quadrant-SW);
  }

  .blip-circle.SE {
    fill: var(--quadrant-SE);
  }

  .blip-indicator {
    fill: none;
    stroke-width: 2;
  }

  .blip-indicator.NE {
    fill: var(--quadrant-NE);
  }

  .blip-indicator.NW {
    fill: var(--quadrant-NW);
  }

  .blip-indicator.SW {
    fill: var(--quadrant-SW);
  }

  .blip-indicator.SE {
    fill: var(--quadrant-SE);
  }

  .blip-text {
    pointer-events: none;
    font-style: normal;
    font-family: var(--font-mono);
    fill: var(--color-text-inverse);
  }

  @keyframes blipEnter {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    60% {
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .blip {
    cursor: pointer;
    transition:
      opacity var(--transition-normal),
      transform var(--transition-fast);
    transform-origin: 18px 18px;
    animation: blipEnter 400ms ease-out backwards;
    animation-delay: var(--entrance-delay, 0ms);
  }

  .blip-faded {
    opacity: 0.3;
  }

  .blip:hover {
    opacity: 1;
    transform: scale(1.15);
  }
</style>
