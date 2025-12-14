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
        <div class="code-block">
          <span class="code-keyword">const</span>
          <span class="code-var"> engineer</span>
          <span class="code-punct"> = {</span>
        </div>
        <h1 class="name">caio kinzel filho</h1>
        <p class="tagline">location: "Sunshine Coast, Australia"</p>
        <p class="bio">
          since: 2005,<br />
          focus: "turning complex problems into scalable, elegant solutions",<br />
          specialties: ["architecture", "event-driven systems", "engineering teams"],<br />
          offline: ["trails", "beach", "sim racing"]
        </p>
        <div class="code-block">
          <span class="code-punct">};</span>
        </div>
      </div>
    </section>

    <!-- Skills Section with Code Aesthetic -->
    <section class="skills-section">
      <div class="section-header">
        <span class="code-keyword">function</span>
        <span class="code-func"> capabilities</span>
        <span class="code-punct">() {</span>
      </div>

      <div class="skills-list">
        <article
          v-for="(skill, index) in skillsConfig"
          :key="skill.title"
          class="skill-block"
        >
          <span class="line-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="skill-icon-wrapper">
            <img
              v-if="skill.iconPath"
              :src="skill.iconPath"
              :alt="skill.title"
              class="skill-icon"
            />
            <div v-else class="skill-icon-placeholder"></div>
          </div>
          <div class="skill-content">
            <h3 class="skill-title">{{ skill.title }}</h3>
            <p class="skill-description">{{ skill.description }}</p>
          </div>
        </article>
      </div>

      <div class="section-footer">
        <span class="code-punct">}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { skillsConfig } from "../domain/about/data";
  import avatarImage from "../assets/images/avatar.png";
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
    box-shadow: 0 0 40px rgba(var(--color-primary), 0.2);
  }

  /* Hero Content - Code Aesthetic */
  .hero-content {
    text-align: left;
    max-width: 480px;
  }

  .code-block {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    margin-bottom: var(--space-2);
  }

  .code-keyword {
    color: var(--color-purple);
  }

  .code-var {
    color: var(--quadrant-NE);
  }

  .code-func {
    color: var(--quadrant-NW);
  }

  .code-punct {
    color: var(--color-text-muted);
  }

  .name {
    font-family: var(--font-mono);
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-2) 0;
    padding-left: var(--space-4);
  }

  .name::before {
    content: 'name: "';
    color: var(--color-text-muted);
    font-weight: var(--font-normal);
    font-size: var(--text-lg);
  }

  .name::after {
    content: '",';
    color: var(--color-text-muted);
    font-weight: var(--font-normal);
    font-size: var(--text-lg);
  }

  .tagline {
    font-family: var(--font-mono);
    font-size: var(--text-md);
    color: var(--color-primary);
    margin: 0 0 var(--space-3) 0;
    padding-left: var(--space-4);
  }

  .bio {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
    padding-left: var(--space-4);
  }

  /* Skills Section */
  .skills-section {
    max-width: var(--content-max-width);
    margin: 0 auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
  }

  .section-header,
  .section-footer {
    font-family: var(--font-mono);
    font-size: var(--text-md);
  }

  .section-header {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .section-footer {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border-subtle);
    color: var(--color-text-muted);
  }

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .skill-block {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }

  .skill-block:hover {
    background: var(--color-surface-hover);
  }

  .line-number {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    opacity: 0.5;
    min-width: 24px;
    flex-shrink: 0;
    padding-top: 2px;
  }

  .skill-icon-wrapper {
    flex-shrink: 0;
  }

  .skill-icon {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: invert(45%) sepia(50%) saturate(500%) hue-rotate(140deg) brightness(95%) contrast(95%);
  }

  [data-theme="dark"] .skill-icon {
    filter: invert(55%) sepia(40%) saturate(400%) hue-rotate(140deg) brightness(110%) contrast(90%);
  }

  .skill-icon-placeholder {
    width: 36px;
    height: 36px;
    background: var(--color-primary-light);
    border-radius: var(--radius-md);
  }

  .skill-content {
    flex: 1;
  }

  .skill-title {
    font-family: var(--font-mono);
    font-size: var(--text-md);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-2) 0;
  }

  .skill-title::before {
    content: "// ";
    color: var(--color-primary);
  }

  .skill-description {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
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

    .hero-content {
      text-align: center;
    }

    .name {
      font-size: var(--text-xl);
    }

    .code-block,
    .tagline,
    .bio {
      padding-left: 0;
    }

    .skills-section {
      padding: var(--space-4);
    }

    .section-header,
    .section-footer {
      font-size: var(--text-sm);
    }

    .skill-block {
      padding: var(--space-3);
      flex-wrap: wrap;
    }

    .line-number {
      display: none;
    }

    .skill-icon,
    .skill-icon-placeholder {
      width: 28px;
      height: 28px;
    }

    .skill-title {
      font-size: var(--text-base);
    }

    .skill-description {
      font-size: var(--text-sm);
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
  }
</style>
