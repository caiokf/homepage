<template>
  <div class="tech-radar-home">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="page-title">tech radar</h1>
      <p class="hero-tagline">a personal snapshot of technology choices</p>
      <p class="hero-description">
        Inspired by
        <a href="https://www.thoughtworks.com/radar" target="_blank" rel="noopener">
          ThoughtWorks Technology Radar</a>, this is my personal assessment of technologies, tools, and techniques
        based on hands-on experience. It reflects what I've found effective, what I'm experimenting with,
        and what I've learned to avoid.
      </p>
    </section>

    <!-- Radar Overview - 2 Column Layout -->
    <section class="radar-overview">
      <!-- Quadrants Column -->
      <div class="quadrants-column">
        <h2 class="column-title">quadrants</h2>
        <div class="quadrants-list">
          <article class="quadrant-item quadrant-ai">
            <span class="quadrant-name">ai</span>
            <span class="quadrant-desc">LLMs, ML frameworks, AI-assisted development</span>
          </article>
          <article class="quadrant-item quadrant-techniques">
            <span class="quadrant-name">techniques</span>
            <span class="quadrant-desc">Patterns, architecture, testing strategies</span>
          </article>
          <article class="quadrant-item quadrant-tools">
            <span class="quadrant-name">tools</span>
            <span class="quadrant-desc">IDEs, CLI utilities, productivity enhancers</span>
          </article>
          <article class="quadrant-item quadrant-techstack">
            <span class="quadrant-name">tech-stack</span>
            <span class="quadrant-desc">Languages, frameworks, libraries, platforms</span>
          </article>
        </div>
      </div>

      <!-- Radar Visualization -->
      <div class="radar-visual">
        <svg class="radar-svg" viewBox="0 0 400 400" aria-label="Tech Radar visualization">
          <!-- Rings -->
          <circle cx="200" cy="200" r="190" class="ring ring-avoid" />
          <circle cx="200" cy="200" r="145" class="ring ring-learning" />
          <circle cx="200" cy="200" r="100" class="ring ring-experimental" />
          <circle cx="200" cy="200" r="55" class="ring ring-proven" />

          <!-- Quadrant dividers -->
          <line x1="200" y1="10" x2="200" y2="390" class="divider" />
          <line x1="10" y1="200" x2="390" y2="200" class="divider" />

          <!-- Quadrant labels -->
          <text x="105" y="105" class="quadrant-label label-nw">ai</text>
          <text x="280" y="105" class="quadrant-label label-ne">techniques</text>
          <text x="105" y="310" class="quadrant-label label-sw">tools</text>
          <text x="270" y="310" class="quadrant-label label-se">tech-stack</text>

          <!-- Decorative blips -->
          <circle cx="180" cy="185" r="4" class="blip blip-nw" />
          <circle cx="165" cy="160" r="4" class="blip blip-nw" />
          <circle cx="140" cy="130" r="4" class="blip blip-nw" />
          <circle cx="120" cy="100" r="4" class="blip blip-nw" />

          <circle cx="225" cy="180" r="4" class="blip blip-ne" />
          <circle cx="250" cy="155" r="4" class="blip blip-ne" />
          <circle cx="270" cy="120" r="4" class="blip blip-ne" />
          <circle cx="300" cy="85" r="4" class="blip blip-ne" />

          <circle cx="175" cy="220" r="4" class="blip blip-sw" />
          <circle cx="150" cy="250" r="4" class="blip blip-sw" />
          <circle cx="125" cy="280" r="4" class="blip blip-sw" />
          <circle cx="100" cy="310" r="4" class="blip blip-sw" />

          <circle cx="220" cy="225" r="4" class="blip blip-se" />
          <circle cx="245" cy="255" r="4" class="blip blip-se" />
          <circle cx="275" cy="285" r="4" class="blip blip-se" />
          <circle cx="310" cy="320" r="4" class="blip blip-se" />
        </svg>
      </div>

      <!-- Rings Column -->
      <div class="rings-column">
        <h2 class="column-title">rings</h2>
        <div class="rings-list">
          <article class="ring-item ring-proven">
            <span class="ring-dot"></span>
            <div class="ring-text">
              <span class="ring-name">proven</span>
              <span class="ring-desc">Battle-tested in production, confident recommendations</span>
            </div>
          </article>
          <article class="ring-item ring-experimental">
            <span class="ring-dot"></span>
            <div class="ring-text">
              <span class="ring-name">experimental</span>
              <span class="ring-desc">Testing in production for smaller, non-critical features</span>
            </div>
          </article>
          <article class="ring-item ring-learning">
            <span class="ring-dot"></span>
            <div class="ring-text">
              <span class="ring-name">learning</span>
              <span class="ring-desc">Personal projects and exploration, not production-ready</span>
            </div>
          </article>
          <article class="ring-item ring-avoid">
            <span class="ring-dot"></span>
            <div class="ring-text">
              <span class="ring-name">avoid</span>
              <span class="ring-desc">Seen fail or don't align with how I work</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Primary CTA Section -->
    <section class="cta-section">
      <div v-if="loading" class="loading-state">
        <span class="loading-dot"></span>
        <span class="loading-text">loading radar...</span>
      </div>
      <div v-else-if="error" class="error-state">
        <span class="error-text">{{ error }}</span>
      </div>
      <template v-else-if="versions.length > 0">
        <router-link
          :to="`/tech-radar/${encodeURIComponent(versions[0].id)}`"
          class="primary-cta"
        >
          <span class="cta-text">explore the radar</span>
          <span class="cta-version">{{ versions[0].name }}</span>
          <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </router-link>

        <!-- Other versions (expandable) -->
        <div v-if="versions.length > 1" class="other-versions">
          <button
            class="versions-toggle"
            :aria-expanded="showOtherVersions"
            @click="showOtherVersions = !showOtherVersions"
          >
            <span>previous versions</span>
            <svg
              class="toggle-icon"
              :class="{ expanded: showOtherVersions }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div v-if="showOtherVersions" class="versions-list">
            <router-link
              v-for="version in versions.slice(1)"
              :key="version.id"
              :to="`/tech-radar/${encodeURIComponent(version.id)}`"
              class="version-link"
            >
              {{ version.name }}
            </router-link>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { DataProviderGoogleSheets } from "../domain/radar/data-providers/data-provider-google-sheets";
  import { DataProviderSample } from "../domain/radar/data-providers/data-provider-sample";
  import type { TechRadarDataProvider, RadarVersion } from "../domain/radar/data-providers/data-provider";
  import { RADAR_SHEET_ID, GOOGLE_API_KEY } from "../domain/radar/constants";

  const versions = ref<RadarVersion[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const showOtherVersions = ref(false);

  const dataProvider: TechRadarDataProvider =
    RADAR_SHEET_ID && GOOGLE_API_KEY
      ? new DataProviderGoogleSheets({ sheetId: RADAR_SHEET_ID, apiKey: GOOGLE_API_KEY })
      : new DataProviderSample();

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
    padding: var(--space-8);
  }

  /* Hero Section */
  .hero {
    max-width: var(--content-max-width);
    margin: 0 auto var(--space-8) auto;
    text-align: center;
  }

  .page-title {
    margin-bottom: var(--space-2);
  }

  .hero-tagline {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-4) 0;
  }

  .hero-description {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .hero-description a {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* Radar Overview - 3 Column Layout */
  .radar-overview {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--space-6);
    max-width: 1100px;
    margin: 0 auto var(--space-8) auto;
    align-items: center;
  }

  .column-title {
    font-family: var(--font-mono);
    font-size: var(--text-md);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-4) 0;
  }

  .column-title::before {
    content: "// ";
    color: var(--color-primary);
  }

  /* Quadrants Column */
  .quadrants-column {
    justify-self: end;
  }

  .quadrants-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .quadrant-item {
    text-align: right;
  }

  .quadrant-name {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    text-transform: lowercase;
  }

  .quadrant-ai .quadrant-name {
    color: var(--quadrant-NW);
  }

  .quadrant-techniques .quadrant-name {
    color: var(--quadrant-NE);
  }

  .quadrant-tools .quadrant-name {
    color: var(--quadrant-SW);
  }

  .quadrant-techstack .quadrant-name {
    color: var(--quadrant-SE);
  }

  .quadrant-desc {
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-normal);
  }

  /* Radar Visualization */
  .radar-visual {
    width: 320px;
    aspect-ratio: 1;
    flex-shrink: 0;
  }

  .radar-svg {
    width: 100%;
    height: 100%;
  }

  .ring {
    fill: none;
    stroke: var(--color-border);
    stroke-width: 1;
  }

  .ring-proven {
    fill: var(--ring-0);
  }

  .ring-experimental {
    fill: var(--ring-1);
  }

  .ring-learning {
    fill: var(--ring-2);
  }

  .ring-avoid {
    fill: var(--ring-3);
  }

  .divider {
    stroke: var(--color-background);
    stroke-width: 4;
  }

  .quadrant-label {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: var(--font-semibold);
    text-transform: lowercase;
    text-anchor: middle;
  }

  .label-nw {
    fill: var(--quadrant-NW);
  }

  .label-ne {
    fill: var(--quadrant-NE);
  }

  .label-sw {
    fill: var(--quadrant-SW);
  }

  .label-se {
    fill: var(--quadrant-SE);
  }

  .blip {
    opacity: 0.8;
  }

  .blip-nw {
    fill: var(--quadrant-NW);
  }

  .blip-ne {
    fill: var(--quadrant-NE);
  }

  .blip-sw {
    fill: var(--quadrant-SW);
  }

  .blip-se {
    fill: var(--quadrant-SE);
  }

  /* Rings Column */
  .rings-column {
    justify-self: start;
  }

  .rings-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .ring-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .ring-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    border: 2px solid;
    flex-shrink: 0;
    margin-top: 3px;
  }

  .ring-proven .ring-dot {
    border-color: var(--color-primary);
    background: var(--color-primary);
  }

  .ring-experimental .ring-dot {
    border-color: var(--color-primary);
    background: transparent;
  }

  .ring-learning .ring-dot {
    border-color: var(--color-text-muted);
    background: transparent;
  }

  .ring-avoid .ring-dot {
    border-color: var(--color-error);
    background: transparent;
  }

  .ring-text {
    display: flex;
    flex-direction: column;
  }

  .ring-name {
    font-family: var(--font-mono);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
  }

  .ring-desc {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-normal);
  }

  /* Section Styles */
  .section-title {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-3) 0;
    text-align: center;
  }

  .section-title::before {
    content: "## ";
    color: var(--color-primary);
  }

  .section-intro {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    color: var(--color-text-secondary);
    text-align: center;
    max-width: 600px;
    margin: 0 auto var(--space-6) auto;
  }

  /* CTA Section */
  .cta-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }

  .primary-cta {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-8);
    background: var(--color-primary);
    color: var(--color-text-inverse);
    text-decoration: none;
    border-radius: var(--radius-md);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast),
      background-color var(--transition-fast);
  }

  .primary-cta:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: var(--color-primary-hover);
    color: var(--color-text-inverse);
  }

  .cta-text {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    text-transform: lowercase;
  }

  .cta-version {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    opacity: 0.8;
    padding: var(--space-1) var(--space-2);
    background: rgba(255, 255, 255, 0.15);
    border-radius: var(--radius-sm);
  }

  .cta-arrow {
    width: 24px;
    height: 24px;
    transition: transform var(--transition-fast);
  }

  .primary-cta:hover .cta-arrow {
    transform: translateX(4px);
  }

  /* Other Versions */
  .other-versions {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--space-2);
  }

  .versions-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-transform: lowercase;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    transition:
      color var(--transition-fast),
      background var(--transition-fast);
  }

  .versions-toggle:hover {
    color: var(--color-text-secondary);
    background: var(--color-surface-hover);
  }

  .toggle-icon {
    width: 16px;
    height: 16px;
    transition: transform var(--transition-fast);
  }

  .toggle-icon.expanded {
    transform: rotate(180deg);
  }

  .versions-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-2);
    padding: var(--space-3);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .version-link {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-primary);
    text-decoration: none;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
  }

  .version-link:hover {
    background: var(--color-surface-hover);
  }

  .loading-state {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .loading-dot {
    width: 8px;
    height: 8px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }

  .loading-text,
  .error-text {
    font-family: var(--font-mono);
    font-size: var(--text-md);
    color: var(--color-text-secondary);
    text-transform: lowercase;
  }

  .error-text {
    color: var(--color-error);
  }

  /* Responsive - Tablet */
  @media (--lg) {
    .radar-overview {
      grid-template-columns: 1fr;
      gap: var(--space-8);
      max-width: 500px;
    }

    .quadrants-column {
      justify-self: center;
      order: 2;
    }

    .quadrants-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    .quadrant-item {
      text-align: center;
    }

    .radar-visual {
      order: 1;
      justify-self: center;
    }

    .rings-column {
      justify-self: center;
      order: 3;
    }

    .rings-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    .column-title {
      text-align: center;
    }
  }

  /* Responsive - Mobile */
  @media (--md) {
    .tech-radar-home {
      padding: var(--space-6);
    }

    .hero {
      margin-bottom: var(--space-6);
    }

    .hero-tagline {
      font-size: var(--text-md);
    }

    .hero-description {
      font-size: var(--text-base);
    }

    .radar-overview {
      gap: var(--space-6);
    }

    .radar-visual {
      width: 280px;
    }

    .section-title {
      font-size: var(--text-lg);
    }

    .section-intro {
      font-size: var(--text-base);
    }

    .primary-cta {
      padding: var(--space-4) var(--space-6);
    }

    .cta-text {
      font-size: var(--text-lg);
    }
  }

  @media (--sm) {
    .primary-cta {
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-5);
      text-align: center;
    }

    .cta-arrow {
      display: none;
    }

    .cta-text {
      font-size: var(--text-md);
    }
    .quadrants-list,
    .rings-list {
      grid-template-columns: 1fr;
    }

    .radar-visual {
      width: 240px;
    }

    .quadrant-label {
      font-size: 10px;
    }
  }
</style>
