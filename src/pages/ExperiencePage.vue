<template>
  <div class="experience-page">
    <h1 class="page-title">experience</h1>

    <div class="page-layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">technologies</h3>
        <p class="sidebar-subtitle">last {{ RECENT_YEARS }} years</p>
        <BadgeGroup :items="recentTechnologies" variant="muted" gap="xs" />

        <!-- File tree -->
        <div class="file-tree">
          <h3 class="sidebar-title">explorer</h3>
          <div class="tree-folder">
            <span class="folder-icon">📁</span>
            <span class="folder-name">career/</span>
          </div>
          <button
            v-for="(exp, index) in visibleExperiences"
            :key="`tree-${exp.slug}-${index}`"
            class="tree-file"
            :class="{ active: activeTab === index }"
            @click="activeTab = index"
          >
            <span class="file-icon">📄</span>
            <span class="file-name">{{ exp.slug }}.ts</span>
          </button>
          <button
            v-if="!showAll"
            class="tree-file more-files"
            @click="showAll = true"
          >
            <span class="file-icon">📦</span>
            <span class="file-name"
              >+{{ experiencesConfig.length - INITIAL_VISIBLE_COUNT }} more...</span
            >
          </button>
        </div>
      </aside>

      <div class="content">
        <div class="code-editor">
          <!-- Editor header with tabs -->
          <div class="editor-header">
            <div class="window-controls">
              <span class="control close"></span>
              <span class="control minimize"></span>
              <span class="control maximize"></span>
            </div>
            <div class="editor-tabs">
              <button
                v-for="(exp, index) in visibleExperiences"
                :key="`tab-${exp.slug}-${index}`"
                class="tab"
                :class="{ active: activeTab === index }"
                @click="activeTab = index"
              >
                <span class="tab-icon">TS</span>
                <span class="tab-name">{{ exp.slug }}.ts</span>
                <span class="tab-close" @click.stop="closeTab(index)">×</span>
              </button>
            </div>
          </div>

          <!-- Breadcrumb -->
          <div class="editor-breadcrumb">
            <span class="breadcrumb-item">career</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-item active"
              >{{ visibleExperiences[activeTab]?.slug }}.ts</span
            >
          </div>

          <!-- Code content -->
          <div class="editor-content" v-if="visibleExperiences[activeTab]">
            <div class="code-block">
              <!-- Import statement -->
              <div class="line">
                <span class="line-number">1</span>
                <code
                  ><span class="code-keyword">import</span>
                  <span class="code-punct">{</span>
                  <span class="code-type">Experience</span>
                  <span class="code-punct">}</span>
                  <span class="code-keyword">from</span>
                  <span class="code-string">"@career/types"</span
                  ><span class="code-punct">;</span></code
                >
              </div>

              <!-- Empty line -->
              <div class="line">
                <span class="line-number">2</span>
                <code></code>
              </div>

              <!-- JSDoc comment block -->
              <div class="line">
                <span class="line-number">3</span>
                <code
                  ><span class="code-comment"
                    >/**</span
                  ></code
                >
              </div>
              <div class="line">
                <span class="line-number">4</span>
                <code
                  ><span class="code-comment">
                    * {{ visibleExperiences[activeTab].position }} @
                    {{ visibleExperiences[activeTab].company }}</span
                  ></code
                >
              </div>
              <div
                v-for="(highlight, hIndex) in visibleExperiences[activeTab].highlights"
                :key="`comment-${hIndex}`"
                class="line"
              >
                <span class="line-number">{{ 5 + hIndex }}</span>
                <code
                  ><span class="code-comment"> * - {{ highlight }}</span></code
                >
              </div>
              <div class="line">
                <span class="line-number">{{
                  5 + visibleExperiences[activeTab].highlights.length
                }}</span>
                <code
                  ><span class="code-comment">
                    */</span
                  ></code
                >
              </div>

              <!-- Export statement -->
              <div class="line">
                <span class="line-number">{{
                  6 + visibleExperiences[activeTab].highlights.length
                }}</span>
                <code
                  ><span class="code-keyword">export const</span>
                  <span class="code-var">experience</span
                  ><span class="code-punct">:</span>
                  <span class="code-type">Experience</span>
                  <span class="code-punct">=</span>
                  <span class="code-punct">{</span></code
                >
              </div>

              <!-- Company -->
              <div class="line">
                <span class="line-number">{{
                  7 + visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-1"
                  ><span class="code-prop">company</span
                  ><span class="code-punct">:</span>
                  <span class="code-string"
                    >"{{ visibleExperiences[activeTab].company }}"</span
                  ><span class="code-punct">,</span></code
                >
              </div>

              <!-- Position -->
              <div class="line">
                <span class="line-number">{{
                  8 + visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-1"
                  ><span class="code-prop">position</span
                  ><span class="code-punct">:</span>
                  <span class="code-string"
                    >"{{ visibleExperiences[activeTab].position }}"</span
                  ><span class="code-punct">,</span></code
                >
              </div>

              <!-- Via (if exists) -->
              <template v-if="visibleExperiences[activeTab].via">
                <div class="line">
                  <span class="line-number">{{
                    9 + visibleExperiences[activeTab].highlights.length
                  }}</span>
                  <code class="indent-1"
                    ><span class="code-prop">via</span
                    ><span class="code-punct">:</span>
                    <span class="code-string"
                      >"{{ getViaName(visibleExperiences[activeTab].via!) }}"</span
                    ><span class="code-punct">,</span></code
                  >
                </div>
              </template>

              <!-- Period -->
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 10 : 9) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-1"
                  ><span class="code-prop">period</span
                  ><span class="code-punct">:</span>
                  <span class="code-punct">{</span></code
                >
              </div>
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 11 : 10) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-2"
                  ><span class="code-prop">start</span
                  ><span class="code-punct">:</span>
                  <span class="code-keyword">new</span>
                  <span class="code-type">Date</span
                  ><span class="code-punct">(</span
                  ><span class="code-string"
                    >"{{ visibleExperiences[activeTab].startDate }}"</span
                  ><span class="code-punct">),</span></code
                >
              </div>
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 12 : 11) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-2"
                  ><span class="code-prop">end</span
                  ><span class="code-punct">:</span>
                  <template v-if="visibleExperiences[activeTab].endDate">
                    <span class="code-keyword">new</span>
                    <span class="code-type">Date</span
                    ><span class="code-punct">(</span
                    ><span class="code-string"
                      >"{{ visibleExperiences[activeTab].endDate }}"</span
                    ><span class="code-punct">),</span>
                  </template>
                  <template v-else>
                    <span class="code-keyword">undefined</span
                    ><span class="code-punct">,</span>
                    <span class="code-comment">// current</span>
                  </template></code
                >
              </div>
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 13 : 12) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-2"
                  ><span class="code-prop">duration</span
                  ><span class="code-punct">:</span>
                  <span class="code-string"
                    >"{{ calculateDuration(visibleExperiences[activeTab]) }}"</span
                  ><span class="code-punct">,</span></code
                >
              </div>
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 14 : 13) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-1"><span class="code-punct">},</span></code>
              </div>

              <!-- Tags -->
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 15 : 14) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-1"
                  ><span class="code-prop">tags</span
                  ><span class="code-punct">:</span>
                  <span class="code-punct">[</span
                  ><span
                    v-for="(tag, tIndex) in visibleExperiences[activeTab].tags"
                    :key="tag"
                    ><span class="code-string">"{{ tag }}"</span
                    ><span
                      v-if="tIndex < visibleExperiences[activeTab].tags.length - 1"
                      class="code-punct"
                      >,
                    </span></span
                  ><span class="code-punct">],</span></code
                >
              </div>

              <!-- Technologies -->
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 16 : 15) +
                  visibleExperiences[activeTab].highlights.length
                }}</span>
                <code class="indent-1"
                  ><span class="code-prop">stack</span
                  ><span class="code-punct">:</span>
                  <span class="code-punct">[</span></code
                >
              </div>
              <div
                v-for="(tech, techIndex) in parseTechnologies(
                  visibleExperiences[activeTab].technologies
                )"
                :key="tech"
                class="line"
              >
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 17 : 16) +
                  visibleExperiences[activeTab].highlights.length +
                  techIndex
                }}</span>
                <code class="indent-2"
                  ><span class="code-string">"{{ tech }}"</span
                  ><span
                    v-if="
                      techIndex <
                      parseTechnologies(visibleExperiences[activeTab].technologies).length - 1
                    "
                    class="code-punct"
                    >,</span
                  ></code
                >
              </div>
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 17 : 16) +
                  visibleExperiences[activeTab].highlights.length +
                  parseTechnologies(visibleExperiences[activeTab].technologies).length
                }}</span>
                <code class="indent-1"><span class="code-punct">],</span></code>
              </div>

              <!-- Website -->
              <div class="line" v-if="visibleExperiences[activeTab].website">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 18 : 17) +
                  visibleExperiences[activeTab].highlights.length +
                  parseTechnologies(visibleExperiences[activeTab].technologies).length
                }}</span>
                <code class="indent-1"
                  ><span class="code-prop">website</span
                  ><span class="code-punct">:</span>
                  <span class="code-string"
                    >"<a
                      :href="visibleExperiences[activeTab].website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="code-link"
                      >{{ visibleExperiences[activeTab].website }}</a
                    >"</span
                  ><span class="code-punct">,</span></code
                >
              </div>

              <!-- Closing brace -->
              <div class="line">
                <span class="line-number">{{
                  (visibleExperiences[activeTab].via ? 19 : 18) +
                  visibleExperiences[activeTab].highlights.length +
                  parseTechnologies(visibleExperiences[activeTab].technologies).length +
                  (visibleExperiences[activeTab].website ? 1 : 0)
                }}</span>
                <code><span class="code-punct">};</span></code>
              </div>
            </div>

            <!-- Company logo watermark -->
            <div
              v-if="getCompanyLogo(visibleExperiences[activeTab])"
              class="logo-watermark"
            >
              <img
                :src="getCompanyLogo(visibleExperiences[activeTab])"
                :alt="visibleExperiences[activeTab].company"
              />
            </div>
          </div>

          <!-- Status bar -->
          <div class="editor-statusbar">
            <div class="status-left">
              <span class="status-item">TypeScript</span>
              <span class="status-item">UTF-8</span>
            </div>
            <div class="status-right">
              <span class="status-item"
                >Ln {{ 1 }}, Col {{ 1 }}</span
              >
              <span class="status-item">Spaces: 2</span>
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

  const viaNames: Record<string, string> = {
    toptal: "Toptal",
    tw: "ThoughtWorks",
  };

  function getViaName(via: string): string {
    return viaNames[via] || via;
  }

  const INITIAL_VISIBLE_COUNT = 6;
  const showAll = ref(false);
  const activeTab = ref(0);

  const visibleExperiences = computed(() => {
    if (showAll.value) {
      return experiencesConfig;
    }
    return experiencesConfig.slice(0, INITIAL_VISIBLE_COUNT);
  });

  function closeTab(index: number) {
    if (visibleExperiences.value.length <= 1) return;
    if (activeTab.value >= index && activeTab.value > 0) {
      activeTab.value--;
    }
  }

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
      duration += `${years} year${years > 1 ? "s" : ""}`;
    }
    if (remainingMonths > 0) {
      if (duration) duration += ", ";
      duration += `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
    }
    if (!duration) {
      duration = "< 1 month";
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
    gap: var(--space-6);
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

  /* File tree */
  .file-tree {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .tree-folder {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) 0;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .folder-icon {
    font-size: 14px;
  }

  .folder-name {
    font-weight: var(--font-semibold);
  }

  .tree-file {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-1) var(--space-1) var(--space-1) var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    transition: background-color var(--transition-fast);
  }

  .tree-file:hover {
    background: var(--color-surface-hover);
  }

  .tree-file.active {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  .tree-file.more-files {
    color: var(--color-text-muted);
    font-style: italic;
  }

  .file-icon {
    font-size: 12px;
    opacity: 0.7;
  }

  .file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Content */
  .content {
    flex: 1;
    min-width: 0;
  }

  /* Code editor */
  .code-editor {
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .editor-header {
    display: flex;
    align-items: center;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .window-controls {
    display: flex;
    gap: 8px;
    padding: var(--space-3) var(--space-4);
    flex-shrink: 0;
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

  .editor-tabs {
    display: flex;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .editor-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);
  }

  .tab:hover {
    color: var(--color-text-secondary);
    background: var(--color-surface-hover);
  }

  .tab.active {
    color: var(--color-text-primary);
    background: var(--color-background-elevated);
    border-bottom-color: var(--color-primary);
  }

  .tab-icon {
    font-size: 10px;
    padding: 1px 3px;
    background: var(--color-primary);
    color: white;
    border-radius: 2px;
    font-weight: var(--font-bold);
  }

  .tab-name {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tab-close {
    opacity: 0;
    font-size: 14px;
    line-height: 1;
    padding: 0 2px;
    border-radius: 2px;
    transition: opacity var(--transition-fast);
  }

  .tab:hover .tab-close {
    opacity: 0.5;
  }

  .tab-close:hover {
    opacity: 1 !important;
    background: var(--color-surface-active);
  }

  .editor-breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    background: var(--color-background-elevated);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .breadcrumb-sep {
    opacity: 0.5;
  }

  .breadcrumb-item.active {
    color: var(--color-text-secondary);
  }

  .editor-content {
    position: relative;
    padding: var(--space-4) 0;
    min-height: 400px;
    overflow-x: auto;
  }

  .code-block {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.6;
  }

  .line {
    display: flex;
    padding: 0 var(--space-4);
    min-height: 1.6em;
  }

  .line:hover {
    background: var(--color-surface-hover);
  }

  .line-number {
    color: var(--color-text-muted);
    opacity: 0.5;
    min-width: 40px;
    text-align: right;
    padding-right: var(--space-4);
    user-select: none;
    flex-shrink: 0;
  }

  .line code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .line code.indent-1 {
    padding-left: 2ch;
  }

  .line code.indent-2 {
    padding-left: 4ch;
  }

  /* Syntax highlighting */
  .code-keyword {
    color: var(--color-purple);
  }

  .code-type {
    color: var(--color-teal);
  }

  .code-var {
    color: var(--quadrant-NE);
  }

  .code-prop {
    color: var(--quadrant-NE);
  }

  .code-string {
    color: var(--color-green);
  }

  .code-punct {
    color: var(--color-text-muted);
  }

  .code-comment {
    color: var(--color-text-muted);
    font-style: italic;
  }

  .code-link {
    color: inherit;
    text-decoration: underline;
    text-decoration-style: dotted;
  }

  .code-link:hover {
    color: var(--color-primary);
  }

  /* Logo watermark */
  .logo-watermark {
    position: absolute;
    bottom: var(--space-4);
    right: var(--space-4);
    opacity: 0.08;
    pointer-events: none;
  }

  .logo-watermark img {
    width: 120px;
    height: 120px;
    border-radius: var(--radius-lg);
    object-fit: cover;
  }

  /* Status bar */
  .editor-statusbar {
    display: flex;
    justify-content: space-between;
    padding: var(--space-1) var(--space-4);
    background: var(--color-primary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: white;
  }

  .status-left,
  .status-right {
    display: flex;
    gap: var(--space-4);
  }

  .status-item {
    opacity: 0.9;
  }

  /* Responsive */
  @media (--lg) {
    .sidebar {
      width: 180px;
    }

    .tab-name {
      max-width: 80px;
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

    .file-tree {
      display: none;
    }

    .window-controls {
      display: none;
    }

    .tab-name {
      max-width: 60px;
    }

    .line-number {
      min-width: 30px;
      padding-right: var(--space-2);
    }

    .code-block {
      font-size: var(--text-xs);
    }

    .logo-watermark {
      display: none;
    }
  }
</style>
