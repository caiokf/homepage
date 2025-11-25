<template>
  <div id="app">
    <header>
      <h1>Tech Radar</h1>
    </header>
    <main>
      <D3Chart />
    </main>
  </div>
</template>

<script setup lang="ts">
import D3Chart from './components/D3Chart.vue'
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>

