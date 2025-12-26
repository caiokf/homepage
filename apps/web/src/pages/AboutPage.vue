<template>
  <div class="about-page">
    <h1 class="visually-hidden">About Caio Kinzel Filho</h1>

    <!-- Hero with Orbit Visualization -->
    <section class="hero" aria-label="Introduction">
      <OrbitAvatar />

      <div class="hero-content">
        <div class="hero-code">
          <div class="hero-line">
            <code
              ><span class="code-keyword">const</span>&nbsp;<span class="code-var">engineer</span>&nbsp;<span class="code-punct">= {</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">name</span><span class="code-punct">:</span>&nbsp;<span class="hero-name">"{{ engineer.name }}"</span><span class="code-punct">,</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">location</span><span class="code-punct">:</span>&nbsp;<span class="hero-location">"{{ engineer.location }}"</span><span class="code-punct">,</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">specialties</span><span class="code-punct">: [</span></code
            >
          </div>
          <div
            v-for="(specialty, index) in engineer.specialties"
            :key="specialty"
            class="hero-line"
          >
            <code class="indent-2"
              ><span class="code-muted">"{{ specialty }}"</span><span class="code-punct">{{ index < engineer.specialties.length - 1 ? "," : "" }}</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-punct">],</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">offline</span><span class="code-punct">:</span>&nbsp;<span class="code-muted">{{ JSON.stringify(engineer.offline) }}</span></code
            >
          </div>
          <div class="hero-line">
            <code><span class="code-punct">};</span></code>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section with Code Aesthetic -->
    <section class="skills-section" aria-label="Capabilities">
      <div class="code-editor">
        <!-- Window controls + Tab bar -->
        <div class="editor-header">
          <BaseWindowControls />
          <div class="editor-tabs">
            <span class="tab active">capabilities.ts</span>
          </div>
        </div>

        <!-- Code content -->
        <div class="editor-content">
          <div class="line">
            <span class="line-number">1</span>
            <code
              ><span class="code-keyword">export const</span>&nbsp;<span class="code-var">capabilities</span>&nbsp;<span class="code-punct">= [</span></code
            >
          </div>

          <article
            v-for="(skill, index) in skillsConfig"
            :key="skill.title"
            class="skill-block"
            :style="{ '--typing-delay': `${index * 150}ms` }"
          >
            <div class="line">
              <span class="line-number">{{ getSkillLineNumber(index, 1) }}</span>
              <code class="indent-1"><span class="code-punct">{</span></code>
            </div>
            <div class="line">
              <span class="line-number">{{ getSkillLineNumber(index, 2) }}</span>
              <code class="indent-2"
                ><span class="code-prop">name</span><span class="code-punct">:</span>&nbsp;<span class="code-string">"{{ skill.title }}"</span><span class="code-punct">,</span></code
              >
            </div>
            <div class="line description-line">
              <span class="line-number">{{ getSkillLineNumber(index, 3) }}</span>
              <code class="indent-2"
                ><span class="code-prop">desc</span><span class="code-punct">:</span>&nbsp;<span class="code-desc">"{{ skill.description }}"</span></code
              >
            </div>
            <div class="line">
              <span class="line-number">{{ getSkillLineNumber(index, 4) }}</span>
              <code class="indent-1"
                ><span class="code-punct"
                  >}{{ index < skillsConfig.length - 1 ? "," : "" }}</span
                ></code
              >
            </div>
          </article>

          <div class="line">
            <span class="line-number">{{ closingBracketLine }}</span>
            <code>
              <span class="code-punct">];</span>
              <BaseCursor :delay="skillsConfig.length * 150 + 400" animate />
            </code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, reactive, onMounted, onUnmounted } from "vue";
  import { skillsConfig } from "../domain/about/data";
  import { socialsConfig } from "../domain/layout/data";
<<<<<<< ours
  import BaseCursor from "../components/atoms/BaseCursor.vue";
||||||| ancestor
=======
  import BaseWindowControls from "../components/atoms/BaseWindowControls.vue";
