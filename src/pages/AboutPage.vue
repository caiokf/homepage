<template>
  <div class="about-page">
    <!-- Hero with Orbit Visualization -->
    <section class="hero">
      <div class="hero-visual">
        <!-- Orbit SVG Background -->
        <svg class="orbit-svg" viewBox="0 0 400 400" aria-hidden="true">
          <!-- Orbit rings -->
          <circle cx="200" cy="200" r="180" class="orbit-ring orbit-ring-outer" />
          <circle cx="200" cy="200" r="130" class="orbit-ring orbit-ring-middle" />
          <circle cx="200" cy="200" r="80" class="orbit-ring orbit-ring-inner" />

          <!-- Skill nodes on orbits -->
          <!-- Outer orbit - larger concepts -->
          <g class="orbit-node node-architecture">
            <circle cx="200" cy="20" r="8" />
            <text x="200" y="8" class="node-label">arch</text>
          </g>
          <g class="orbit-node node-data">
            <circle cx="380" cy="200" r="8" />
            <text x="380" y="188" class="node-label">data</text>
          </g>
          <g class="orbit-node node-teams">
            <circle cx="200" cy="380" r="8" />
            <text x="200" y="395" class="node-label">teams</text>
          </g>
          <g class="orbit-node node-ai">
            <circle cx="20" cy="200" r="8" />
            <text x="20" y="188" class="node-label">ai</text>
          </g>

          <!-- Middle orbit - secondary skills -->
          <g class="orbit-node node-events">
            <circle cx="292" cy="108" r="6" />
            <text x="305" y="100" class="node-label-small">events</text>
          </g>
          <g class="orbit-node node-scale">
            <circle cx="292" cy="292" r="6" />
            <text x="305" y="300" class="node-label-small">scale</text>
          </g>
          <g class="orbit-node node-dx">
            <circle cx="108" cy="292" r="6" />
            <text x="70" y="300" class="node-label-small">dx</text>
          </g>
          <g class="orbit-node node-mentoring">
            <circle cx="108" cy="108" r="6" />
            <text x="70" y="100" class="node-label-small">mentor</text>
          </g>
        </svg>

        <!-- Avatar in center -->
        <div class="avatar-wrapper">
          <img :src="avatarImage" alt="Caio Kinzel Filho" class="avatar" />
        </div>
      </div>

      <div class="hero-content">
        <div class="hero-code">
          <div class="hero-line">
            <code><span class="code-keyword">const</span> <span class="code-var">engineer</span> <span class="code-punct">= {</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-prop">name</span><span class="code-punct">:</span> <span class="hero-name">"{{ engineer.name }}"</span><span class="code-punct">,</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-prop">location</span><span class="code-punct">:</span> <span class="hero-location">"{{ engineer.location }}"</span><span class="code-punct">,</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-prop">specialties</span><span class="code-punct">: [</span></code>
          </div>
          <div v-for="(specialty, index) in engineer.specialties" :key="specialty" class="hero-line">
            <code class="indent-2"><span class="code-muted">"{{ specialty }}"</span><span class="code-punct">{{ index < engineer.specialties.length - 1 ? ',' : '' }}</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-punct">],</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-prop">offline</span><span class="code-punct">:</span> <span class="code-muted">{{ JSON.stringify(engineer.offline) }}</span></code>
          </div>
          <div class="hero-line">
            <code><span class="code-punct">};</span></code>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section with Code Aesthetic -->
    <section class="skills-section">
      <div class="code-editor">
        <!-- Window controls + Tab bar -->
        <div class="editor-header">
          <div class="window-controls">
            <span class="control close"></span>
            <span class="control minimize"></span>
            <span class="control maximize"></span>
          </div>
          <div class="editor-tabs">
            <span class="tab active">capabilities.ts</span>
          </div>
        </div>

        <!-- Code content -->
        <div class="editor-content">
          <div class="line">
            <span class="line-number">1</span>
            <code><span class="code-keyword">export const</span> <span class="code-var">capabilities</span> <span class="code-punct">= [</span></code>
          </div>

          <article
            v-for="(skill, index) in skillsConfig"
            :key="skill.title"
            class="skill-block"
          >
            <div class="line">
              <span class="line-number">{{ getSkillLineNumber(index, 1) }}</span>
              <code class="indent-1"><span class="code-punct">{</span></code>
            </div>
            <div class="line">
              <span class="line-number">{{ getSkillLineNumber(index, 2) }}</span>
              <code class="indent-2"><span class="code-prop">name</span><span class="code-punct">:</span> <span class="code-string">"{{ skill.title }}"</span><span class="code-punct">,</span></code>
            </div>
            <div class="line description-line">
              <span class="line-number">{{ getSkillLineNumber(index, 3) }}</span>
              <code class="indent-2"><span class="code-prop">desc</span><span class="code-punct">:</span> <span class="code-desc">"{{ skill.description }}"</span></code>
            </div>
            <div class="line">
              <span class="line-number">{{ getSkillLineNumber(index, 4) }}</span>
              <code class="indent-1"><span class="code-punct">}{{ index < skillsConfig.length - 1 ? ',' : '' }}</span></code>
            </div>
          </article>

          <div class="line">
            <span class="line-number">{{ closingBracketLine }}</span>
            <code><span class="code-punct">];</span></code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { skillsConfig } from "../domain/about/data";
  import avatarImage from "../assets/images/avatar.png";

  const engineer = {
    name: "caio kinzel filho",
    location: "Sunshine Coast, Australia",
    specialties: ["architecture", "event-driven systems", "engineering teams"],
    offline: ["trails", "beach", "sim racing"],
  };

  // Line numbering for code editor aesthetic
  // Structure: 1 (header) + n * LINES_PER_SKILL + 1 (closing bracket)
  const LINES_PER_SKILL = 4; // { + name + desc + }

  const getSkillLineNumber = (skillIndex: number, lineOffset: number) =>
    skillIndex * LINES_PER_SKILL + lineOffset + 1; // +1 for header line

  const closingBracketLine = computed(() => skillsConfig.length * LINES_PER_SKILL + 2);
