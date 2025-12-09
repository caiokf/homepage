<template>
  <div class="tech-radar-home">
    <div class="content">
      <h1 class="page-title">tech radar</h1>
      <p class="description">
        The Tech Radar is a tool to visualize technology choices. It provides a snapshot of the
        technologies, tools, languages, and frameworks that are relevant to our engineering work.
      </p>
      <p class="description">
        Items are organized into quadrants (Techniques, Platforms, Tools, and Languages &
        Frameworks) and rings (Adopt, Trial, Assess, and Hold) based on their current recommendation
        status.
      </p>

      <div class="radar-links">
        <div v-if="loading" class="loading-text">[loading versions...]</div>
        <div v-else-if="error" class="error-text">[{{ error }}]</div>
        <template v-else>
          <router-link
            v-for="version in versions"
            :key="version.id"
            :to="`/tech-radar/${encodeURIComponent(version.id)}`"
            class="radar-link"
          >
            <span class="link-text">[{{ version.name }}]</span>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { GoogleSheetsProvider } from "../data/providers/google-sheets-provider";
  import { SampleDataProvider } from "../data/providers/sample-data-provider";
  import type { TechRadarDataProvider, RadarVersion } from "../data/tech-radar-data-provider";
  import { RADAR_SHEET_ID, GOOGLE_API_KEY } from "../config/radar-config";

  const versions = ref<RadarVersion[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Create data provider
  const dataProvider: TechRadarDataProvider =
    RADAR_SHEET_ID && GOOGLE_API_KEY
      ? new GoogleSheetsProvider({ sheetId: RADAR_SHEET_ID, apiKey: GOOGLE_API_KEY })
      : new SampleDataProvider();

  onMounted(async () => {
    try {
      versions.value = await dataProvider.listVersions();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load versions";
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .tech-radar-home {
    min-height: calc(100vh - 112px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
  }

  .content {
    max-width: var(--content-max-width);
    text-align: center;
  }

  .page-title {
    margin-bottom: var(--space-6);
  }

  .description {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }

  .radar-links {
    margin-top: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: center;
  }

  .radar-link {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-primary);
    text-decoration: none;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .radar-link:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }

  .link-text {
    text-transform: lowercase;
  }

  .loading-text,
  .error-text {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    text-transform: lowercase;
  }

  .error-text {
    color: var(--color-error, #ef4444);
  }

  @media (max-width: 768px) {
    .tech-radar-home {
      padding: var(--space-6);
    }

    .description {
      font-size: var(--text-base);
    }

    .radar-link,
    .loading-text,
    .error-text {
      font-size: var(--text-md);
    }
  }
</style>
