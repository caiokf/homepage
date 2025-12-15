<template>
  <div class="about-page">
    <!-- Hero with Orbit Visualization -->
    <section class="hero">
      <div
        ref="heroVisualRef"
        class="hero-visual"
        :style="{ '--orbit-speed': `${orbitSpeed}s` }"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <!-- Orbit SVG Background -->
        <svg class="orbit-svg" viewBox="0 0 400 400" aria-hidden="true">
          <!-- Orbit rings -->
          <circle cx="200" cy="200" r="180" class="orbit-ring orbit-ring-outer" />
          <circle cx="200" cy="200" r="130" class="orbit-ring orbit-ring-middle" />
          <circle cx="200" cy="200" r="80" class="orbit-ring orbit-ring-inner" />

          <!-- Skill nodes on orbits -->
          <!-- Outer orbit - larger concepts -->
          <g class="orbit-node node-architecture" :style="{ transform: getNodeTransform('architecture') }">
            <circle cx="200" cy="20" r="8" />
            <text x="200" y="8" class="node-label">arch</text>
          </g>
          <g class="orbit-node node-data" :style="{ transform: getNodeTransform('data') }">
            <circle cx="380" cy="200" r="8" />
            <text x="380" y="188" class="node-label">data</text>
          </g>
          <g class="orbit-node node-teams" :style="{ transform: getNodeTransform('teams') }">
            <circle cx="200" cy="380" r="8" />
            <text x="200" y="395" class="node-label">teams</text>
          </g>
          <g class="orbit-node node-ai" :style="{ transform: getNodeTransform('ai') }">
            <circle cx="20" cy="200" r="8" />
            <text x="20" y="188" class="node-label">ai</text>
          </g>

          <!-- Middle orbit - secondary skills -->
          <g class="orbit-node node-events" :style="{ transform: getNodeTransform('events') }">
            <circle cx="292" cy="108" r="6" />
            <text x="305" y="100" class="node-label-small">events</text>
          </g>
          <g class="orbit-node node-scale" :style="{ transform: getNodeTransform('scale') }">
            <circle cx="292" cy="292" r="6" />
            <text x="305" y="300" class="node-label-small">scale</text>
          </g>
          <g class="orbit-node node-dx" :style="{ transform: getNodeTransform('dx') }">
            <circle cx="108" cy="292" r="6" />
            <text x="70" y="300" class="node-label-small">dx</text>
          </g>
          <g class="orbit-node node-mentoring" :style="{ transform: getNodeTransform('mentoring') }">
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
            :style="{ '--typing-delay': `${index * 150}ms` }"
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
            <code><span class="code-punct">];</span><span class="cursor" :style="{ '--cursor-delay': `${skillsConfig.length * 150 + 400}ms` }"></span></code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, reactive, onMounted, onUnmounted } from "vue";
  import { skillsConfig } from "../domain/about/data";
  import avatarImage from "../assets/images/avatar.png";

  // Scroll speed shift state
  const orbitSpeed = ref(60); // Base: 60 seconds per rotation
  const MIN_SPEED = 8; // Fastest rotation (8s per cycle)
  const SPEED_RECOVERY = 0.92; // How quickly speed returns to normal (0-1)
  const SCROLL_SENSITIVITY = 0.15; // How much scroll affects speed

  let lastScrollY = 0;
  let speedDecayFrame: number | null = null;

  const handleScroll = () => {
    const scrollDelta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;

    // Reduce orbit duration based on scroll speed (faster scroll = shorter duration)
    const speedBoost = scrollDelta * SCROLL_SENSITIVITY;
    orbitSpeed.value = Math.max(MIN_SPEED, orbitSpeed.value - speedBoost);

    // Start decay back to normal if not already running
    if (!speedDecayFrame) {
      decaySpeed();
    }
  };

  const decaySpeed = () => {
    if (orbitSpeed.value < 59.5) {
      // Gradually return to base speed
      orbitSpeed.value = orbitSpeed.value + (60 - orbitSpeed.value) * (1 - SPEED_RECOVERY);
      speedDecayFrame = requestAnimationFrame(decaySpeed);
    } else {
      orbitSpeed.value = 60;
      speedDecayFrame = null;
    }
  };

  onMounted(() => {
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    if (speedDecayFrame) {
      cancelAnimationFrame(speedDecayFrame);
    }
  });

  // Orbit node configuration with their base positions
  const orbitNodes = [
    // Outer orbit (r=180)
    { id: "architecture", cx: 200, cy: 20, r: 180, angle: -90 },
    { id: "data", cx: 380, cy: 200, r: 180, angle: 0 },
    { id: "teams", cx: 200, cy: 380, r: 180, angle: 90 },
    { id: "ai", cx: 20, cy: 200, r: 180, angle: 180 },
    // Middle orbit (r=130) - positioned at 45° angles
    { id: "events", cx: 292, cy: 108, r: 130, angle: -45 },
    { id: "scale", cx: 292, cy: 292, r: 130, angle: 45 },
    { id: "dx", cx: 108, cy: 292, r: 130, angle: 135 },
    { id: "mentoring", cx: 108, cy: 108, r: 130, angle: -135 },
  ];

  // Reactive state for mouse tracking
  const heroVisualRef = ref<HTMLElement | null>(null);
  const mousePos = reactive({ x: 0, y: 0, active: false });
  const nodeOffsets = reactive<Record<string, { x: number; y: number }>>(
    Object.fromEntries(orbitNodes.map((n) => [n.id, { x: 0, y: 0 }]))
  );

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
    animation: orbit-rotate var(--orbit-speed, 60s) linear infinite;
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

  .orbit-node {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .orbit-node circle {
    fill: var(--color-primary);
    opacity: 0.8;
    transition: filter 0.2s ease;
  }

  .orbit-node:hover circle {
    filter: drop-shadow(0 0 6px currentColor);
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
    animation: orbit-counter-rotate var(--orbit-speed, 60s) linear infinite;
    will-change: transform;
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes orbit-counter-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  .node-label-small {
    font-size: 8px;
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
    animation: avatarEntrance 800ms ease-out;
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
    transition: background-color var(--transition-fast);
    border-radius: var(--radius-sm);
    animation: skillTyping 400ms ease-out backwards;
    animation-delay: var(--typing-delay, 0ms);
  }

  .skill-block:hover .line {
    background: var(--color-surface-hover);
  }

  .description-line code {
    line-height: var(--leading-relaxed);
  }

  /* Blinking cursor */
  .cursor {
    display: inline-block;
    width: 0.6em;
    height: 1.1em;
    background: var(--color-primary);
    margin-left: 2px;
    vertical-align: text-bottom;
    opacity: 0;
    animation:
      cursorAppear 200ms ease-out forwards,
      cursorBlink 1s step-end infinite;
    animation-delay: var(--cursor-delay, 0ms), var(--cursor-delay, 0ms);
  }

  @keyframes cursorAppear {
    to {
      opacity: 1;
    }
  }

  @keyframes cursorBlink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
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
