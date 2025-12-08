<template>
  <div class="about-page">
    <section class="hero">
      <div class="hero-content">
        <h1 class="name">caio kinzel filho</h1>
        <p class="tagline">software engineer & technical leader</p>

        <p class="bio">
          Building products that matter. Passionate about clean architecture, developer experience,
          and turning complex problems into elegant solutions.
        </p>

        <div class="avatar-wrapper">
          <img :src="avatarImage" alt="Caio Kinzel Filho" class="avatar" />
        </div>
      </div>
    </section>

    <section class="skills-section">
      <h2 class="section-title">what i can do</h2>

      <article v-for="skill in skillsConfig" :key="skill.title" class="skill-block">
        <div class="skill-icon-wrapper">
          <img v-if="skill.iconPath" :src="skill.iconPath" :alt="skill.title" class="skill-icon" />
          <div v-else class="skill-icon-placeholder"></div>
        </div>
        <div class="skill-content">
          <h3 class="skill-title">{{ skill.title }}</h3>
          <p class="skill-description">{{ skill.description }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { skillsConfig } from "../config/skills-config";
  import avatarImage from "../assets/images/avatar.png";
</script>

<style scoped>
  .about-page {
    min-height: calc(100vh - 112px);
    padding: var(--space-8);
  }

  /* Hero Section */
  .hero {
    max-width: var(--content-max-width);
    margin: 0 auto var(--space-12) auto;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-wrapper {
    margin-top: var(--space-8);
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
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    text-transform: lowercase;
    margin: 0 0 var(--space-8) 0;
    text-align: center;
  }

  .section-title::before {
    content: "## ";
    color: var(--color-primary);
  }

  .skill-block {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .skill-block:last-child {
    margin-bottom: 0;
  }

  .skill-icon-wrapper {
    flex-shrink: 0;
  }

  .skill-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    /* Filter to convert black stroke to #667eea (light theme primary) */
    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(220deg) brightness(98%) contrast(89%);
  }

  [data-theme="dark"] .skill-icon {
    /* Filter to convert black stroke to #8b9ef5 (dark theme primary) */
    filter: invert(65%) sepia(47%) saturate(1021%) hue-rotate(203deg) brightness(102%) contrast(92%);
  }

  .skill-icon-placeholder {
    width: 40px;
    height: 40px;
    background: var(--color-primary-light);
    border-radius: var(--radius-md);
  }

  .skill-content {
    flex: 1;
  }

  .skill-title {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
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
    font-size: var(--text-md);
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
      font-size: var(--text-lg);
      margin-bottom: var(--space-6);
    }

    .skill-block {
      margin-bottom: var(--space-6);
    }

    .skill-icon,
    .skill-icon-placeholder {
      width: 32px;
      height: 32px;
    }

    .skill-title {
      font-size: var(--text-md);
    }

    .skill-description {
      font-size: var(--text-base);
    }
  }
</style>
