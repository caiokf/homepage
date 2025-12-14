<template>
  <div class="github-profile">
    <!-- Profile Header -->
    <div class="profile-container">
      <aside class="profile-sidebar">
        <div class="avatar-container">
          <img :src="avatarImage" alt="Profile" class="profile-avatar" />
          <span class="status-indicator">💼</span>
        </div>
        <h1 class="profile-name">caio kinzel filho</h1>
        <p class="profile-username">@caiokf</p>
        <p class="profile-bio">
          engineering leader & architect building scalable systems and high-performing teams
        </p>

        <div class="profile-stats">
          <div class="stat">
            <span class="stat-icon">📦</span>
            <span class="stat-value">{{ totalProjects }}</span>
            <span class="stat-label">projects</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🏢</span>
            <span class="stat-value">{{ totalCompanies }}</span>
            <span class="stat-label">companies</span>
          </div>
          <div class="stat">
            <span class="stat-icon">📅</span>
            <span class="stat-value">{{ yearsOfExperience }}</span>
            <span class="stat-label">years</span>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <span class="detail-icon">📍</span>
            <span>Sunshine Coast, Australia</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">🔗</span>
            <a href="https://caiokf.dev" class="detail-link">caiokf.dev</a>
          </div>
        </div>

        <!-- Technologies as "Languages" -->
        <div class="languages-section">
          <h3 class="section-title">Top Technologies</h3>
          <div class="language-bars">
            <div
              v-for="tech in topTechnologies"
              :key="tech.name"
              class="language-item"
            >
              <div class="language-header">
                <span
                  class="language-dot"
                  :style="{ background: tech.color }"
                ></span>
                <span class="language-name">{{ tech.name }}</span>
                <span class="language-percent">{{ tech.percent }}%</span>
              </div>
              <div class="language-bar">
                <div
                  class="language-fill"
                  :style="{ width: tech.percent + '%', background: tech.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="profile-main">
        <!-- README Section -->
        <section class="readme-section">
          <div class="readme-header">
            <span class="readme-icon">📄</span>
            <span class="readme-filename">README.md</span>
          </div>
          <div class="readme-content">
            <h2 class="readme-title">Hi there 👋</h2>
            <p class="readme-text">
              I'm a <strong>software engineering leader</strong> with
              {{ yearsOfExperience }}+ years of experience building distributed
              systems, leading engineering teams, and delivering impactful
              products across multiple industries.
            </p>
            <div class="readme-badges">
              <span class="badge architecture">🏗️ Architecture</span>
              <span class="badge events">⚡ Event-Driven</span>
              <span class="badge teams">👥 Engineering Teams</span>
              <span class="badge data">📊 Data Systems</span>
            </div>
          </div>
        </section>

        <!-- Contribution Graph -->
        <section class="contribution-section">
          <h2 class="section-header">
            <span class="header-icon">📊</span>
            {{ totalContributions }} contributions in the last {{ yearsOfExperience }} years
          </h2>
          <div class="contribution-graph">
            <div class="graph-labels">
              <span v-for="year in contributionYears" :key="year" class="year-label">
                {{ year }}
              </span>
            </div>
            <div class="graph-grid">
              <div
                v-for="(month, index) in contributionData"
                :key="index"
                class="contribution-cell"
                :class="getCellClass(month.level)"
                :title="`${month.label}: ${month.projects} projects`"
              ></div>
            </div>
            <div class="graph-legend">
              <span class="legend-label">Less</span>
              <span class="legend-cell level-0"></span>
              <span class="legend-cell level-1"></span>
              <span class="legend-cell level-2"></span>
              <span class="legend-cell level-3"></span>
              <span class="legend-cell level-4"></span>
              <span class="legend-label">More</span>
            </div>
          </div>
        </section>

        <!-- Pinned Repositories (Featured Experiences) -->
        <section class="pinned-section">
          <h2 class="section-header">
            <span class="header-icon">📌</span>
            Pinned
          </h2>
          <div class="pinned-grid">
            <article
              v-for="exp in pinnedExperiences"
              :key="exp.slug"
              class="repo-card"
            >
              <div class="repo-header">
                <span class="repo-icon">📁</span>
                <a
                  v-if="exp.website"
                  :href="exp.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="repo-name"
                >
                  {{ formatRepoName(exp.company) }}
                </a>
                <span v-else class="repo-name">{{ formatRepoName(exp.company) }}</span>
                <span class="repo-visibility">{{ exp.tags[0] || 'Public' }}</span>
              </div>
              <p class="repo-description">
                {{ exp.position }} • {{ formatDateRange(exp) }}
              </p>
              <div class="repo-highlights">
                <span
                  v-for="(highlight, hIdx) in exp.highlights.slice(0, 2)"
                  :key="hIdx"
                  class="highlight-badge"
                >
                  {{ truncateHighlight(highlight) }}
                </span>
              </div>
              <div class="repo-footer">
                <div class="repo-tech">
                  <span
                    class="tech-dot"
                    :style="{ background: getTechColor(exp.technologies.split(',')[0]) }"
                  ></span>
                  <span class="tech-name">{{ exp.technologies.split(',')[0].trim() }}</span>
                </div>
                <div class="repo-stats">
                  <span class="stat-item">
                    ⭐ {{ calculateMonths(exp) }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- All Repositories (Experience List) -->
        <section class="repos-section">
          <div class="repos-header">
            <h2 class="section-header">
              <span class="header-icon">📚</span>
              Repositories
              <span class="repo-count">{{ visibleExperiences.length }}</span>
            </h2>
            <div class="repos-filter">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Find a repository..."
                class="search-input"
              />
            </div>
          </div>

          <div class="repos-list">
            <article
              v-for="exp in filteredExperiences"
              :key="exp.slug"
              class="repo-item"
            >
              <div class="repo-item-main">
                <div class="repo-item-header">
                  <a
                    v-if="exp.website"
                    :href="exp.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="repo-item-name"
                  >
                    {{ formatRepoName(exp.company) }}
                  </a>
                  <span v-else class="repo-item-name">{{ formatRepoName(exp.company) }}</span>
                  <span class="repo-item-visibility">{{ exp.tags[0] || 'Public' }}</span>
                </div>
                <p class="repo-item-description">{{ exp.position }}</p>
                <div class="repo-item-meta">
                  <span class="meta-tech">
                    <span
                      class="tech-dot"
                      :style="{ background: getTechColor(exp.technologies.split(',')[0]) }"
                    ></span>
                    {{ exp.technologies.split(',')[0].trim() }}
                  </span>
                  <span class="meta-date">Updated {{ formatRelativeDate(exp) }}</span>
                </div>
              </div>
              <div class="repo-item-graph">
                <svg class="mini-graph" viewBox="0 0 155 30">
                  <path
                    :d="generateMiniGraph(exp)"
                    fill="none"
                    stroke="var(--color-success)"
                    stroke-width="2"
                  />
                </svg>
              </div>
            </article>
          </div>

          <button
            v-if="!showAll && experiencesConfig.length > INITIAL_VISIBLE_COUNT"
            @click="showAll = true"
            class="show-more-btn"
          >
            Show {{ experiencesConfig.length - INITIAL_VISIBLE_COUNT }} more repositories
          </button>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { experiencesConfig, type Experience } from "../domain/experience/data";
  import avatarImage from "../assets/images/avatar.png";

  const INITIAL_VISIBLE_COUNT = 6;
  const showAll = ref(false);
  const searchQuery = ref("");

  // Stats calculations
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

  const totalProjects = computed(() => experiencesConfig.length);

  const totalContributions = computed(() => {
    return experiencesConfig.reduce((sum, exp) => sum + calculateMonths(exp), 0);
  });

  // Pinned experiences (most recent 6)
  const pinnedExperiences = computed(() => experiencesConfig.slice(0, 6));

  // Visible experiences for the list
  const visibleExperiences = computed(() => {
    if (showAll.value) {
      return experiencesConfig;
    }
    return experiencesConfig.slice(0, INITIAL_VISIBLE_COUNT);
  });

  // Filtered experiences based on search
  const filteredExperiences = computed(() => {
    if (!searchQuery.value) {
      return visibleExperiences.value;
    }
    const query = searchQuery.value.toLowerCase();
    return visibleExperiences.value.filter(
      (exp) =>
        exp.company.toLowerCase().includes(query) ||
        exp.position.toLowerCase().includes(query) ||
        exp.technologies.toLowerCase().includes(query)
    );
  });

  // Top technologies with colors
  const topTechnologies = computed(() => {
    const techCount: Record<string, number> = {};
    experiencesConfig.forEach((exp) => {
      exp.technologies.split(",").forEach((tech) => {
        const t = tech.trim();
        techCount[t] = (techCount[t] || 0) + 1;
      });
    });

    const sorted = Object.entries(techCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const total = sorted.reduce((sum, [, count]) => sum + count, 0);
    const colors = ["#3178c6", "#f1e05a", "#e34c26", "#563d7c", "#41b883"];

    return sorted.map(([name, count], index) => ({
      name,
      percent: Math.round((count / total) * 100),
      color: colors[index % colors.length],
    }));
  });

  // Contribution data for the graph
  const contributionYears = computed(() => {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 10; y <= currentYear; y++) {
      years.push(y);
    }
    return years;
  });

  const contributionData = computed(() => {
    const data: { label: string; level: number; projects: number }[] = [];
    const currentYear = new Date().getFullYear();

    // Generate 12 months * 11 years of data
    for (let y = currentYear - 10; y <= currentYear; y++) {
      for (let m = 0; m < 12; m++) {
        const date = new Date(y, m, 1);
        const monthLabel = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        // Count active projects in this month
        const activeProjects = experiencesConfig.filter((exp) => {
          const start = new Date(exp.startDate);
          const end = exp.endDate ? new Date(exp.endDate) : new Date();
          return start <= date && end >= date;
        }).length;

        let level = 0;
        if (activeProjects > 0) level = 1;
        if (activeProjects > 1) level = 2;
        if (activeProjects > 2) level = 3;
        if (activeProjects > 3) level = 4;

        data.push({ label: monthLabel, level, projects: activeProjects });
      }
    }

    return data;
  });

  function getCellClass(level: number): string {
    return `level-${level}`;
  }

  function formatRepoName(company: string): string {
    return company.toLowerCase().replace(/\s+/g, "-");
  }

  function formatDateRange(exp: Experience): string {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const endStr = exp.endDate
      ? end.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "Present";
    return `${startStr} - ${endStr}`;
  }

  function formatRelativeDate(exp: Experience): string {
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - end.getFullYear()) * 12 +
      (now.getMonth() - end.getMonth());

    if (diffMonths === 0) return "this month";
    if (diffMonths === 1) return "last month";
    if (diffMonths < 12) return `${diffMonths} months ago`;
    const years = Math.floor(diffMonths / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  function calculateMonths(exp: Experience): number {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    return Math.max(
      1,
      (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth())
    );
  }

  function truncateHighlight(text: string): string {
    return text.length > 50 ? text.substring(0, 47) + "..." : text;
  }

  function getTechColor(tech: string): string {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      Java: "#b07219",
      "C#": "#178600",
      Ruby: "#701516",
      Go: "#00ADD8",
      Rust: "#dea584",
      Vue: "#41b883",
      React: "#61dafb",
      Angular: "#dd0031",
      Node: "#339933",
      ".NET": "#512bd4",
      AWS: "#FF9900",
      Azure: "#0089D6",
      Kubernetes: "#326ce5",
      Docker: "#2496ED",
    };
    const normalizedTech = tech.trim();
    for (const [key, color] of Object.entries(colors)) {
      if (normalizedTech.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    return "#6e7681";
  }

  function generateMiniGraph(exp: Experience): string {
    const points: string[] = [];
    const width = 155;
    const height = 30;

    // Generate a simple activity pattern
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const seed = exp.slug.charCodeAt(i % exp.slug.length) || 50;
      const variation = Math.sin(i + seed) * 8;
      const y = height / 2 + variation;
      points.push(`${i === 0 ? "M" : "L"}${x},${y}`);
    }

    return points.join(" ");
  }
</script>

<style scoped>
  .github-profile {
    min-height: calc(100vh - 112px);
    padding: var(--space-6);
    background: var(--color-background);
  }

  .profile-container {
    display: flex;
    gap: var(--space-8);
    max-width: 1280px;
    margin: 0 auto;
  }

  /* Sidebar */
  .profile-sidebar {
    width: 296px;
    flex-shrink: 0;
  }

  .avatar-container {
    position: relative;
    width: 296px;
    margin-bottom: var(--space-4);
  }

  .profile-avatar {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    object-fit: cover;
  }

  .status-indicator {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 28px;
    background: var(--color-surface);
    border-radius: var(--radius-full);
    padding: var(--space-1);
    border: 2px solid var(--color-background);
  }

  .profile-name {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0;
    text-transform: lowercase;
    font-family: var(--font-sans);
  }

  .profile-username {
    font-size: var(--text-md);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-4) 0;
    font-family: var(--font-mono);
  }

  .profile-bio {
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin: 0 0 var(--space-4) 0;
  }

  .profile-stats {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    padding: var(--space-3) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
  }

  .stat-icon {
    font-size: var(--text-sm);
  }

  .stat-value {
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
  }

  .stat-label {
    color: var(--color-text-muted);
  }

  .profile-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .detail-icon {
    width: 16px;
  }

  .detail-link {
    color: var(--color-link);
  }

  .detail-link:hover {
    text-decoration: underline;
  }

  /* Languages/Tech section */
  .languages-section {
    margin-top: var(--space-6);
  }

  .section-title {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-3) 0;
  }

  .language-bars {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .language-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .language-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
  }

  .language-dot {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-full);
  }

  .language-name {
    color: var(--color-text-primary);
    flex: 1;
  }

  .language-percent {
    color: var(--color-text-muted);
  }

  .language-bar {
    height: 8px;
    background: var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .language-fill {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width var(--transition-slow);
  }

  /* Main content */
  .profile-main {
    flex: 1;
    min-width: 0;
  }

  /* README section */
  .readme-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-6);
    overflow: hidden;
  }

  .readme-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--color-background-subtle);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .readme-icon {
    font-size: var(--text-base);
  }

  .readme-filename {
    font-family: var(--font-mono);
  }

  .readme-content {
    padding: var(--space-6);
  }

  .readme-title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin: 0 0 var(--space-3) 0;
    color: var(--color-text-primary);
  }

  .readme-text {
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin: 0 0 var(--space-4) 0;
  }

  .readme-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
  }

  .badge.architecture {
    background: var(--color-teal);
    color: white;
  }

  .badge.events {
    background: var(--color-orange);
    color: white;
  }

  .badge.teams {
    background: var(--color-green);
    color: white;
  }

  .badge.data {
    background: var(--color-purple);
    color: white;
  }

  /* Contribution Graph */
  .contribution-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-base);
    font-weight: var(--font-normal);
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-4) 0;
  }

  .header-icon {
    font-size: var(--text-base);
  }

  .contribution-graph {
    overflow-x: auto;
  }

  .graph-labels {
    display: flex;
    gap: 48px;
    margin-bottom: var(--space-2);
    padding-left: var(--space-2);
  }

  .year-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  .graph-grid {
    display: grid;
    grid-template-columns: repeat(132, 10px);
    grid-template-rows: repeat(7, 10px);
    gap: 3px;
    grid-auto-flow: column;
  }

  .contribution-cell {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    transition: transform var(--transition-fast);
  }

  .contribution-cell:hover {
    transform: scale(1.3);
  }

  .level-0 {
    background: var(--color-border);
  }

  .level-1 {
    background: #9be9a8;
  }

  .level-2 {
    background: #40c463;
  }

  .level-3 {
    background: #30a14e;
  }

  .level-4 {
    background: #216e39;
  }

  [data-theme="dark"] .level-1 {
    background: #0e4429;
  }

  [data-theme="dark"] .level-2 {
    background: #006d32;
  }

  [data-theme="dark"] .level-3 {
    background: #26a641;
  }

  [data-theme="dark"] .level-4 {
    background: #39d353;
  }

  .graph-legend {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    justify-content: flex-end;
    margin-top: var(--space-3);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .legend-cell {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }

  .legend-label {
    margin: 0 var(--space-1);
  }

  /* Pinned Section */
  .pinned-section {
    margin-bottom: var(--space-6);
  }

  .pinned-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .repo-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    transition: border-color var(--transition-fast);
  }

  .repo-card:hover {
    border-color: var(--color-border-strong);
  }

  .repo-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .repo-icon {
    font-size: var(--text-base);
    color: var(--color-text-muted);
  }

  .repo-name {
    font-weight: var(--font-semibold);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    text-decoration: none;
  }

  .repo-name:hover {
    text-decoration: underline;
  }

  .repo-visibility {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    margin-left: auto;
  }

  .repo-description {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .repo-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .highlight-badge {
    font-size: 10px;
    color: var(--color-text-muted);
    background: var(--color-background-subtle);
    padding: 2px var(--space-2);
    border-radius: var(--radius-sm);
  }

  .repo-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: var(--space-2);
  }

  .repo-tech {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .tech-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
  }

  .repo-stats {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  /* Repos List Section */
  .repos-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .repos-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .repo-count {
    background: var(--color-background-subtle);
    padding: 2px var(--space-2);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    margin-left: var(--space-2);
  }

  .repos-filter {
    display: flex;
    gap: var(--space-2);
  }

  .search-input {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-background);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
    width: 200px;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .repos-list {
    display: flex;
    flex-direction: column;
  }

  .repo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    transition: background var(--transition-fast);
  }

  .repo-item:hover {
    background: var(--color-background-subtle);
  }

  .repo-item:last-child {
    border-bottom: none;
  }

  .repo-item-main {
    flex: 1;
  }

  .repo-item-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-1);
  }

  .repo-item-name {
    font-weight: var(--font-semibold);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-base);
    text-decoration: none;
  }

  .repo-item-name:hover {
    text-decoration: underline;
  }

  .repo-item-visibility {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    padding: 2px var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
  }

  .repo-item-description {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-2) 0;
  }

  .repo-item-meta {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .meta-tech {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .repo-item-graph {
    width: 155px;
    height: 30px;
    opacity: 0.7;
  }

  .mini-graph {
    width: 100%;
    height: 100%;
  }

  .show-more-btn {
    width: 100%;
    padding: var(--space-3);
    background: var(--color-background-subtle);
    color: var(--color-link);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .show-more-btn:hover {
    background: var(--color-surface-hover);
  }

  /* Responsive */
  @media (--lg) {
    .pinned-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (--md) {
    .profile-container {
      flex-direction: column;
    }

    .profile-sidebar {
      width: 100%;
    }

    .avatar-container {
      width: 200px;
      margin: 0 auto var(--space-4) auto;
    }

    .profile-stats {
      justify-content: center;
    }

    .graph-grid {
      grid-template-columns: repeat(52, 10px);
    }

    .repos-header {
      flex-direction: column;
      gap: var(--space-3);
      align-items: flex-start;
    }

    .search-input {
      width: 100%;
    }

    .repo-item-graph {
      display: none;
    }
  }

  @media (--sm) {
    .github-profile {
      padding: var(--space-4);
    }

    .readme-badges {
      gap: var(--space-1);
    }

    .badge {
      font-size: 10px;
      padding: 2px var(--space-2);
    }
  }
</style>
