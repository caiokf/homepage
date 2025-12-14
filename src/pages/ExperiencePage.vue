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
        <div class="terminal">
          <!-- Terminal header -->
          <div class="terminal-header">
            <div class="window-controls">
              <span class="control close"></span>
              <span class="control minimize"></span>
              <span class="control maximize"></span>
            </div>
            <div class="terminal-title">caio@career ~ % career --list --verbose</div>
          </div>

          <!-- Terminal content -->
          <div class="terminal-body">
            <!-- Command prompt -->
            <div class="prompt-line">
              <span class="prompt">$</span>
              <span class="command">career --list --verbose</span>
            </div>

            <!-- Output header -->
            <div class="output-line blank"></div>
            <div class="output-line">
              <span class="output-accent">Career Summary</span>
            </div>
            <div class="output-line">
              <span class="output-dim">══════════════════════════════════════════════════════════</span>
            </div>
            <div class="output-line">
              <span class="output-label">Total Experience:</span>
              <span class="output-value">{{ yearsOfExperience }} years</span>
            </div>
            <div class="output-line">
              <span class="output-label">Companies:</span>
              <span class="output-value">{{ totalCompanies }}</span>
            </div>
            <div class="output-line">
              <span class="output-label">Current Status:</span>
              <span class="output-success">● EMPLOYED</span>
            </div>
            <div class="output-line blank"></div>

            <!-- Experience entries -->
            <div
              v-for="(experience, index) in visibleExperiences"
              :key="`exp-${experience.slug}-${index}`"
              class="experience-block"
            >
              <!-- ASCII timeline connector -->
              <div class="timeline-connector">
                <span v-if="index === 0" class="connector-char">┌</span>
                <span v-else class="connector-char">├</span>
                <span class="connector-line">────</span>
                <span class="connector-node" :class="{ current: !experience.endDate }">{{
                  !experience.endDate ? "◉" : "○"
                }}</span>
                <span class="connector-line">──</span>
              </div>

              <!-- Experience header -->
              <div class="exp-header">
                <span class="exp-index">[{{ String(index + 1).padStart(2, "0") }}]</span>
                <span class="exp-company">{{ experience.company }}</span>
                <span v-if="!experience.endDate" class="exp-current">(current)</span>
              </div>

              <!-- Experience details -->
              <div class="exp-details">
                <div class="detail-line">
                  <span class="detail-connector">│</span>
                  <span class="detail-label">Role:</span>
                  <span class="detail-value role">{{ experience.position }}</span>
                  <span v-if="experience.via" class="detail-via"
                    >via {{ getViaName(experience.via) }}</span
                  >
                </div>
                <div class="detail-line">
                  <span class="detail-connector">│</span>
                  <span class="detail-label">Period:</span>
                  <span class="detail-value">{{ formatDateRange(experience) }}</span>
                  <span class="detail-duration">({{ calculateDuration(experience) }})</span>
                </div>
                <div class="detail-line">
                  <span class="detail-connector">│</span>
                  <span class="detail-label">Tags:</span>
                  <span class="detail-tags">
                    <span
                      v-for="tag in experience.tags"
                      :key="tag"
                      class="tag"
                      :class="getTagClass(tag)"
                      >[{{ tag }}]</span
                    >
                  </span>
                </div>
                <div class="detail-line">
                  <span class="detail-connector">│</span>
                </div>

                <!-- Highlights as bullet points -->
                <div
                  v-for="(highlight, hIndex) in experience.highlights"
                  :key="`highlight-${hIndex}`"
                  class="detail-line highlight-line"
                >
                  <span class="detail-connector">│</span>
                  <span class="highlight-bullet">→</span>
                  <span class="highlight-text">{{ highlight }}</span>
                </div>

                <div class="detail-line">
                  <span class="detail-connector">│</span>
                </div>

                <!-- Tech stack -->
                <div class="detail-line tech-line">
                  <span class="detail-connector">│</span>
                  <span class="detail-label">Stack:</span>
                  <span class="tech-list">{{
                    parseTechnologies(experience.technologies).join(", ")
                  }}</span>
                </div>

                <!-- Website -->
                <div v-if="experience.website" class="detail-line">
                  <span class="detail-connector">│</span>
                  <span class="detail-label">URL:</span>
                  <a
                    :href="experience.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="detail-link"
                    >{{ experience.website }}</a
                  >
                </div>

                <!-- Separator -->
                <div class="detail-line">
                  <span class="detail-connector">│</span>
                </div>
              </div>
            </div>

            <!-- Show more -->
            <div v-if="!showAll" class="show-more-block">
              <div class="timeline-connector">
                <span class="connector-char">│</span>
              </div>
              <div class="output-line">
                <span class="output-dim">... {{ remainingCount }} more entries hidden ...</span>
              </div>
              <div class="output-line blank"></div>
              <div class="prompt-line">
                <span class="prompt">$</span>
                <button @click="showAll = true" class="show-more-cmd">
                  career --list --all
                  <span class="cursor">▋</span>
                </button>
              </div>
            </div>

            <!-- End of output -->
            <template v-else>
              <div class="timeline-connector">
                <span class="connector-char">└</span>
                <span class="connector-line">────</span>
                <span class="connector-end">■</span>
                <span class="end-label">END OF CAREER LOG</span>
              </div>
              <div class="output-line blank"></div>
              <div class="prompt-line">
                <span class="prompt">$</span>
                <span class="cursor">▋</span>
              </div>
            </template>
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

  const viaNames: Record<string, string> = {
    toptal: "Toptal",
    tw: "ThoughtWorks",
  };

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

  const totalCompanies = computed(() => {
    const companies = new Set(experiencesConfig.map((exp) => exp.company));
    return companies.size;
  });

  const remainingCount = computed(() => {
    return experiencesConfig.length - INITIAL_VISIBLE_COUNT;
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

    return Array.from(techSet).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  });

  function formatDateRange(experience: Experience): string {
    const startDate = new Date(experience.startDate);
    const startStr = formatMonth(startDate);

    if (!experience.endDate) {
      return `${startStr} → present`;
    }

    const endDate = new Date(experience.endDate);
    const endStr = formatMonth(endDate);
    return `${startStr} → ${endStr}`;
  }

  function formatMonth(date: Date): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function calculateDuration(experience: Experience): string {
    const startDate = new Date(experience.startDate);
    const endDate = experience.endDate ? new Date(experience.endDate) : new Date();

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let duration = "";
    if (years > 0) {
      duration += `${years}y`;
    }
    if (remainingMonths > 0) {
      if (duration) duration += " ";
      duration += `${remainingMonths}m`;
    }
    if (!duration) {
      duration = "<1m";
    }

    return duration;
  }

  function parseTechnologies(technologies: string): string[] {
    return technologies.split(",").map((tech) => tech.trim());
  }

  function getTagClass(tag: string): string {
    const classes: Record<string, string> = {
      remote: "tag-remote",
      "on-site": "tag-onsite",
      fintech: "tag-fintech",
      startup: "tag-startup",
      contract: "tag-contract",
      enterprise: "tag-enterprise",
    };
    return classes[tag] || "";
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

  .page-title {
    margin-bottom: var(--space-8);
    text-align: center;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Sidebar */
  .sidebar {
    position: sticky;
    top: calc(56px + var(--space-8));
    width: 200px;
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

  /* Terminal */
  .content {
    flex: 1;
    min-width: 0;
  }

  .terminal {
    background: #1a1a1a;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    border: 1px solid #333;
  }

  .terminal-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: #2d2d2d;
    border-bottom: 1px solid #333;
  }

  .window-controls {
    display: flex;
    gap: 8px;
  }

  .control {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
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

  .terminal-title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: #888;
  }

  .terminal-body {
    padding: var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.6;
    color: #e0e0e0;
    overflow-x: auto;
  }

  /* Prompt and output lines */
  .prompt-line {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .prompt {
    color: #50fa7b;
    font-weight: var(--font-bold);
  }

  .command {
    color: #f8f8f2;
  }

  .output-line {
    padding: 2px 0;
  }

  .output-line.blank {
    height: 1.6em;
  }

  .output-accent {
    color: #8be9fd;
    font-weight: var(--font-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .output-dim {
    color: #6272a4;
  }

  .output-label {
    color: #bd93f9;
    margin-right: var(--space-2);
  }

  .output-value {
    color: #f8f8f2;
  }

  .output-success {
    color: #50fa7b;
  }

  /* Experience block */
  .experience-block {
    margin: var(--space-2) 0;
  }

  /* Timeline connector */
  .timeline-connector {
    display: flex;
    align-items: center;
    color: #6272a4;
    margin-bottom: 4px;
  }

  .connector-char {
    color: #6272a4;
  }

  .connector-line {
    color: #6272a4;
  }

  .connector-node {
    color: #6272a4;
    margin: 0 2px;
  }

  .connector-node.current {
    color: #50fa7b;
  }

  .connector-end {
    color: #ff79c6;
    margin: 0 var(--space-2);
  }

  .end-label {
    color: #6272a4;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Experience header */
  .exp-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-left: var(--space-2);
  }

  .exp-index {
    color: #ffb86c;
  }

  .exp-company {
    color: #ff79c6;
    font-weight: var(--font-bold);
  }

  .exp-current {
    color: #50fa7b;
    font-size: var(--text-xs);
  }

  /* Experience details */
  .exp-details {
    padding-left: var(--space-2);
  }

  .detail-line {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: 2px 0;
  }

  .detail-connector {
    color: #6272a4;
    flex-shrink: 0;
    width: 1ch;
  }

  .detail-label {
    color: #bd93f9;
    min-width: 60px;
    flex-shrink: 0;
  }

  .detail-value {
    color: #f8f8f2;
  }

  .detail-value.role {
    color: #8be9fd;
  }

  .detail-via {
    color: #6272a4;
    font-size: var(--text-xs);
    margin-left: var(--space-2);
  }

  .detail-duration {
    color: #6272a4;
    margin-left: var(--space-2);
  }

  .detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .tag {
    color: #6272a4;
    font-size: var(--text-xs);
  }

  .tag.tag-remote {
    color: #8be9fd;
  }

  .tag.tag-onsite {
    color: #ffb86c;
  }

  .tag.tag-fintech {
    color: #50fa7b;
  }

  .tag.tag-startup {
    color: #ff79c6;
  }

  .tag.tag-contract {
    color: #bd93f9;
  }

  .tag.tag-enterprise {
    color: #f1fa8c;
  }

  .highlight-line {
    padding-left: 0;
  }

  .highlight-bullet {
    color: #50fa7b;
    flex-shrink: 0;
  }

  .highlight-text {
    color: #f8f8f2;
    opacity: 0.9;
  }

  .tech-line {
    flex-wrap: wrap;
  }

  .tech-list {
    color: #f1fa8c;
    opacity: 0.8;
  }

  .detail-link {
    color: #8be9fd;
    text-decoration: none;
  }

  .detail-link:hover {
    text-decoration: underline;
  }

  /* Show more */
  .show-more-block {
    margin-top: var(--space-4);
  }

  .show-more-cmd {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: #f8f8f2;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .show-more-cmd:hover {
    color: #8be9fd;
  }

  .cursor {
    color: #50fa7b;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
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

    .terminal-header {
      padding: var(--space-2) var(--space-3);
    }

    .terminal-title {
      font-size: var(--text-xs);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .terminal-body {
      padding: var(--space-3);
      font-size: var(--text-xs);
    }

    .detail-label {
      min-width: 50px;
    }

    .exp-header {
      flex-wrap: wrap;
    }
  }

  /* Dark theme adjustments - terminal always dark */
  [data-theme="light"] .terminal {
    background: #1a1a1a;
  }

  [data-theme="light"] .terminal-header {
    background: #2d2d2d;
  }
</style>
