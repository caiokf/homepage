<template>
  <div class="radar-legend">
    <div class="legend-item">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="8" fill="#666" />
        <circle cx="14" cy="14" r="12" fill="none" stroke="#666" stroke-width="2" />
      </svg>
      <span>New this edition</span>
    </div>

    <div class="legend-item">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="8" fill="#666" />
        <path
          d="M7 14 L21 14 M17 10 L21 14 L17 18"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="translate(-3, 0)"
        />
      </svg>
      <span>Moved in</span>
    </div>

    <div class="legend-item">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="8" fill="#666" />
        <path
          d="M21 14 L7 14 M11 10 L7 14 L11 18"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="translate(3, 0)"
        />
      </svg>
      <span>Moved out</span>
    </div>

    <div class="legend-item">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="8" fill="#666" />
      </svg>
      <span>No change</span>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.radar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  padding: 16px 24px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item span {
  font-size: 13px;
  color: #555;
}

@media (max-width: 600px) {
  .radar-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
