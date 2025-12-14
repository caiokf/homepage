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

    <!-- Mini Radar Visualization -->
    <section class="radar-visual">
      <div class="radar-container">
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

          <!-- Ring labels (on right side) -->
          <text x="200" y="175" class="ring-label">proven</text>
          <text x="200" y="130" class="ring-label">experimental</text>
          <text x="200" y="85" class="ring-label">learning</text>
          <text x="200" y="35" class="ring-label">avoid</text>

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
    </section>

    <!-- Quadrants Section -->
    <section class="quadrants-section">
      <h2 class="section-title">the quadrants</h2>
      <p class="section-intro">
        Technologies are organized into four quadrants based on their nature and purpose.
      </p>

      <div class="quadrants-grid">
        <article class="quadrant-card quadrant-ai">
          <div class="quadrant-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
              <circle cx="8" cy="14" r="1" fill="currentColor" />
              <circle cx="16" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>
          <h3 class="quadrant-title">ai</h3>
          <p class="quadrant-description">
            Artificial intelligence tools, LLMs, machine learning frameworks, and AI-assisted development.
            From code assistants to autonomous agents.
          </p>
        </article>

        <article class="quadrant-card quadrant-techniques">
          <div class="quadrant-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h3 class="quadrant-title">techniques</h3>
          <p class="quadrant-description">
            Methodologies, patterns, and practices for building software. Architecture decisions,
            testing strategies, and development workflows.
          </p>
        </article>

        <article class="quadrant-card quadrant-tools">
          <div class="quadrant-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M7 8l3 3-3 3" />
              <path d="M13 14h4" />
            </svg>
          </div>
          <h3 class="quadrant-title">tools</h3>
          <p class="quadrant-description">
            Developer tools, IDEs, CLI utilities, and productivity enhancers. The software that
            helps build better software.
          </p>
        </article>

        <article class="quadrant-card quadrant-techstack">
          <div class="quadrant-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 class="quadrant-title">tech-stack</h3>
          <p class="quadrant-description">
            Languages, frameworks, libraries, and platforms. The building blocks that form
            the foundation of applications.
          </p>
        </article>
      </div>
    </section>

    <!-- Rings Section -->
    <section class="rings-section">
      <h2 class="section-title">the rings</h2>
      <p class="section-intro">
        Each technology is placed on a ring that reflects my confidence and recommendation level.
      </p>

      <div class="rings-list">
        <article class="ring-card ring-proven">
          <div class="ring-indicator">
            <span class="ring-dot"></span>
          </div>
          <div class="ring-content">
            <h3 class="ring-title">proven</h3>
            <p class="ring-description">
              Battle-tested in production. These are technologies I've used extensively in real-world
              applications and can confidently recommend. I know their strengths, edge cases, and
              how to make them work at scale.
            </p>
          </div>
        </article>

        <article class="ring-card ring-experimental">
          <div class="ring-indicator">
            <span class="ring-dot"></span>
          </div>
          <div class="ring-content">
            <h3 class="ring-title">experimental</h3>
            <p class="ring-description">
              Testing the waters. Running in production for smaller features and non-mission-critical
              systems. Promising enough to invest in, but still gathering evidence before full commitment.
            </p>
          </div>
        </article>

        <article class="ring-card ring-learning">
          <div class="ring-indicator">
            <span class="ring-dot"></span>
          </div>
          <div class="ring-content">
            <h3 class="ring-title">learning</h3>
            <p class="ring-description">
              Personal projects and exploration. Technologies I'm actively studying and testing to
              understand their potential. Not yet ready for production, but showing promise to be
              more effective than my current tools.
            </p>
          </div>
        </article>

        <article class="ring-card ring-avoid">
          <div class="ring-indicator">
            <span class="ring-dot"></span>
          </div>
          <div class="ring-content">
            <h3 class="ring-title">avoid</h3>
            <p class="ring-description">
              Proceed with caution. Technologies I've seen fail, accelerate project failures, or
              simply don't align with how I work. Some are personal preference; others are hard-learned
              lessons from real experience.
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Explore Section -->
    <section class="explore-section">
      <h2 class="section-title">explore the radar</h2>
      <p class="section-intro">
        Dive into the detailed view to see specific technologies and their placement on my radar.
      </p>

      <div class="radar-links">
        <div v-if="loading" class="loading-state">
          <span class="loading-dot"></span>
          <span class="loading-text">loading versions...</span>
        </div>
        <div v-else-if="error" class="error-state">
          <span class="error-text">{{ error }}</span>
        </div>
        <template v-else>
          <router-link
            v-for="version in versions"
            :key="version.id"
            :to="`/tech-radar/${encodeURIComponent(version.id)}`"
            class="radar-link"
          >
            <span class="link-arrow">-&gt;</span>
            <span class="link-text">{{ version.name }}</span>
          </router-link>
        </template>
      </div>
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
    margin: 0 auto var(--space-10) auto;
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
    margin: 0 0 var(--space-6) 0;
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

  /* Radar Visualization */
  .radar-visual {
    max-width: 400px;
    margin: 0 auto var(--space-12) auto;
  }

  .radar-container {
    aspect-ratio: 1;
    position: relative;
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
    font-size: 14px;
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

  .ring-label {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: var(--color-text-muted);
    text-anchor: middle;
    text-transform: lowercase;
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
    margin: 0 auto var(--space-8) auto;
  }

  /* Quadrants Section */
  .quadrants-section {
    max-width: 900px;
    margin: 0 auto var(--space-12) auto;
  }

  .quadrants-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .quadrant-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-5);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .quadrant-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .quadrant-icon {
    width: 40px;
    height: 40px;
    margin-bottom: var(--space-3);
  }

  .quadrant-icon svg {
    width: 100%;
    height: 100%;
  }

  .quadrant-ai .quadrant-icon {
    color: var(--quadrant-NW);
  }

  .quadrant-techniques .quadrant-icon {
    color: var(--quadrant-NE);
  }

  .quadrant-tools .quadrant-icon {
    color: var(--quadrant-SW);
  }

  .quadrant-techstack .quadrant-icon {
    color: var(--quadrant-SE);
  }

  .quadrant-title {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    text-transform: lowercase;
    margin: 0 0 var(--space-2) 0;
  }

  .quadrant-ai .quadrant-title {
    color: var(--quadrant-NW);
  }

  .quadrant-techniques .quadrant-title {
    color: var(--quadrant-NE);
  }

  .quadrant-tools .quadrant-title {
    color: var(--quadrant-SW);
  }

  .quadrant-techstack .quadrant-title {
    color: var(--quadrant-SE);
  }

  .quadrant-description {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* Rings Section */
  .rings-section {
    max-width: var(--content-max-width);
    margin: 0 auto var(--space-12) auto;
  }

  .rings-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .ring-card {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: box-shadow var(--transition-fast);
  }

  .ring-card:hover {
    box-shadow: var(--shadow-sm);
  }

  .ring-indicator {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    padding-top: var(--space-1);
  }

  .ring-dot {
    width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    border: 3px solid;
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

  .ring-content {
    flex: 1;
  }

  .ring-title {
    font-family: var(--font-mono);
    font-size: var(--text-md);
    font-weight: var(--font-semibold);
    text-transform: lowercase;
    margin: 0 0 var(--space-2) 0;
    color: var(--color-text-primary);
  }

  .ring-title::before {
    content: "// ";
    color: var(--color-primary);
  }

  .ring-description {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* Explore Section */
  .explore-section {
    max-width: var(--content-max-width);
    margin: 0 auto;
    text-align: center;
  }

  .radar-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: center;
  }

  .radar-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-primary);
    text-decoration: none;
    padding: var(--space-3) var(--space-5);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast),
      border-color var(--transition-fast);
  }

  .radar-link:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }

  .link-arrow {
    color: var(--color-text-muted);
    transition: transform var(--transition-fast);
  }

  .radar-link:hover .link-arrow {
    transform: translateX(4px);
    color: var(--color-primary);
  }

  .link-text {
    text-transform: lowercase;
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

  /* Responsive */
  @media (--md) {
    .tech-radar-home {
      padding: var(--space-6);
    }

    .hero {
      margin-bottom: var(--space-8);
    }

    .hero-tagline {
      font-size: var(--text-md);
    }

    .hero-description {
      font-size: var(--text-base);
    }

    .radar-visual {
      max-width: 300px;
      margin-bottom: var(--space-10);
    }

    .section-title {
      font-size: var(--text-lg);
    }

    .section-intro {
      font-size: var(--text-base);
    }

    .quadrants-grid {
      grid-template-columns: 1fr;
    }

    .quadrant-card {
      padding: var(--space-4);
    }

    .quadrant-icon {
      width: 32px;
      height: 32px;
    }

    .quadrant-title {
      font-size: var(--text-md);
    }

    .quadrant-description {
      font-size: var(--text-sm);
    }

    .ring-card {
      padding: var(--space-3);
    }

    .ring-title {
      font-size: var(--text-base);
    }

    .ring-description {
      font-size: var(--text-sm);
    }

    .radar-link {
      font-size: var(--text-md);
      padding: var(--space-2) var(--space-4);
    }
  }

  @media (--xs) {
    .quadrant-label {
      font-size: 11px;
    }

    .ring-label {
      font-size: 7px;
    }
  }
</style>
