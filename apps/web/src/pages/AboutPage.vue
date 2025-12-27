<template>
  <div class="about-page h-card" itemscope itemtype="https://schema.org/Person">
    <h1 class="visually-hidden p-name" itemprop="name">Caio Kinzel Filho</h1>
    <link class="u-url u-uid" rel="me" href="https://dev.caiokf.com/" itemprop="url" />
    <!-- Hidden h-card metadata for parsers -->
    <data class="p-note visually-hidden" itemprop="description">
      Software engineer specializing in architecture, event-driven systems, and engineering teams.
    </data>
    <a class="u-email visually-hidden" rel="me" href="mailto:caiokf@gmail.com" itemprop="email">caiokf@gmail.com</a>
    <a class="u-url visually-hidden" rel="me" href="https://github.com/caiokf" itemprop="sameAs">GitHub</a>
    <a class="u-url visually-hidden" rel="me" href="https://www.linkedin.com/in/caiokf/" itemprop="sameAs">LinkedIn</a>
    <data class="p-job-title visually-hidden" itemprop="jobTitle">Software Engineer</data>

    <!-- Hero with Orbit Visualization -->
    <section class="hero" aria-label="Introduction">
      <OrbitAvatar />

      <div class="hero-content">
        <div class="hero-code">
          <div class="hero-line">
            <code
              ><span class="code-keyword">const</span>&nbsp;<span class="code-var">engineer</span
              >&nbsp;<span class="code-punct">= {</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">name</span><span class="code-punct">:</span>&nbsp;<span
                class="hero-name p-nickname"
                >"{{ engineer.name }}"</span
              ><span class="code-punct">,</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">location</span><span class="code-punct">:</span>&nbsp;<span
                class="hero-location p-locality"
                itemprop="address"
                itemscope
                itemtype="https://schema.org/PostalAddress"
                >"<span itemprop="addressLocality">{{ engineer.location }}</span>"</span
              ><span class="code-punct">,</span></code
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
              ><span class="code-muted">"{{ specialty }}"</span
              ><span class="code-punct">{{
                index < engineer.specialties.length - 1 ? "," : ""
              }}</span></code
            >
          </div>
          <div class="hero-line">
            <code class="indent-1"><span class="code-punct">],</span></code>
          </div>
          <div class="hero-line">
            <code class="indent-1"
              ><span class="code-prop">offline</span><span class="code-punct">:</span>&nbsp;<span
                class="code-muted"
                >{{ JSON.stringify(engineer.offline) }}</span
              ></code
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
      <CodeEditor>
        <CodeEditorFile name="capabilities.ts">
          <div class="line">
            <span class="line-number">1</span>
            <code
              ><span class="code-keyword">export const</span>&nbsp;<span class="code-var"
                >capabilities</span
              >&nbsp;<span class="code-punct">= [</span></code
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
                ><span class="code-prop">name</span><span class="code-punct">:</span>&nbsp;<span
                  class="code-string"
                  >"{{ skill.title }}"</span
                ><span class="code-punct">,</span></code
              >
            </div>
            <div class="line description-line">
              <span class="line-number">{{ getSkillLineNumber(index, 3) }}</span>
              <code class="indent-2"
                ><span class="code-prop">desc</span><span class="code-punct">:</span>&nbsp;<span
                  class="code-desc"
                  >"{{ skill.description }}"</span
                ></code
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
        </CodeEditorFile>
      </CodeEditor>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { skillsConfig } from "../domain/about/data";
  import { socialsConfig } from "../domain/layout/data";
  import { useJsonLd } from "../composables/useJsonLd";
  import BaseCursor from "../components/atoms/BaseCursor.vue";
  import CodeEditor from "../components/organisms/CodeEditor.vue";
  import CodeEditorFile from "../components/molecules/CodeEditorFile.vue";
  import OrbitAvatar from "../components/organisms/OrbitAvatar.vue";

  // JSON-LD Structured Data
  useJsonLd({
    "schema-person": {
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
      knowsAbout: ["Software Architecture", "Event-Driven Systems", "Engineering Teams"],
      sameAs: socialsConfig.filter((s) => s.network !== "Email").map((s) => s.url),
    },
    "schema-website": {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "caiokf",
      url: "https://dev.caiokf.com",
      author: {
        "@type": "Person",
        name: "Caio Kinzel Filho",
      },
    },
  });

  const engineer = {
    name: "caio kinzel filho",
    location: "Sunshine Coast, Australia",
    specialties: ["architecture", "event-driven systems", "ai engineering"],
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
