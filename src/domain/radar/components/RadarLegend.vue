<template>
  <div class="radar-legend">
    <div class="legend-item">
      <svg width="36" height="36" viewBox="0 0 36 36" class="legend-icon">
        <circle cx="18" cy="18" r="12" fill="currentColor" />
        <path
          d="M18 36C8.07 36 0 27.93 0 18S8.07 0 18 0c9.92 0 18 8.07 18 18S27.93 36 18 36zM18 3.14C9.81 3.14 3.14 9.81 3.14 18S9.81 32.86 18 32.86S32.86 26.19 32.86 18S26.19 3.14 18 3.14z"
          fill="currentColor"
        />
      </svg>
      <span>New this edition</span>
    </div>

    <div class="legend-item">
      <svg width="36" height="36" viewBox="0 0 36 36" class="legend-icon">
        <circle cx="18" cy="18" r="12" fill="currentColor" />
        <path
          d="M16.5 1.56c0 .86.7 1.56 1.56 1.56c8.16 0 14.8 6.64 14.8 14.8c0 .86.7 1.56 1.56 1.56c.86 0 1.56-.7 1.56-1.56C36 8.04 27.96 0 18.07 0C17.2 0 16.5.7 16.5 1.56z"
          fill="currentColor"
          transform="rotate(-45 18 18)"
        />
      </svg>
      <span>Moved in / out</span>
    </div>

    <div class="legend-item">
      <svg width="36" height="36" viewBox="0 0 36 36" class="legend-icon">
        <circle cx="18" cy="18" r="12" fill="currentColor" />
      </svg>
      <span>No change</span>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .radar-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    justify-content: center;
    padding: var(--space-4) var(--space-6);
    background: var(--color-background-muted);
    border-radius: var(--radius-md);
    margin-top: var(--space-4);
    transition: background-color var(--transition-theme);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .legend-icon {
    color: var(--color-legend-icon);
    transition: color var(--transition-theme);
  }

  .legend-item span {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    transition: color var(--transition-theme);
  }

  @media (--sm) {
    .radar-legend {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }
</style>