</script>

<style scoped>
  .about-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  /* Hero Section with Orbit */
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-8);
    max-width: 1000px;
    margin: 0 auto var(--space-12) auto;
  }

  @media (min-width: 769px) {
    .hero {
      flex-direction: row;
      justify-content: center;
    }
  }

  /* Orbit Visualization */
  .hero-visual {
    position: relative;
    width: 320px;
    height: 320px;
    flex-shrink: 0;
  }

  .orbit-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    animation: orbit-rotate 60s linear infinite;
    will-change: transform;
  }

  @keyframes orbit-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .orbit-ring {
    fill: none;
    stroke: var(--color-border);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.5;
  }

  .orbit-ring-inner {
    stroke-dasharray: 2 2;
  }

  .orbit-node circle {
    fill: var(--color-primary);
    opacity: 0.8;
  }

  .node-architecture circle {
    fill: var(--quadrant-NE);
  }

  .node-data circle {
    fill: var(--quadrant-NW);
  }

  .node-teams circle {
    fill: var(--quadrant-SW);
  }

  .node-ai circle {
    fill: var(--quadrant-SE);
  }

  .node-events circle,
  .node-scale circle {
    fill: var(--quadrant-NE);
    opacity: 0.6;
  }

  .node-dx circle,
  .node-mentoring circle {
    fill: var(--quadrant-SW);
    opacity: 0.6;
  }

  .node-label,
  .node-label-small {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: var(--color-text-secondary);
    text-anchor: middle;
    animation: orbit-counter-rotate 60s linear infinite;
    will-change: transform;
  }

  .node-label-small {
    font-size: 8px;
  }

  @keyframes orbit-counter-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  .avatar-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .avatar {
    width: 140px;
    height: 140px;
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 3px solid var(--color-primary);
    box-shadow: 0 0 40px #3d8a8a33;
  }

  /* Hero Content - Code Aesthetic */
  .hero-content {
    text-align: left;
    max-width: 480px;
  }

  .hero-code {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.8;
  }

  .hero-line code {
    white-space: pre-wrap;
  }

  .hero-line code.indent-1 {
    padding-left: 1.5ch;
  }

  .hero-line code.indent-2 {
    padding-left: 3ch;
  }

  .code-keyword {
    color: var(--color-purple);
  }

  .code-var {
    color: var(--quadrant-NE);
  }

  .code-punct {
    color: var(--color-text-muted);
  }

  .code-prop {
    color: var(--quadrant-NE);
  }

  .code-string {
    color: var(--color-green);
  }

  .code-muted {
    color: var(--color-text-muted);
  }

  .hero-name {
    color: var(--color-text-primary);
    font-size: 26px;
    font-weight: var(--font-semibold);
  }

  .hero-location {
    color: var(--color-primary);
    font-size: 16px;
    font-weight: var(--font-semibold);
    text-transform: lowercase;
  }

  /* Skills Section - Code Editor */
  .skills-section {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

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
  }

  .tab {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-3) var(--space-4);
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }

  .tab.active {
    color: var(--color-text-primary);
    background: var(--color-background-elevated);
    border-bottom-color: var(--color-primary);
  }

  .editor-content {
    padding: var(--space-4) 0;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.7;
    overflow-x: auto;
  }

  .line {
    display: flex;
    align-items: flex-start;
    padding: 0 var(--space-4);
    min-height: 1.7em;
  }

  .line:hover {
    background: var(--color-surface-hover);
  }

  .line code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .line code.indent-1 {
    padding-left: 1.5ch;
  }

  .line code.indent-2 {
    padding-left: 3ch;
  }

  .line-number {
    color: var(--color-text-muted);
    opacity: 0.5;
    min-width: 32px;
    text-align: right;
    padding-right: var(--space-4);
    user-select: none;
    flex-shrink: 0;
  }

  .code-desc {
    color: var(--color-text-muted);
  }

  .skill-block {
    margin: var(--space-2) 0;
    transition: background-color var(--transition-fast);
    border-radius: var(--radius-sm);
  }

  .skill-block:hover .line {
    background: var(--color-surface-hover);
  }

  .description-line code {
    line-height: var(--leading-relaxed);
  }

  /* Responsive */
  @media (--md) {
    .about-page {
      padding: var(--space-6);
    }

    .hero {
      margin-bottom: var(--space-8);
      gap: var(--space-6);
    }

    .hero-visual {
      width: 260px;
      height: 260px;
    }

    .avatar {
      width: 110px;
      height: 110px;
    }

    .hero-code {
      font-size: var(--text-xs);
    }

    .hero-name {
      font-size: 22px;
    }

    .hero-location {
      font-size: 14px;
    }

    .editor-content {
      font-size: var(--text-xs);
    }

    .line-number {
      min-width: 24px;
      padding-right: var(--space-2);
    }
  }

  @media (--sm) {
    .hero-visual {
      width: 220px;
      height: 220px;
    }

    .avatar {
      width: 90px;
      height: 90px;
    }

    .node-label,
    .node-label-small {
      display: none;
    }

    .line-number {
      display: none;
    }

    .line {
      padding: 0 var(--space-2);
    }
  }
</style>
