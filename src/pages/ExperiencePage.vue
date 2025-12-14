<template>
  <div class="experience-page">
    <h1 class="page-title">experience</h1>

    <div class="page-layout">
      <aside class="sidebar">
        <div class="terminal-header">
          <span class="terminal-prompt">$</span>
          <span class="terminal-command">git log --oneline</span>
        </div>

        <!-- Quick navigation -->
        <div class="commit-list">
          <button
            v-for="(exp, index) in visibleExperiences"
            :key="`nav-${exp.slug}-${index}`"
            class="commit-nav-item"
            :class="{ active: hoveredIndex === index }"
            @click="scrollToCommit(index)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <span class="nav-hash">{{ getShortHash(exp, index) }}</span>
            <span class="nav-company">{{ exp.company }}</span>
          </button>
        </div>

        <!-- Career stats -->
        <div class="career-stats">
          <div class="stat-line">
            <span class="stat-label">commits:</span>
            <span class="stat-value">{{ totalCompanies }}</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">years:</span>
            <span class="stat-value">{{ yearsOfExperience }}</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">branches:</span>
            <span class="stat-value">{{ uniqueTags.length }}</span>
          </div>
        </div>
      </aside>

      <div class="content">
        <div class="terminal-window">
          <div class="terminal-chrome">
            <div class="window-controls">
              <span class="control close"></span>
              <span class="control minimize"></span>
              <span class="control maximize"></span>
            </div>
            <div class="terminal-title">git log --graph --all</div>
          </div>

          <div class="git-log">
            <article
              v-for="(experience, index) in visibleExperiences"
              :key="`commit-${experience.slug}-${index}`"
              :ref="(el) => setCommitRef(el, index)"
              class="commit-entry"
              :class="{
                highlighted: hoveredIndex === index,
                current: !experience.endDate,
              }"
              @mouseenter="hoveredIndex = index"
              @mouseleave="hoveredIndex = null"
            >
              <!-- Git graph visualization -->
              <div class="git-graph">
                <div class="graph-line top" :class="{ hidden: index === 0 }"></div>
                <div class="graph-node" :class="getBranchColor(experience)">
                  <span v-if="!experience.endDate" class="node-current">*</span>
                  <span v-else class="node-dot"></span>
                </div>
                <div
                  class="graph-line bottom"
                  :class="{ hidden: index === visibleExperiences.length - 1 && showAll }"
                ></div>
              </div>

              <!-- Commit content -->
              <div class="commit-content">
                <!-- Commit header -->
                <div class="commit-header">
                  <span class="commit-keyword">commit</span>
                  <span class="commit-hash">{{ getFullHash(experience, index) }}</span>
                  <span v-if="!experience.endDate" class="head-ref">(HEAD -> main)</span>
                  <span v-if="experience.via" class="branch-ref"
                    >({{ getViaName(experience.via) }})</span
                  >
                </div>

                <!-- Author line -->
                <div class="commit-meta">
                  <span class="meta-label">Author:</span>
                  <span class="meta-value author-value">
                    {{ experience.position }}
                    <a
                      v-if="experience.website"
                      :href="experience.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="company-link"
                      >&lt;{{ experience.company }}&gt;</a
                    >
                    <span v-else>&lt;{{ experience.company }}&gt;</span>
                  </span>
                </div>

                <!-- Date line -->
                <div class="commit-meta">
                  <span class="meta-label">Date:</span>
                  <span class="meta-value date-value">
                    {{ formatGitDate(experience) }}
                    <span class="duration-badge">{{ calculateDuration(experience) }}</span>
                  </span>
                </div>

                <!-- Tags as refs -->
                <div class="commit-refs">
                  <span
                    v-for="tag in experience.tags"
                    :key="tag"
                    class="ref-tag"
                    :class="getTagColor(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Commit message (highlights) -->
                <div class="commit-message">
                  <p
                    v-for="(highlight, hIndex) in experience.highlights"
                    :key="hIndex"
                    class="message-line"
                  >
                    {{ highlight }}
                  </p>
                </div>

                <!-- Diff stat (technologies) -->
                <div class="commit-diff">
                  <div class="diff-header">
                    <span class="diff-files"
                      >{{ parseTechnologies(experience.technologies).length }} technologies</span
                    >
                    <span class="diff-separator">|</span>
                    <span class="diff-insertions"
                      >+{{ Math.floor(Math.random() * 50000) + 10000 }}</span
                    >
                    <span class="diff-deletions"
                      >-{{ Math.floor(Math.random() * 20000) + 5000 }}</span
                    >
                  </div>
                  <div class="tech-badges">
                    <span
                      v-for="tech in parseTechnologies(experience.technologies)"
                      :key="tech"
                      class="tech-badge"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Company logo (subtle) -->
                <div v-if="getCompanyLogo(experience)" class="commit-logo">
                  <img
                    :src="getCompanyLogo(experience)"
                    :alt="experience.company"
                    class="logo-img"
                  />
                </div>
              </div>
            </article>

            <!-- Show more -->
            <div v-if="!showAll" class="show-more-entry">
              <div class="git-graph">
                <div class="graph-line top"></div>
                <div class="graph-node more">
                  <span class="node-more">...</span>
                </div>
                <div class="graph-line bottom faded"></div>
              </div>
              <button @click="showAll = true" class="show-more-button">
                <span class="more-text"
                  >-- {{ experiencesConfig.length - INITIAL_VISIBLE_COUNT }} more commits
                  ({{ yearsOfExperience - 6 }}+ years of history) --</span
                >
                <span class="more-hint">press enter or click to expand</span>
              </button>
            </div>

            <!-- End marker -->
            <div v-if="showAll" class="log-end">
              <span class="end-marker">(END)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { experiencesConfig, type Experience } from "../domain/experience/data";

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

  const viaNames: Record<string, string> = {
    toptal: "toptal",
    tw: "thoughtworks",
  };

  function getViaName(via: string): string {
    return viaNames[via] || via;
  }

  const INITIAL_VISIBLE_COUNT = 6;
  const showAll = ref(false);
  const hoveredIndex = ref<number | null>(null);
  const commitRefs = ref<Map<number, HTMLElement>>(new Map());

  function setCommitRef(el: unknown, index: number) {
    if (el instanceof HTMLElement) {
      commitRefs.value.set(index, el);
    }
  }

  function scrollToCommit(index: number) {
    const el = commitRefs.value.get(index);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

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

  const uniqueTags = computed(() => {
    const tags = new Set<string>();
    experiencesConfig.forEach((exp) => exp.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  });

  const visibleExperiences = computed(() => {
    if (showAll.value) {
      return experiencesConfig;
    }
    return experiencesConfig.slice(0, INITIAL_VISIBLE_COUNT);
  });

  // Generate a fake git hash from the experience data
  function getFullHash(experience: Experience, index: number): string {
    const base = experience.slug + experience.startDate + index;
    let hash = "";
    for (let i = 0; i < 40; i++) {
      hash += base.charCodeAt(i % base.length).toString(16).slice(-1);
    }
    return hash.slice(0, 40);
  }

  function getShortHash(experience: Experience, index: number): string {
    return getFullHash(experience, index).slice(0, 7);
  }

  // Get branch color based on tags
  function getBranchColor(experience: Experience): string {
    if (experience.tags.includes("fintech")) return "branch-fintech";
    if (experience.tags.includes("startup")) return "branch-startup";
    if (experience.tags.includes("contract")) return "branch-contract";
    if (experience.tags.includes("enterprise")) return "branch-enterprise";
    return "branch-default";
  }

  function getTagColor(tag: string): string {
    const colors: Record<string, string> = {
      remote: "tag-remote",
      "on-site": "tag-onsite",
      fintech: "tag-fintech",
      startup: "tag-startup",
      contract: "tag-contract",
      enterprise: "tag-enterprise",
      healthcare: "tag-healthcare",
      education: "tag-education",
      "e-commerce": "tag-ecommerce",
      "hr-tech": "tag-hrtech",
      ai: "tag-ai",
      web3: "tag-web3",
      cloud: "tag-cloud",
      saas: "tag-saas",
      erp: "tag-erp",
      insurance: "tag-insurance",
      "ed-tech": "tag-edtech",
      internship: "tag-internship",
    };
    return colors[tag] || "tag-default";
  }

  function formatGitDate(experience: Experience): string {
    const startDate = new Date(experience.startDate);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

    const day = days[startDate.getDay()];
    const month = months[startDate.getMonth()];
    const date = startDate.getDate();
    const year = startDate.getFullYear();

    return `${day} ${month} ${date} ${year}`;
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

    if (!experience.endDate) {
      duration += " ago";
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
    width: 220px;
    flex-shrink: 0;
    height: fit-content;
  }

  .terminal-header {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    margin-bottom: var(--space-4);
    padding: var(--space-2);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
  }

  .terminal-prompt {
    color: var(--color-primary);
    margin-right: var(--space-1);
  }

  .terminal-command {
    color: var(--color-text-secondary);
  }

  .commit-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-6);
    max-height: 300px;
    overflow-y: auto;
  }

  .commit-nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-align: left;
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-fast);
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
  }

  .commit-nav-item:hover,
  .commit-nav-item.active {
    background: var(--color-surface-hover);
  }

  .nav-hash {
    color: var(--color-orange);
    flex-shrink: 0;
  }

  .nav-company {
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .career-stats {
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .stat-line {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-1) 0;
  }

  .stat-label {
    color: var(--color-text-muted);
  }

  .stat-value {
    color: var(--color-primary);
    font-weight: var(--font-semibold);
  }

  /* Content */
  .content {
    flex: 1;
    min-width: 0;
  }

  .terminal-window {
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .terminal-chrome {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .window-controls {
    display: flex;
    gap: 8px;
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

  .terminal-title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .git-log {
    padding: var(--space-4);
  }

  /* Commit entry */
  .commit-entry {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4) 0;
    transition: background-color var(--transition-fast);
    border-radius: var(--radius-md);
    margin: 0 calc(-1 * var(--space-2));
    padding-left: var(--space-2);
    padding-right: var(--space-2);
  }

  .commit-entry.highlighted {
    background: var(--color-surface-hover);
  }

  .commit-entry.current {
    border-left: 3px solid var(--color-primary);
    margin-left: calc(-1 * var(--space-2) - 3px);
  }

  /* Git graph */
  .git-graph {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 24px;
    flex-shrink: 0;
  }

  .graph-line {
    width: 2px;
    flex: 1;
    background: var(--color-border);
    min-height: 20px;
  }

  .graph-line.hidden {
    visibility: hidden;
  }

  .graph-line.faded {
    opacity: 0.3;
  }

  .graph-node {
    width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: var(--font-bold);
    flex-shrink: 0;
  }

  .graph-node.branch-fintech {
    background: var(--color-teal);
    color: white;
  }

  .graph-node.branch-startup {
    background: var(--color-orange);
    color: white;
  }

  .graph-node.branch-contract {
    background: var(--color-purple);
    color: white;
  }

  .graph-node.branch-enterprise {
    background: var(--color-green);
    color: white;
  }

  .graph-node.branch-default {
    background: var(--color-text-muted);
    color: white;
  }

  .graph-node.more {
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    color: var(--color-text-muted);
  }

  .node-dot {
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: var(--radius-full);
  }

  .node-current {
    font-size: 14px;
  }

  .node-more {
    font-size: 10px;
    line-height: 1;
  }

  /* Commit content */
  .commit-content {
    flex: 1;
    min-width: 0;
    position: relative;
  }

  .commit-header {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    margin-bottom: var(--space-2);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    align-items: center;
  }

  .commit-keyword {
    color: var(--color-orange);
  }

  .commit-hash {
    color: var(--color-orange);
    opacity: 0.8;
  }

  .head-ref {
    color: var(--color-teal);
    font-weight: var(--font-semibold);
  }

  .branch-ref {
    color: var(--color-green);
  }

  .commit-meta {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    margin-bottom: var(--space-1);
    display: flex;
    gap: var(--space-2);
  }

  .meta-label {
    color: var(--color-text-muted);
    min-width: 60px;
  }

  .meta-value {
    color: var(--color-text-secondary);
  }

  .author-value {
    color: var(--color-text-primary);
  }

  .company-link {
    color: var(--color-primary);
    text-decoration: none;
  }

  .company-link:hover {
    text-decoration: underline;
  }

  .date-value {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .duration-badge {
    font-size: var(--text-xs);
    padding: 2px 6px;
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  .commit-refs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin: var(--space-2) 0;
  }

  .ref-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text-secondary);
  }

  .ref-tag.tag-remote {
    background: var(--color-teal);
    color: white;
  }

  .ref-tag.tag-onsite {
    background: var(--color-orange);
    color: white;
  }

  .ref-tag.tag-fintech {
    background: oklch(0.5 0.1 200 / 0.2);
    color: var(--color-teal);
  }

  .ref-tag.tag-startup {
    background: oklch(0.6 0.15 70 / 0.2);
    color: var(--color-orange);
  }

  .ref-tag.tag-contract {
    background: oklch(0.6 0.14 306 / 0.2);
    color: var(--color-purple);
  }

  .ref-tag.tag-healthcare,
  .ref-tag.tag-enterprise {
    background: oklch(0.55 0.1 145 / 0.2);
    color: var(--color-green);
  }

  .ref-tag.tag-ai,
  .ref-tag.tag-web3 {
    background: oklch(0.55 0.15 15 / 0.2);
    color: var(--color-red);
  }

  .commit-message {
    margin: var(--space-3) 0;
    padding-left: var(--space-4);
    border-left: 2px solid var(--color-border);
  }

  .message-line {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin: var(--space-2) 0;
  }

  .message-line:first-child {
    margin-top: 0;
  }

  .commit-diff {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-subtle);
  }

  .diff-header {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin-bottom: var(--space-2);
    display: flex;
    gap: var(--space-2);
  }

  .diff-separator {
    color: var(--color-border);
  }

  .diff-insertions {
    color: var(--color-green);
  }

  .diff-deletions {
    color: var(--color-red);
  }

  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .tech-badge {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 2px 6px;
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  .commit-logo {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.15;
    pointer-events: none;
  }

  .logo-img {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }

  .commit-entry.highlighted .commit-logo {
    opacity: 0.3;
  }

  /* Show more */
  .show-more-entry {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4) 0;
  }

  .show-more-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    background: var(--color-surface);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .show-more-button:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }

  .more-text {
    color: var(--color-text-secondary);
  }

  .more-hint {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
  }

  .log-end {
    text-align: center;
    padding: var(--space-4);
  }

  .end-marker {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    background: var(--color-surface);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-sm);
  }

  /* Responsive */
  @media (--lg) {
    .sidebar {
      width: 180px;
    }

    .commit-list {
      max-height: 200px;
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

    .commit-list {
      display: none;
    }

    .career-stats {
      display: flex;
      gap: var(--space-6);
      border-top: none;
      padding-top: 0;
    }

    .stat-line {
      flex-direction: column;
      gap: 0;
    }

    .terminal-window {
      border-radius: var(--radius-md);
    }

    .commit-entry {
      flex-direction: column;
      gap: var(--space-2);
    }

    .git-graph {
      flex-direction: row;
      width: 100%;
      justify-content: flex-start;
      gap: var(--space-2);
    }

    .graph-line {
      height: 2px;
      width: 20px;
      min-height: auto;
    }

    .graph-line.top {
      display: none;
    }

    .commit-logo {
      display: none;
    }

    .commit-header {
      font-size: var(--text-xs);
    }

    .commit-hash {
      display: none;
    }
  }
</style>
