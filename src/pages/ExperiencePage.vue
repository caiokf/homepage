<template>
  <div class="kanban-page">
    <header class="kanban-header">
      <h1 class="page-title">experience</h1>
      <div class="board-controls">
        <div class="view-toggle">
          <button
            :class="['toggle-btn', { active: groupBy === 'decade' }]"
            @click="groupBy = 'decade'"
          >
            by decade
          </button>
          <button
            :class="['toggle-btn', { active: groupBy === 'role' }]"
            @click="groupBy = 'role'"
          >
            by role
          </button>
        </div>
      </div>
    </header>

    <div class="kanban-board">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        :style="{ '--column-color': column.color }"
      >
        <div class="column-header">
          <div class="column-title-row">
            <span class="column-icon">{{ column.icon }}</span>
            <h2 class="column-title">{{ column.title }}</h2>
            <span class="card-count">{{ column.experiences.length }}</span>
          </div>
          <p class="column-subtitle">{{ column.subtitle }}</p>
        </div>

        <div class="column-content">
          <article
            v-for="exp in column.experiences"
            :key="exp.slug"
            class="kanban-card"
            @click="toggleCard(exp.slug)"
          >
            <div class="card-header">
              <div class="card-labels">
                <span
                  v-for="tag in exp.tags.slice(0, 2)"
                  :key="tag"
                  class="card-label"
                  :style="{ background: getLabelColor(tag) }"
                >
                  {{ tag }}
                </span>
              </div>
              <span class="card-duration">{{ calculateDuration(exp) }}</span>
            </div>

            <div class="card-title-section">
              <img
                v-if="getCompanyLogo(exp)"
                :src="getCompanyLogo(exp)"
                :alt="exp.company"
                class="card-logo"
              />
              <div class="card-info">
                <h3 class="card-title">{{ exp.company }}</h3>
                <p class="card-role">{{ exp.position }}</p>
              </div>
            </div>

            <div class="card-meta">
              <span class="card-dates">
                <span class="date-icon">📅</span>
                {{ formatDateRange(exp) }}
              </span>
              <span v-if="exp.via" class="card-via">
                via {{ getViaName(exp.via) }}
              </span>
            </div>

            <div v-if="expandedCards.has(exp.slug)" class="card-details">
              <ul class="card-highlights">
                <li v-for="(highlight, idx) in exp.highlights" :key="idx">
                  {{ highlight }}
                </li>
              </ul>
              <div class="card-tech">
                <span
                  v-for="tech in parseTechnologies(exp.technologies).slice(0, 5)"
                  :key="tech"
                  class="tech-badge"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="parseTechnologies(exp.technologies).length > 5"
                  class="tech-more"
                >
                  +{{ parseTechnologies(exp.technologies).length - 5 }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <a
                v-if="exp.website"
                :href="exp.website"
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
                @click.stop
              >
                <span class="link-icon">🔗</span>
              </a>
              <span class="expand-hint">
                {{ expandedCards.has(exp.slug) ? '▲' : '▼' }}
              </span>
            </div>
          </article>
        </div>

        <div class="column-footer">
          <span class="footer-stat">
            {{ getTotalMonths(column.experiences) }} months total
          </span>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <footer class="kanban-stats">
      <div class="stat-item">
        <span class="stat-icon">📊</span>
        <span class="stat-value">{{ experiencesConfig.length }}</span>
        <span class="stat-label">total positions</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🏢</span>
        <span class="stat-value">{{ uniqueCompanies }}</span>
        <span class="stat-label">companies</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📅</span>
        <span class="stat-value">{{ yearsOfExperience }}</span>
        <span class="stat-label">years</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💻</span>
        <span class="stat-value">{{ uniqueTechnologies }}</span>
        <span class="stat-label">technologies</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { experiencesConfig, type Experience } from "../domain/experience/data";

  // Dynamically import all logos
  const logoModules = import.meta.glob("../assets/logos/*.jpeg", {
    eager: true,
    import: "default",
  });

  const companyLogos: Record<string, string> = {};
  for (const path in logoModules) {
    const slug = path.replace("../assets/logos/", "").replace(".jpeg", "");
    companyLogos[slug] = logoModules[path] as string;
  }

  function getCompanyLogo(exp: Experience): string | undefined {
    return companyLogos[exp.slug];
  }

  const viaNames: Record<string, string> = {
    toptal: "Toptal",
    tw: "ThoughtWorks",
  };

  function getViaName(via: string): string {
    return viaNames[via] || via;
  }

  // State
  const groupBy = ref<"decade" | "role">("decade");
  const expandedCards = ref<Set<string>>(new Set());

  function toggleCard(slug: string) {
    if (expandedCards.value.has(slug)) {
      expandedCards.value.delete(slug);
    } else {
      expandedCards.value.add(slug);
    }
    expandedCards.value = new Set(expandedCards.value);
  }

  // Column definitions
  type Column = {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    experiences: Experience[];
  };

  const decadeColumns = computed<Column[]>(() => {
    const current = experiencesConfig.filter((exp) => !exp.endDate);
    const twenties = experiencesConfig.filter((exp) => {
      const year = new Date(exp.startDate).getFullYear();
      return year >= 2020 && exp.endDate;
    });
    const tens = experiencesConfig.filter((exp) => {
      const year = new Date(exp.startDate).getFullYear();
      return year >= 2010 && year < 2020;
    });
    const older = experiencesConfig.filter((exp) => {
      const year = new Date(exp.startDate).getFullYear();
      return year < 2010;
    });

    return [
      {
        id: "current",
        title: "Current",
        subtitle: "active positions",
        icon: "🔥",
        color: "var(--color-success)",
        experiences: current,
      },
      {
        id: "2020s",
        title: "2020s",
        subtitle: "recent experience",
        icon: "🚀",
        color: "var(--color-teal)",
        experiences: twenties,
      },
      {
        id: "2010s",
        title: "2010s",
        subtitle: "growth years",
        icon: "📈",
        color: "var(--color-orange)",
        experiences: tens,
      },
      {
        id: "earlier",
        title: "Pre-2010",
        subtitle: "foundations",
        icon: "🏛️",
        color: "var(--color-purple)",
        experiences: older,
      },
    ].filter((col) => col.experiences.length > 0);
  });

  const roleColumns = computed<Column[]>(() => {
    const leadership = experiencesConfig.filter((exp) =>
      exp.tags.some((t) =>
        ["Leadership", "Management", "Director", "Head"].some((r) =>
          t.toLowerCase().includes(r.toLowerCase())
        )
      )
    );
    const architecture = experiencesConfig.filter((exp) =>
      exp.tags.some((t) =>
        ["Architecture", "Principal", "Staff"].some((r) =>
          t.toLowerCase().includes(r.toLowerCase())
        )
      )
    );
    const engineering = experiencesConfig.filter(
      (exp) =>
        !leadership.includes(exp) &&
        !architecture.includes(exp) &&
        exp.tags.some((t) =>
          ["Engineering", "Developer", "Software"].some((r) =>
            t.toLowerCase().includes(r.toLowerCase())
          )
        )
    );
    const other = experiencesConfig.filter(
      (exp) =>
        !leadership.includes(exp) &&
        !architecture.includes(exp) &&
        !engineering.includes(exp)
    );

    return [
      {
        id: "leadership",
        title: "Leadership",
        subtitle: "team & org building",
        icon: "👥",
        color: "var(--color-success)",
        experiences: leadership,
      },
      {
        id: "architecture",
        title: "Architecture",
        subtitle: "system design",
        icon: "🏗️",
        color: "var(--color-teal)",
        experiences: architecture,
      },
      {
        id: "engineering",
        title: "Engineering",
        subtitle: "hands-on building",
        icon: "💻",
        color: "var(--color-orange)",
        experiences: engineering,
      },
      {
        id: "other",
        title: "Other",
        subtitle: "diverse roles",
        icon: "🎯",
        color: "var(--color-purple)",
        experiences: other,
      },
    ].filter((col) => col.experiences.length > 0);
  });

  const columns = computed(() =>
    groupBy.value === "decade" ? decadeColumns.value : roleColumns.value
  );

  // Stats
  const yearsOfExperience = computed(() => {
    const oldestStartDate = experiencesConfig
      .map((exp) => new Date(exp.startDate).getTime())
      .sort((a, b) => a - b)[0];
    const startYear = new Date(oldestStartDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  });

  const uniqueCompanies = computed(() => {
    return new Set(experiencesConfig.map((exp) => exp.company)).size;
  });

  const uniqueTechnologies = computed(() => {
    const techs = new Set<string>();
    experiencesConfig.forEach((exp) => {
      parseTechnologies(exp.technologies).forEach((t) => techs.add(t));
    });
    return techs.size;
  });

  function getTotalMonths(experiences: Experience[]): number {
    return experiences.reduce((sum, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      return sum + Math.max(1, months);
    }, 0);
  }

  // Helpers
  function formatDateRange(exp: Experience): string {
    const start = new Date(exp.startDate);
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (!exp.endDate) return `${startStr} - Present`;
    const end = new Date(exp.endDate);
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  }

  function calculateDuration(exp: Experience): string {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths}mo`;
    if (remainingMonths === 0) return `${years}y`;
    return `${years}y ${remainingMonths}mo`;
  }

  function parseTechnologies(technologies: string): string[] {
    return technologies.split(",").map((tech) => tech.trim());
  }

  function getLabelColor(tag: string): string {
    const colors: Record<string, string> = {
      Leadership: "#8b5cf6",
      Architecture: "#06b6d4",
      Engineering: "#22c55e",
      Consulting: "#f59e0b",
      Startup: "#ef4444",
      Enterprise: "#3b82f6",
      Remote: "#ec4899",
      Fintech: "#10b981",
      Healthcare: "#f97316",
      Ecommerce: "#6366f1",
    };
    for (const [key, color] of Object.entries(colors)) {
      if (tag.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    return "#6b7280";
  }
</script>

<style scoped>
  .kanban-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    background: var(--color-background);
  }

  /* Header */
  .kanban-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .page-title {
    margin: 0;
  }

  .board-controls {
    display: flex;
    gap: var(--space-3);
  }

  .view-toggle {
    display: flex;
    background: var(--color-surface);
    border-radius: var(--radius-md);
    padding: var(--space-1);
    border: 1px solid var(--color-border);
  }

  .toggle-btn {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    color: var(--color-text-secondary);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    text-transform: lowercase;
  }

  .toggle-btn:hover {
    color: var(--color-text-primary);
  }

  .toggle-btn.active {
    background: var(--color-primary);
    color: var(--color-text-inverse);
  }

  /* Board */
  .kanban-board {
    display: flex;
    gap: var(--space-4);
    overflow-x: auto;
    padding-bottom: var(--space-4);
    flex: 1;
  }

  /* Column */
  .kanban-column {
    flex: 0 0 320px;
    min-width: 320px;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 280px);
    border: 1px solid var(--color-border);
  }

  .column-header {
    padding: var(--space-4);
    border-bottom: 3px solid var(--column-color, var(--color-primary));
  }

  .column-title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-1);
  }

  .column-icon {
    font-size: var(--text-lg);
  }

  .column-title {
    font-family: var(--font-mono);
    font-size: var(--text-md);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0;
    text-transform: lowercase;
    flex: 1;
  }

  .card-count {
    background: var(--column-color, var(--color-primary));
    color: white;
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    padding: 2px var(--space-2);
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
  }

  .column-subtitle {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin: 0;
  }

  .column-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .column-footer {
    padding: var(--space-3) var(--space-4);
    border-top: 1px solid var(--color-border);
    background: var(--color-background-subtle);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }

  .footer-stat {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  /* Card */
  .kanban-card {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .kanban-card:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .card-labels {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .card-label {
    font-size: 10px;
    font-weight: var(--font-medium);
    color: white;
    padding: 2px var(--space-2);
    border-radius: var(--radius-sm);
    text-transform: lowercase;
  }

  .card-duration {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    white-space: nowrap;
  }

  .card-title-section {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .card-logo {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    flex-shrink: 0;
  }

  .card-info {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-role {
    font-size: var(--text-xs);
    color: var(--color-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .card-dates {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .date-icon {
    font-size: 10px;
  }

  .card-via {
    opacity: 0.7;
  }

  /* Card Details (expanded) */
  .card-details {
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .card-highlights {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .card-highlights li {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    padding-left: var(--space-3);
    position: relative;
  }

  .card-highlights li::before {
    content: "›";
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-weight: var(--font-bold);
  }

  .card-tech {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .tech-badge {
    font-size: 10px;
    background: var(--color-surface-hover);
    color: var(--color-text-secondary);
    padding: 2px var(--space-2);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
  }

  .tech-more {
    font-size: 10px;
    color: var(--color-text-muted);
    padding: 2px var(--space-2);
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-1);
  }

  .card-link {
    font-size: var(--text-xs);
    color: var(--color-link);
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }

  .card-link:hover {
    opacity: 1;
  }

  .link-icon {
    font-size: 12px;
  }

  .expand-hint {
    font-size: 10px;
    color: var(--color-text-muted);
  }

  /* Stats Bar */
  .kanban-stats {
    display: flex;
    justify-content: center;
    gap: var(--space-8);
    padding: var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .stat-icon {
    font-size: var(--text-base);
  }

  .stat-value {
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
  }

  .stat-label {
    color: var(--color-text-muted);
  }

  /* Responsive */
  @media (--lg) {
    .kanban-column {
      flex: 0 0 280px;
      min-width: 280px;
    }
  }

  @media (--md) {
    .kanban-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .kanban-board {
      flex-direction: column;
    }

    .kanban-column {
      flex: none;
      min-width: 100%;
      max-height: none;
    }

    .column-content {
      max-height: 400px;
    }

    .kanban-stats {
      flex-wrap: wrap;
      gap: var(--space-4);
    }
  }

  @media (--sm) {
    .kanban-page {
      padding: var(--space-4);
    }

    .kanban-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
    }

    .stat-item {
      justify-content: center;
    }
  }
</style>
