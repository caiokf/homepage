<template>
  <div class="tag-radar">
    <svg :viewBox="`0 0 ${width} ${height}`" class="radar-svg">
      <!-- Background rings -->
      <circle
        v-for="ring in 4"
        :key="ring"
        :cx="centerX"
        :cy="centerY"
        :r="(radius / 4) * ring"
        class="radar-ring"
      />

      <!-- Axis lines -->
      <line
        v-for="(tag, index) in displayTags"
        :key="`axis-${tag.name}`"
        :x1="centerX"
        :y1="centerY"
        :x2="getAxisPoint(index).x"
        :y2="getAxisPoint(index).y"
        class="radar-axis"
      />

      <!-- Data polygon -->
      <polygon
        v-if="displayTags.length > 0"
        :points="polygonPoints"
        class="radar-polygon"
      />

      <!-- Data points -->
      <circle
        v-for="(tag, index) in displayTags"
        :key="`point-${tag.name}`"
        :cx="getDataPoint(tag, index).x"
        :cy="getDataPoint(tag, index).y"
        r="4"
        class="radar-point"
      />

      <!-- Labels -->
      <text
        v-for="(tag, index) in displayTags"
        :key="`label-${tag.name}`"
        :x="getLabelPoint(index).x"
        :y="getLabelPoint(index).y"
        class="radar-label"
        :text-anchor="getLabelAnchor(index)"
      >
        {{ tag.name }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  type TagCount = {
    name: string;
    count: number;
  };

  type Props = {
    tags: TagCount[];
    maxTags?: number;
  };

  const props = withDefaults(defineProps<Props>(), {
    maxTags: 5,
  });

  const width = 280;
  const height = 200;
  const centerX = width / 2;
  const centerY = 80;
  const radius = 50;
  const labelOffset = 12;

  const displayTags = computed(() => props.tags.slice(0, props.maxTags));

  const maxCount = computed(() => {
    if (displayTags.value.length === 0) return 1;
    return Math.max(...displayTags.value.map((t) => t.count));
  });

  function getAxisPoint(index: number): { x: number; y: number } {
    const total = displayTags.value.length;
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  }

  function getDataPoint(tag: TagCount, index: number): { x: number; y: number } {
    const total = displayTags.value.length;
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const ratio = tag.count / maxCount.value;
    const r = radius * ratio;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  }

  function getLabelPoint(index: number): { x: number; y: number } {
    const total = displayTags.value.length;
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = radius + labelOffset;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  }

  function getLabelAnchor(index: number): string {
    const total = displayTags.value.length;
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = Math.cos(angle);
    if (x < -0.1) return "end";
    if (x > 0.1) return "start";
    return "middle";
  }

  const polygonPoints = computed(() => {
    return displayTags.value
      .map((tag, index) => {
        const point = getDataPoint(tag, index);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  });
</script>

<style scoped>
  .tag-radar {
    width: 280px;
    height: 200px;
    flex-shrink: 0;
  }

  .radar-svg {
    width: 100%;
    height: 100%;
  }

  .radar-ring {
    fill: none;
    stroke: var(--color-border);
    stroke-width: 1;
  }

  .radar-axis {
    stroke: var(--color-border);
    stroke-width: 1;
  }

  .radar-polygon {
    fill: oklch(0.55 0.12 145 / 0.3);
    stroke: oklch(0.55 0.12 145);
    stroke-width: 2;
  }

  [data-theme="dark"] .radar-polygon {
    fill: oklch(0.55 0.12 145 / 0.2);
    stroke: oklch(0.65 0.14 145);
  }

  .radar-point {
    fill: oklch(0.5 0.14 145);
  }

  [data-theme="dark"] .radar-point {
    fill: oklch(0.65 0.14 145);
  }

  .radar-label {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: var(--color-text-muted);
    dominant-baseline: middle;
  }

  @media (--md) {
    .tag-radar {
      width: 240px;
      height: 170px;
    }
  }

  @media (--sm) {
    .tag-radar {
      width: 200px;
      height: 145px;
    }

    .radar-label {
      font-size: 8px;
    }
  }
</style>
