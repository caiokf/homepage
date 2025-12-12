<template>
  <div class="experience-page">
    <h1 class="page-title">experience</h1>

    <div class="page-layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">technologies</h3>
        <p class="sidebar-subtitle">last {{ RECENT_YEARS }} years</p>
        <BadgeGroup :items="recentTechnologies" variant="muted" gap="xs" />
      </aside>

      <div class="content">
        <div class="timeline">
          <article
            v-for="(experience, index) in visibleExperiences"
            :key="index"
            class="experience-card"
          >
            <header class="experience-header">
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
              <div class="experience-title">
                <h2 class="company-name">
                  <a
                    v-if="experience.website"
                    :href="experience.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="company-link"
                  >
                    {{ experience.company }}
                  </a>
                  <span v-else>{{ experience.company }}</span>
                </h2>
                <span class="position">
                  {{ experience.position }}
                  <span class="via-text" v-if="experience.via"
                    >&bull; via {{ getViaName(experience.via) }}</span
                  >
                </span>
              </div>
              <div class="experience-meta">
                <div class="date-info">
                  <span class="date-range">{{ formatDateRange(experience) }}</span>
                  <span class="duration">{{ calculateDuration(experience) }}</span>
                </div>
                <BadgeGroup :items="experience.tags" align="end" gap="xs" />
              </div>
            </header>

            <ul class="highlights">
              <li
                v-for="(highlight, hIndex) in experience.highlights"
                :key="hIndex"
                class="highlight-item"
              >
                {{ highlight }}
              </li>
            </ul>

            <footer class="experience-footer">
              <BadgeGroup
                :items="parseTechnologies(experience.technologies)"
                variant="muted"
                size="md"
              />
            </footer>
          </article>

          <div v-if="!showAll" class="show-more-container">
            <button @click="showAll = true" class="show-more-button">
              <span class="show-more-line"
                ><span class="comment-prefix"></span>turns out {{ yearsOfExperience }} years is a
                lot</span
              >
              <span class="show-more-line"
                ><span class="comment-prefix"></span>there's more where that came from</span
              >
              <span class="show-more-line"
                ><span class="comment-prefix"></span>archaeologists, click here</span
              >
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

  const yearsOfExperience = computed(() => {
    const oldestStartDate = experiencesConfig
      .map((exp) => new Date(exp.startDate).getTime())
      .sort((a, b) => a - b)[0];
    const startYear = new Date(oldestStartDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  });

  const visibleExperiences = computed(() => {
    if (showAll.value) {
      return experiencesConfig;
    }
    return experiencesConfig.slice(0, INITIAL_VISIBLE_COUNT);
  });

  const RECENT_YEARS = 5;

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

    let duration = "";
    if (years > 0) {
      duration += `${years} ${years === 1 ? "year" : "years"}`;
    }
    if (remainingMonths > 0) {
      if (duration) duration += ", ";
      duration += `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
    }
    if (!duration) {
      duration = "< 1 month";
    }

    if (!experience.endDate) {
      duration += " (and counting)";
    }

    return duration;
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
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-1) 0;
  }

  .sidebar-title::before {
    content: "// ";
    color: var(--color-primary);
  }

  .sidebar-subtitle {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-4) 0;
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
    gap: var(--space-8);
  }

  .experience-card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-md);
    transition: background-color var(--transition-theme), box-shadow var(--transition-theme);
  }

  .experience-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
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
    width: 58px;
    height: 58px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }

  .via-logo-wrapper {
    flex-shrink: 0;
  }

  .via-logo {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    opacity: 0.8;
  }

  .experience-title {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;
  }

  .company-name {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin: 0;
    color: var(--color-text-primary);
    text-transform: lowercase;
  }

  .company-name::before {
    content: "// ";
    color: var(--color-primary);
  }

  .company-link {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .company-link:hover {
    color: var(--color-primary);
  }

  .position {
    font-family: var(--font-mono);
    font-size: var(--text-base);
    color: var(--color-primary);
    text-transform: lowercase;
    font-weight: var(--font-semibold);
  }

  .via-text {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-transform: lowercase;
  }

  .experience-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
    text-align: right;
  }

  .date-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
  }

  .date-range {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-transform: lowercase;
  }

  .duration {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .highlights {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-4) 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .highlight-item {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    padding-left: var(--space-4);
    position: relative;
  }

  .highlight-item::before {
    content: ">";
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-weight: var(--font-bold);
  }

  .experience-footer {
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .show-more-container {
    display: flex;
    justify-content: center;
    padding: var(--space-6) 0;
  }

  .show-more-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-4);
    text-transform: lowercase;
    transition: color var(--transition-fast);
  }

  .show-more-button:hover {
    color: var(--color-text-primary);
  }

  .show-more-button .comment-prefix {
    color: var(--color-primary);
  }

  .show-more-line {
    display: block;
  }

  @media (max-width: 1024px) {
    .sidebar {
      width: 180px;
    }
  }

  @media (max-width: 768px) {
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

    .experience-header {
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .company-logo {
      width: 50px;
      height: 50px;
    }

    .via-logo {
      width: 26px;
      height: 26px;
    }

    .experience-meta {
      align-items: flex-start;
      text-align: left;
    }

    .date-info {
      flex-direction: row;
      align-items: baseline;
      gap: var(--space-3);
    }

    .duration::before {
      content: "• ";
    }

    .company-name {
      font-size: var(--text-lg);
    }

    .experience-card {
      padding: var(--space-4);
    }
  }
</style>
