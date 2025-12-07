<template>
  <div class="about-page">
    <section class="hero">
      <div class="hero-content">
        <div class="avatar-wrapper">
          <img
            src="https://via.placeholder.com/160"
            alt="Caio Kinzel Filho"
            class="avatar"
          />
        </div>

        <h1 class="name">caio kinzel filho</h1>
        <p class="tagline">software engineer & technical leader</p>

        <p class="bio">
          Building products that matter. Passionate about clean architecture,
          developer experience, and turning complex problems into elegant
          solutions.
        </p>
      </div>
    </section>

    <section class="skills-section">
      <h2 class="section-title">what i do</h2>

      <div class="skills-grid">
        <article v-for="skill in skillsConfig" :key="skill.title" class="skill-card">
          <div class="skill-icon-wrapper">
            <img
              v-if="skill.iconPath"
              :src="skill.iconPath"
              :alt="skill.title"
              class="skill-icon"
            />
            <div v-else class="skill-icon-placeholder"></div>
          </div>

          <h3 class="skill-title">{{ skill.title }}</h3>
          <p class="skill-description">{{ skill.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { skillsConfig } from "../config/skills-config";
</script>

<style scoped>
  .about-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  /* Hero Section */
  .hero {
    max-width: 600px;
    margin: 0 auto var(--space-12) auto;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-wrapper {
    margin-bottom: var(--space-6);
  }

  .avatar {
    width: 160px;
    height: 160px;
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 3px solid var(--color-primary);
  }

  .name {
    font-family: var(--font-mono);
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-2) 0;
  }

  .name::before {
    content: "// ";
    color: var(--color-primary);
  }

  .tagline {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    color: var(--color-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-6) 0;
  }

  .bio {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* Skills Section */
  .skills-section {
    max-width: 1000px;
    margin: 0 auto;
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    text-align: center;
    margin: 0 0 var(--space-8) 0;
  }

  .section-title::before {
    content: "## ";
    color: var(--color-primary);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }

  .skill-card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-md);
    transition:
      background-color var(--transition-theme),
      box-shadow var(--transition-theme),
      transform var(--transition-fast);
  }

  .skill-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .skill-icon-wrapper {
    margin-bottom: var(--space-4);
  }

  .skill-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .skill-icon-placeholder {
    width: 48px;
    height: 48px;
    background: var(--color-primary-light);
    border-radius: var(--radius-md);
  }

  .skill-title {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-3) 0;
  }

  .skill-title::before {
    content: "> ";
    color: var(--color-primary);
  }

  .skill-description {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
  }

  @media (max-width: 768px) {
    .about-page {
      padding: var(--space-6);
    }

    .hero {
      margin-bottom: var(--space-8);
    }

    .avatar {
      width: 120px;
      height: 120px;
    }

    .name {
      font-size: var(--text-2xl);
    }

    .tagline {
      font-size: var(--text-md);
    }

    .bio {
      font-size: var(--text-md);
    }

    .section-title {
      font-size: var(--text-xl);
    }

    .skills-grid {
      grid-template-columns: 1fr;
    }

    .skill-card {
      padding: var(--space-4);
    }
  }
</style>
