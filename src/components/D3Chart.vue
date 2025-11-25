<template>
  <div class="chart-container">
    <svg ref="svgRef" class="d3-chart"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import d3Tip from 'd3-tip'

const svgRef = ref<SVGSVGElement | null>(null)

onMounted(() => {
  if (!svgRef.value) return

  const width = 800
  const height = 600
  const margin = { top: 40, right: 40, bottom: 40, left: 40 }

  // Set up SVG
  const svg = d3
    .select(svgRef.value)
    .attr('width', width)
    .attr('height', height)

  // Create chart area
  const chart = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // Sample data
  const data = [
    { x: 10, y: 20, value: 5, label: 'Point A' },
    { x: 30, y: 50, value: 8, label: 'Point B' },
    { x: 50, y: 30, value: 12, label: 'Point C' },
    { x: 70, y: 80, value: 15, label: 'Point D' },
    { x: 90, y: 40, value: 10, label: 'Point E' },
  ]

  // Set up scales
  const xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, chartWidth])

  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([chartHeight, 0])

  // Set up tooltip
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((d: any) => {
      return `<div>
        <strong>${d.label}</strong><br/>
        X: ${d.x}, Y: ${d.y}<br/>
        Value: ${d.value}
      </div>`
    })

  svg.call(tip as any)

  // Add axes
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  chart
    .append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(xAxis)

  chart.append('g').call(yAxis)

  // Add axis labels
  chart
    .append('text')
    .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 35})`)
    .style('text-anchor', 'middle')
    .text('X Axis')

  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -30)
    .attr('x', -chartHeight / 2)
    .style('text-anchor', 'middle')
    .text('Y Axis')

  // Add data points
  chart
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', (d) => d.value)
    .attr('fill', '#667eea')
    .attr('opacity', 0.7)
    .on('mouseover', function (event, d) {
      tip.show(d, this)
      d3.select(this).attr('opacity', 1).attr('r', (d as any).value * 1.2)
    })
    .on('mouseout', function (event, d) {
      tip.hide()
      d3.select(this).attr('opacity', 0.7).attr('r', (d as any).value)
    })
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.d3-chart {
  display: block;
  margin: 0 auto;
}

:deep(.d3-tip) {
  line-height: 1.5;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
}

:deep(.d3-tip:after) {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: '\25BC';
  position: absolute;
  text-align: center;
}

:deep(.d3-tip.n:after) {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
</style>

