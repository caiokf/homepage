<template>
  <div class="experience-page">
    <div class="page-layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">technologies</h3>
        <p class="sidebar-subtitle">last {{ RECENT_YEARS }} years</p>
        <div class="tech-cloud">
          <span v-for="tech in recentTechnologies" :key="tech" class="sidebar-tech">
            {{ tech }}
          </span>
        </div>
      </aside>

      <div class="content">
        <h1 class="page-title">experience</h1>

        <div class="timeline">
        <article
          v-for="(experience, index) in experiencesConfig"
          :key="index"
          class="experience-card"
        >
          <header class="experience-header">
            <div class="experience-title">
              <h2 class="company-name">
                <a
                  :href="experience.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="company-link"
                >
                  {{ experience.company }}
                </a>
              </h2>
              <span class="position">{{ experience.position }}</span>
            </div>
            <div class="experience-meta">
              <span class="date-range">{{ formatDateRange(experience) }}</span>
              <span class="duration">{{ calculateDuration(experience) }}</span>
              <div class="experience-tags">
                <span
                  v-for="tag in experience.tags"
                  :key="tag"
                  class="experience-tag"
                >
                  {{ tag }}
                </span>
              </div>
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
            <div class="technologies">
              <span
                v-for="tech in parseTechnologies(experience.technologies)"
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </footer>
        </article>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import {
    experiencesConfig,
    type Experience,
  } from "../config/experience-config";

  const RECENT_YEARS = 8;

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

    return Array.from(techSet).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
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
    padding: var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
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

  .tech-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .sidebar-tech {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    text-transform: lowercase;
  }

  .content {
    flex: 1;
    max-width: 800px;
  }

  .page-title {
    margin-bottom: var(--space-8);
    text-align: center;
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
    transition:
      background-color var(--transition-theme),
      box-shadow var(--transition-theme);
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

  .experience-title {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
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

  .experience-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
    text-align: right;
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

  .experience-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    justify-content: flex-end;
  }

  .experience-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-primary);
    background: var(--color-primary-light);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    text-transform: lowercase;
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

  .technologies {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .tech-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    text-transform: lowercase;
    transition:
      background-color var(--transition-theme),
      color var(--transition-theme);
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
      flex-direction: column;
      gap: var(--space-3);
    }

    .experience-meta {
      align-items: flex-start;
      text-align: left;
    }

    .company-name {
      font-size: var(--text-lg);
    }

    .experience-card {
      padding: var(--space-4);
    }
  }
</style>
