<template>
  <div class="about-page">
    <h1 class="visually-hidden">About Caio Kinzel Filho</h1>

    <!-- Hero with Orbit Visualization -->
    <section class="hero" aria-label="Introduction">
      <div
        ref="heroVisualRef"
        class="hero-visual"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <!-- Orbit SVG Background -->
        <svg
          class="orbit-svg"
          :class="{ 'pulse-active': isPulsing }"
          viewBox="0 0 400 400"
          aria-hidden="true"
        >
          <!-- Inner orbit ring (decorative, no nodes) -->
          <g class="orbit-layer orbit-layer-inner">
            <circle cx="200" cy="200" r="80" class="orbit-ring orbit-ring-inner" />
          </g>

          <!-- Middle orbit - ring + 4 nodes -->
          <g class="orbit-layer orbit-layer-middle">
            <circle cx="200" cy="200" r="130" class="orbit-ring orbit-ring-middle" />
            <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('5') }">
              <circle cx="292" cy="108" r="6" />
            </g>
            <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('6') }">
              <circle cx="292" cy="292" r="6" />
            </g>
            <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('7') }">
              <circle cx="108" cy="292" r="6" />
            </g>
            <g class="orbit-node orbit-middle" :style="{ transform: getNodeTransform('8') }">
              <circle cx="108" cy="108" r="6" />
            </g>
          </g>

          <!-- Outer orbit - ring + 5 nodes -->
          <g class="orbit-layer orbit-layer-outer">
            <circle cx="200" cy="200" r="180" class="orbit-ring orbit-ring-outer" />
            <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('0') }">
              <circle cx="200" cy="20" r="8" />
            </g>
            <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('1') }">
              <circle cx="371" cy="144" r="8" />
            </g>
            <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('2') }">
              <circle cx="306" cy="346" r="8" />
            </g>
            <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('3') }">
              <circle cx="94" cy="346" r="8" />
            </g>
            <g class="orbit-node orbit-outer" :style="{ transform: getNodeTransform('4') }">
              <circle cx="29" cy="144" r="8" />
            </g>
          </g>
        </svg>

        <!-- Avatar in center -->
        <div
          class="avatar-wrapper"
          :class="{ 'pulse-active': isPulsing }"
          @click="triggerGravitationalPulse"
        >
          <img
            :src="currentAvatarImage"
            alt="Caio Kinzel Filho"
            class="avatar"
            :class="{ 'avatar-entering': !hasEnteredAvatar }"
            @animationend="onAvatarAnimationEnd"
          />
          <div class="pulse-ring pulse-ring-1" :class="{ active: isPulsing }"></div>
          <div class="pulse-ring pulse-ring-2" :class="{ active: isPulsing }"></div>
          <div class="pulse-ring pulse-ring-3" :class="{ active: isPulsing }"></div>
        </div>
      </div>

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
  import BaseCursor from "../components/atoms/BaseCursor.vue";
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
    // Inject JSON-LD structured data
    injectJsonLd(personSchema, "schema-person");
    injectJsonLd(websiteSchema, "schema-website");

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
    cleanupJsonLd();
    if (pulseAnimationFrame) {
      cancelAnimationFrame(pulseAnimationFrame);
    }
    if (themeObserver) {
      themeObserver.disconnect();
    }
  });

  // Orbit node configuration with their base positions
  const orbitNodes = [
    // Outer orbit (r=180) - 5 nodes at 72° intervals
    { id: "0", cx: 200, cy: 20, r: 180, angle: -90 },
    { id: "1", cx: 371, cy: 144, r: 180, angle: -18 },
    { id: "2", cx: 306, cy: 346, r: 180, angle: 54 },
    { id: "3", cx: 94, cy: 346, r: 180, angle: 126 },
    { id: "4", cx: 29, cy: 144, r: 180, angle: 198 },
    // Middle orbit (r=130) - 4 nodes at 90° intervals
    { id: "5", cx: 292, cy: 108, r: 130, angle: -45 },
    { id: "6", cx: 292, cy: 292, r: 130, angle: 45 },
    { id: "7", cx: 108, cy: 292, r: 130, angle: 135 },
    { id: "8", cx: 108, cy: 108, r: 130, angle: -135 },
  ];

  // Reactive state for mouse tracking
  const heroVisualRef = ref<HTMLElement | null>(null);
  const mousePos = reactive({ x: 0, y: 0, active: false });
  const nodeOffsets = reactive<Record<string, { x: number; y: number }>>(
    Object.fromEntries(orbitNodes.map((n) => [n.id, { x: 0, y: 0 }]))
  );

  // Avatar entrance tracking (prevents re-triggering entrance animation after pulse)
  const hasEnteredAvatar = ref(false);
  const onAvatarAnimationEnd = (e: AnimationEvent) => {
    if (e.animationName === "avatarEntrance") {
      hasEnteredAvatar.value = true;
    }
  };

  // Gravitational pulse state
  const isPulsing = ref(false);
  const pulseNodeState = reactive<Record<string, { x: number; y: number; vx: number; vy: number }>>(
    Object.fromEntries(orbitNodes.map((n) => [n.id, { x: 0, y: 0, vx: 0, vy: 0 }]))
  );
  let pulseAnimationFrame: number | null = null;

  // Spring physics constants
  const SPRING_STIFFNESS = 0.08;
  const SPRING_DAMPING = 0.85;
  const INITIAL_PULL_STRENGTH = 0.7; // How much nodes are pulled toward center (0-1)

  const triggerGravitationalPulse = () => {
    if (isPulsing.value) return; // Prevent re-triggering while active

    isPulsing.value = true;

    // Initialize node velocities - pull toward center
    orbitNodes.forEach((node) => {
      // Calculate direction toward center (200, 200 in SVG coords)
      const dx = 200 - node.cx;
      const dy = 200 - node.cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Initial impulse toward center
      const pullDistance = distance * INITIAL_PULL_STRENGTH;
      pulseNodeState[node.id] = {
        x: (dx / distance) * pullDistance,
        y: (dy / distance) * pullDistance,
        vx: 0,
        vy: 0,
      };
    });

    // Start spring animation
    animatePulse();

    // Reset pulse state after animation completes
    setTimeout(() => {
      isPulsing.value = false;
    }, 600);
  };

  const animatePulse = () => {
    let allSettled = true;

    orbitNodes.forEach((node) => {
      const state = pulseNodeState[node.id];

      // Spring force pulling back to origin (0, 0)
      const springForceX = -state.x * SPRING_STIFFNESS;
      const springForceY = -state.y * SPRING_STIFFNESS;

      // Apply spring force to velocity
      state.vx = (state.vx + springForceX) * SPRING_DAMPING;
      state.vy = (state.vy + springForceY) * SPRING_DAMPING;

      // Update position
      state.x += state.vx;
      state.y += state.vy;

      // Apply to visual offset
      nodeOffsets[node.id] = { x: state.x, y: state.y };

      // Check if still moving significantly
      const velocity = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      const displacement = Math.sqrt(state.x * state.x + state.y * state.y);
      if (velocity > 0.1 || displacement > 0.5) {
        allSettled = false;
      }
    });

    if (!allSettled) {
      pulseAnimationFrame = requestAnimationFrame(animatePulse);
    } else {
      // Reset to zero
      orbitNodes.forEach((node) => {
        nodeOffsets[node.id] = { x: 0, y: 0 };
        pulseNodeState[node.id] = { x: 0, y: 0, vx: 0, vy: 0 };
      });
      pulseAnimationFrame = null;
    }
  };

  // Gravitational pull settings
  const ATTRACTION_RADIUS = 100; // pixels - how close cursor needs to be
  const MAX_PULL = 16; // max pixels to pull toward cursor
  const PULL_STRENGTH = 0.4; // 0-1, how strong the pull is

  const handleMouseMove = (event: MouseEvent) => {
    if (!heroVisualRef.value) return;

    const rect = heroVisualRef.value.getBoundingClientRect();
    // Convert to SVG coordinate space (400x400 viewBox)
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;

    mousePos.x = (event.clientX - rect.left) * scaleX;
    mousePos.y = (event.clientY - rect.top) * scaleY;
    mousePos.active = true;

    updateNodeOffsets();
  };

  const handleMouseLeave = () => {
    mousePos.active = false;
    // Reset all offsets (CSS transition handles the snap back)
    orbitNodes.forEach((node) => {
      nodeOffsets[node.id] = { x: 0, y: 0 };
    });
  };

  const updateNodeOffsets = () => {
    if (!mousePos.active) return;

    orbitNodes.forEach((node) => {
      // Calculate distance from cursor to node center
      const dx = mousePos.x - node.cx;
      const dy = mousePos.y - node.cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ATTRACTION_RADIUS && distance > 0) {
        // Calculate pull strength (stronger when closer)
        const pullFactor = (1 - distance / ATTRACTION_RADIUS) * PULL_STRENGTH;
        const pull = Math.min(pullFactor * MAX_PULL, MAX_PULL);

        // Normalize direction and apply pull
        nodeOffsets[node.id] = {
          x: (dx / distance) * pull,
          y: (dy / distance) * pull,
        };
      } else {
        nodeOffsets[node.id] = { x: 0, y: 0 };
      }
    });
  };

  // Get transform style for a node
  const getNodeTransform = (nodeId: string) => {
    const offset = nodeOffsets[nodeId];
    if (!offset || (offset.x === 0 && offset.y === 0)) return undefined;
    return `translate(${offset.x}px, ${offset.y}px)`;
  };

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
    background: var(--control-close, #ff5f57);
  }

  .control.minimize {
    background: var(--control-minimize, #febc2e);
  }

  .control.maximize {
    background: var(--control-maximize, #28c840);
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

    .line-number {
      display: none;
    }

    .line {
      padding: 0 var(--space-2);
    }
  }
</style>