>>>>>>> theirs
  import avatarImage from "../assets/images/avatar.png";
  import avatarSunglassesImage from "../assets/images/avatar-sunglasses.png";

  // JSON-LD Structured Data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Caio Kinzel Filho",
    url: "https://dev.caiokf.com",
    jobTitle: "Software Engineer",
    description:
      "Software engineer specializing in architecture, event-driven systems, and engineering teams.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sunshine Coast",
      addressCountry: "Australia",
    },
    knowsAbout: [
      "Software Architecture",
      "Event-Driven Systems",
      "Engineering Teams",
      "Vue.js",
      "TypeScript",
    ],
    sameAs: socialsConfig
      .filter((s) => s.network !== "Email")
      .map((s) => s.url),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "caiokf",
    url: "https://dev.caiokf.com",
    author: {
      "@type": "Person",
      name: "Caio Kinzel Filho",
    },
  };

  // Track injected JSON-LD script IDs for cleanup
  const injectedJsonLdIds: string[] = [];

  function injectJsonLd(schema: object, id: string) {
    const existingScript = document.getElementById(id);
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    injectedJsonLdIds.push(id);
  }

  function cleanupJsonLd() {
    injectedJsonLdIds.forEach((id) => {
      const script = document.getElementById(id);
      if (script) script.remove();
    });
    injectedJsonLdIds.length = 0;
  }

  // Sunglasses avatar for dark-to-light transition
  const showSunglasses = ref(false);
  const currentAvatarImage = computed(() =>
    showSunglasses.value ? avatarSunglassesImage : avatarImage
  );
  let themeObserver: MutationObserver | null = null;

  onMounted(() => {
    // Watch for theme transition classes on html element
    themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const html = document.documentElement;
          if (html.classList.contains("theme-to-light")) {
            showSunglasses.value = true;
          } else if (html.classList.contains("theme-to-dark")) {
            showSunglasses.value = false;
          }
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });
  });

  onUnmounted(() => {
    if (themeObserver) {
      themeObserver.disconnect();
    }
>>>>>>> theirs
  });

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

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
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
  }

  .orbit-layer {
    transform-origin: 200px 200px;
    will-change: transform;
  }

  .orbit-layer-outer {
    animation: orbit-rotate var(--orbit-speed, 60s) linear infinite;
  }

  .orbit-layer-middle {
    animation: orbit-rotate calc(var(--orbit-speed, 60s) * 0.7) linear infinite;
  }

  .orbit-layer-inner {
    animation: orbit-rotate calc(var(--orbit-speed, 60s) * 0.4) linear infinite;
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

  .orbit-node {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Disable transition during spring physics animation */
  .pulse-active .orbit-node {
    transition: none;
  }

  /* Glow effect on nodes during pulse */
  .pulse-active .orbit-node circle {
    animation: nodeGlow 600ms ease-out;
  }

  @keyframes nodeGlow {
    0% {
      filter: drop-shadow(0 0 0 currentColor);
    }
    30% {
      filter: drop-shadow(0 0 12px currentColor);
    }
    100% {
      filter: drop-shadow(0 0 0 currentColor);
    }
  }

  .orbit-node circle {
    fill: var(--color-primary);
    opacity: 0.8;
    transition: filter 0.2s ease;
  }

  .orbit-node:hover circle {
    filter: drop-shadow(0 0 6px currentColor);
  }

  .orbit-outer circle {
    fill: var(--color-primary);
  }

  .orbit-middle circle {
    fill: var(--color-primary);
    opacity: 0.6;
  }

  @keyframes avatarEntrance {
    0% {
      opacity: 0;
      transform: scale(0.8);
      filter: drop-shadow(0 0 0 rgba(61, 138, 138, 0));
    }
    60% {
      opacity: 1;
      transform: scale(1.05);
      filter: drop-shadow(0 0 20px rgba(61, 138, 138, 0.6));
    }
    100% {
      opacity: 1;
      transform: scale(1);
      filter: drop-shadow(0 0 12px rgba(61, 138, 138, 0.3));
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
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .avatar.avatar-entering {
    animation: avatarEntrance 800ms ease-out forwards;
  }

  .avatar:hover {
    transform: scale(1.05);
  }

  .avatar:active {
    transform: scale(0.95);
  }


  /* Shockwave pulse rings */
  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-primary);
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
    pointer-events: none;
  }

  .pulse-ring.active {
    animation: pulseRingExpand 600ms ease-out forwards;
  }

  .pulse-ring-2.active {
    animation-delay: 80ms;
  }

  .pulse-ring-3.active {
    animation-delay: 160ms;
  }

  @keyframes pulseRingExpand {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
      border-width: 3px;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.8);
      opacity: 0;
      border-width: 1px;
    }
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

  .editor-header :deep(.base-window-controls) {
    padding: var(--space-3) var(--space-4);
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
    transition: opacity var(--transition-fast), color var(--transition-fast);
    min-width: 32px;
    text-align: right;
    padding-right: var(--space-4);
    user-select: none;
    flex-shrink: 0;
  }

  .code-desc {
    color: var(--color-text-muted);
  }

  /* Skill block typing entrance animation */
  @keyframes skillTyping {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .skill-block {
    margin: var(--space-2) 0;
    border-radius: var(--radius-sm);
    animation: skillTyping 400ms ease-out backwards;
    animation-delay: var(--typing-delay, 0ms);
    position: relative;
  }

  /* VS Code-style line highlight on hover */
  .skill-block::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--color-primary);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .skill-block:hover::before {
    opacity: 1;
  }

  .skill-block:hover .line {
    background: var(--color-surface-hover);
  }

  .skill-block:hover .line-number {
    opacity: 1;
    color: var(--color-primary);
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
    .line-number {
      display: none;
    }

    .line {
      padding: 0 var(--space-2);
    }
  }
</style>
