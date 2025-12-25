<template>
  <div class="experience-page">
    <h1 class="page-title">experience</h1>

    <div class="page-layout">
      <aside class="sidebar" aria-label="Summary">
        <div class="sidebar-section">
          <h2 class="sidebar-title">
            companies<span class="sidebar-title-suffix"> (last {{ RECENT_YEARS }} years)</span>
          </h2>
          <p class="sidebar-subtitle">last {{ RECENT_YEARS }} years</p>
          <BadgeGroup :items="recentCompanyTags" gap="xs" />
        </div>

        <div class="sidebar-section">
          <h2 class="sidebar-title">
            technologies<span class="sidebar-title-suffix"> (last {{ RECENT_YEARS }} years)</span>
          </h2>
          <p class="sidebar-subtitle">last {{ RECENT_YEARS }} years</p>
          <BadgeGroup :items="recentTechnologies" variant="muted" gap="xs" />
        </div>
      </aside>

      <div class="content">
        <div class="timeline">
          <article
            v-for="(experience, index) in visibleExperiences"
            :key="index"
            class="experience-card"
            :style="{ '--card-delay': `${index * 100}ms` }"
          >
            <!-- App Window Header -->
            <header class="card-header">
              <div class="window-controls">
                <span class="control close"></span>
                <span class="control minimize"></span>
                <span class="control maximize"></span>
              </div>
              <div class="card-meta">
                <span class="meta-date">{{ formatDateRange(experience) }}</span>
                <span class="meta-duration">{{ calculateDuration(experience) }}</span>
              </div>
            </header>

            <!-- Card Content -->
            <div class="card-content">
              <!-- Company Info Section -->
              <div class="info-section">
                <div class="info-row">
                  <div class="logos-wrapper">
                    <div class="company-logo-wrapper" v-if="getCompanyLogo(experience)">
                      <img
                        :src="getCompanyLogo(experience)"
                        :alt="experience.company"
                        class="company-logo"
                      />
                    </div>
                    <div class="via-logo-wrapper" v-if="experience.via && getViaLogo(experience.via)">
                      <img :src="getViaLogo(experience.via)" :alt="experience.via" class="via-logo" />
                    </div>
                  </div>
                  <div class="company-info">
                    <h2 class="company-name">
                      <a
                        v-if="experience.website"
                        :href="experience.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="company-link"
                        :title="`Visit ${experience.company} website (opens in new tab)`"
                      >
                        {{ experience.company }}
                      </a>
                      <span v-else>{{ experience.company }}</span>
                    </h2>
                    <div class="position-row">
                      <span class="position">{{ experience.position }}</span>
                      <span class="via-text" v-if="experience.via">
                        via {{ getViaName(experience.via) }}
                      </span>
                    </div>
                  </div>
                  <div class="tags-wrapper">
                    <BadgeGroup :items="experience.tags" gap="xs" align="end" />
                  </div>
                </div>
              </div>

              <!-- Highlights -->
              <div class="highlights-section">
                <ul class="highlights">
                  <li
                    v-for="(highlight, hIndex) in experience.highlights"
                    :key="hIndex"
                    class="highlight-item"
                  >
                    {{ highlight }}
                  </li>
                </ul>
              </div>

              <!-- Technologies -->
              <div class="tech-section">
                <BadgeGroup
                  :items="parseTechnologies(experience.technologies)"
                  variant="muted"
                  size="md"
                />
              </div>
            </div>
          </article>

          <div v-if="!showAll" class="show-more-container">
            <button @click="showAll = true" class="terminal-button" aria-label="Show all experiences">
              <span class="terminal-prompt">$</span>
              <span class="terminal-command">history</span>
              <span class="terminal-flag">--all</span>
              <BaseCursor />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { experiencesConfig, type Experience } from "../domain/experience/data";
  import BadgeGroup from "../components/molecules/BadgeGroup.vue";
  import BaseCursor from "../components/atoms/BaseCursor.vue";

  // Dynamically import all logos from assets/logos
  const logoModules = import.meta.glob("../assets/logos/*.jpeg", {
    eager: true,
    import: "default",
  });

  // Build a map from slug to logo URL
  const companyLogos: Record<string, string> = {};
  for (const path in logoModules) {
    const slug = path.replace("../assets/logos/", "").replace(".jpeg", "");
    companyLogos[slug] = logoModules[path] as string;
  }

  function getCompanyLogo(experience: Experience): string | undefined {
    return companyLogos[experience.slug];
  }

  // Via company logos and names mapping
  const viaLogos: Record<string, string> = {
    toptal: companyLogos["toptal"],
    tw: companyLogos["thoughtworks"],
  };

  const viaNames: Record<string, string> = {
    toptal: "Toptal",
    tw: "ThoughtWorks",
  };

  function getViaLogo(via: string): string | undefined {
    return viaLogos[via];
  }

  function getViaName(via: string): string {
    return viaNames[via] || via;
  }

  const INITIAL_VISIBLE_COUNT = 6;
  const showAll = ref(false);

  const visibleExperiences = computed(() => {
    if (showAll.value) {
      return experiencesConfig;
    }
    return experiencesConfig.slice(0, INITIAL_VISIBLE_COUNT);
  });

  const RECENT_YEARS = 5;

  const recentCompanyTags = computed(() => {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - RECENT_YEARS);

    const tagSet = new Set<string>();

    experiencesConfig.forEach((exp) => {
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      if (endDate >= cutoffDate) {
        exp.tags.forEach((tag) => tagSet.add(tag));
      }
    });

    return Array.from(tagSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  });

  const recentTechnologies = computed(() => {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - RECENT_YEARS);

    const techSet = new Set<string>();

    experiencesConfig.forEach((exp) => {
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      if (endDate >= cutoffDate) {
        parseTechnologies(exp.technologies).forEach((tech) => techSet.add(tech));
      }
    });

    return Array.from(techSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  });

  function formatDateRange(experience: Experience): string {
    const startDate = new Date(experience.startDate);
    const startStr = formatMonth(startDate);

    if (!experience.endDate) {
      return `${startStr} - present`;
    }

    const endDate = new Date(experience.endDate);
    const endStr = formatMonth(endDate);
    return `${startStr} - ${endStr}`;
  }

  function formatMonth(date: Date): string {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    return `${months[date.getMonth()]}/${date.getFullYear()}`;
  }

  function calculateDuration(experience: Experience): string {
    const startDate = new Date(experience.startDate);
    const endDate = experience.endDate ? new Date(experience.endDate) : new Date();

    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years}y`;
    } else if (remainingMonths > 0) {
      return `${remainingMonths}m`;
    }
    return "< 1m";
  }

  function parseTechnologies(technologies: string): string[] {
    return technologies.split(",").map((tech) => tech.trim());
  }
</script>

<style scoped>
  .experience-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  .page-layout {
    display: flex;
    gap: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }

  .sidebar {
    position: sticky;
    top: calc(56px + var(--space-8));
    width: 220px;
    flex-shrink: 0;
    height: fit-content;
  }

  .sidebar-title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-muted);
    text-transform: lowercase;
    margin: 0 0 var(--space-1) 0;
  }

  .sidebar-subtitle {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-4) 0;
  }

  .sidebar-title-suffix {
    display: none;
    font-weight: var(--font-normal);
  }

  .sidebar-section {
    margin-bottom: var(--space-6);
  }

  .sidebar-section:last-child {
    margin-bottom: 0;
  }

  .content {
    flex: 1;
    max-width: var(--content-max-width);
  }

  .page-title {
    margin-bottom: var(--space-8);
    text-align: center;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  /* Card entrance animation */
  @keyframes cardSlideUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* App Window Card Styling */
  .experience-card {
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    transition:
      background-color var(--transition-theme),
      box-shadow 0.2s ease,
      transform 0.2s ease;
    animation: cardSlideUp 500ms ease-out backwards;
    animation-delay: var(--card-delay, 0ms);
  }

  .experience-card:hover {
    box-shadow: var(--shadow-xl);
  }

  .experience-card:has(.card-header:hover) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  /* Card Header - Window Chrome */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: 0;
    transition: background-color 0.2s ease;
  }

  .card-header:hover {
    background: var(--color-surface-hover);
  }

  .window-controls {
    display: flex;
    gap: 8px;
    padding: var(--space-3) var(--space-4);
  }

  .control {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    background: var(--color-border);
  }

  .control.close {
    background: #ff5f57;
  }

  .control.minimize {
    background: #febc2e;
  }

  .control.maximize {
    background: #28c840;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
  }

  .meta-date {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .meta-duration {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
  }

  /* Card Content */
  .card-content {
    padding: var(--space-5);
  }

  /* Info Section */
  .info-section {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-3);
  }

  .logos-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .company-logo-wrapper {
    flex-shrink: 0;
  }

  .company-logo {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-md);
    object-fit: cover;
    border: 2px solid var(--color-border);
  }

  .via-logo-wrapper {
    flex-shrink: 0;
  }

  .via-logo {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    opacity: 0.8;
    border: 1px solid var(--color-border);
  }

  .company-info {
    flex: 1;
    min-width: 0;
  }

  .company-name {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin: 0 0 var(--space-1) 0;
    color: var(--color-text-primary);
    text-transform: lowercase;
  }

  .company-link {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .company-link:hover {
    color: var(--color-primary);
  }

  .position-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .position {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-primary);
    text-transform: lowercase;
    font-weight: var(--font-medium);
  }

  .via-text {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: lowercase;
  }

  .via-text::before {
    content: "• ";
  }

  .tags-wrapper {
    flex-shrink: 0;
    max-width: 200px;
  }

  /* Highlights */
  .highlights-section {
    margin-bottom: var(--space-4);
  }

  .highlights {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .highlight-item {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    padding-left: var(--space-5);
    position: relative;
  }

  .highlight-item::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-weight: var(--font-normal);
  }

  /* Tech Section */
  .tech-section {
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  /* Terminal Button */
  .show-more-container {
    display: flex;
    justify-content: center;
    padding: var(--space-6) 0;
  }

  .terminal-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    padding: var(--space-3) var(--space-4);
    transition: all var(--transition-fast);
  }

  .terminal-button:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
  }

  .terminal-prompt {
    color: var(--color-primary);
    font-weight: var(--font-semibold);
  }

  .terminal-command {
    color: var(--color-text-primary);
  }

  .terminal-flag {
    color: var(--color-text-muted);
  }

  .terminal-button :deep(.base-cursor) {
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .terminal-button:hover :deep(.base-cursor) {
    opacity: 1;
  }

  /* Responsive */
  @media (--lg) {
    .sidebar {
      width: 180px;
    }
  }

  @media (--md) {
    .experience-page {
      padding: var(--space-6);
    }

    .page-layout {
      flex-direction: column;
    }

    .sidebar {
      position: static;
      width: 100%;
    }

    .sidebar-title-suffix {
      display: inline;
    }

    .sidebar-subtitle {
      display: none;
    }

    .info-row {
      flex-wrap: wrap;
    }

    .company-logo {
      width: 44px;
      height: 44px;
    }

    .via-logo {
      width: 24px;
      height: 24px;
    }

    .tags-wrapper {
      order: 1;
      width: 100%;
      max-width: none;
      margin-top: var(--space-2);
    }

    .tags-wrapper :deep(.badge-group) {
      justify-content: flex-start;
    }

    .company-name {
      font-size: var(--text-base);
    }

    .card-content {
      padding: var(--space-4);
    }
  }

  @media (--sm) {
    .window-controls {
      display: none;
    }

    .card-meta {
      width: 100%;
      justify-content: center;
    }

    .info-row {
      gap: var(--space-3);
    }

    .logos-wrapper {
      gap: var(--space-1);
    }
  }
</style>
