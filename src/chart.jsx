import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Function to persist node positions
function saveNodePositions(nodes) {
  localStorage.setItem('nodePositions', JSON.stringify(nodes.map(d => ({ id: d.id, x: d.x, y: d.y }))));
}

// Function to persist zoom state
function saveZoom(zoom) {
  localStorage.setItem('zoomTransform', JSON.stringify(zoom));
}

const ForceGraphDAG = React.memo(({ onNodeClick, data }) => {
  const svgRef = useRef();
  const gRef = useRef(); // Reference for the group element

  useEffect(() => {
    if (!data) return;

    const width = 928;
    const height = 680;

    // Clear existing elements
    d3.select(svgRef.current).selectAll('*').remove();

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    // Restore node positions if saved
    const savedPositions = JSON.parse(localStorage.getItem('nodePositions'));
    if (savedPositions) {
      nodes.forEach(node => {
        const savedNode = savedPositions.find(n => n.id === node.id);
        if (savedNode) {
          node.fx = savedNode.x;
          node.fy = savedNode.y;
          node.x = savedNode.x;
          node.y = savedNode.y;
        }
      });
    }

    // Set a specific node position (optional)
    let specificNodeId = "environmental impact";
    let specificNode = nodes.find(node => node.id === specificNodeId);
    if (!specificNode) {
      specificNodeId = "economic impact";
      specificNode = nodes.find(node => node.id === specificNodeId);
    }
    if (specificNode) {
      specificNode.fx = width / 2;
      specificNode.fy = height - 50;
    }

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Setup SVG and group element
    const svgElement = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svgElement.append('g');
    gRef.current = g;

    // Set up zoom behavior
    const zoom = d3.zoom()
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        saveZoom(event.transform);
      });

    svgElement.call(zoom);

    // Apply saved zoom transform if available
    const savedZoom = JSON.parse(localStorage.getItem('zoomTransform'));
    if (savedZoom) {
      svgElement.call(zoom.transform, d3.zoomIdentity.translate(savedZoom.x, savedZoom.y).scale(savedZoom.k));
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force('collide', d3.forceCollide().radius(d => d.id.length * 5 + 20))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    g.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#fff');

    const link = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => d.value * .6)
      .attr('marker-end', 'url(#arrowhead)');

    d3.select('#arrowhead')
      .data(links)
      .attr('markerWidth', d => d.value * .6)
      .attr('markerHeight', d => d.value * .6);

    const nodeRadius = 10;

    const node = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => d.id === specificNodeId ? "#fff" : color(d.colour))
      .on('click', (event, d) => {
        onNodeClick(event, d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    g.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 25)
      .text(d => d.id)
      .attr('fill', d => d.id === specificNodeId ? "#fff" : color(d.colour));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => adjustLinkEndpoint(d.target, d.source, 2 * nodeRadius).x)
        .attr('y2', d => adjustLinkEndpoint(d.target, d.source, 2 * nodeRadius).y);
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      g.selectAll('text')
        .attr('x', d => d.x + 12)
        .attr('y', d => d.y);

      saveNodePositions(nodes);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }

    function adjustLinkEndpoint(target, source, nodeRadius) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const scale = Math.sqrt(dx * dx + dy * dy);

      const scaledX = dx * (scale - nodeRadius) / scale;
      const scaledY = dy * (scale - nodeRadius) / scale;

      return { x: source.x + scaledX, y: source.y + scaledY };
    }

    return () => {
      simulation.stop();
    };
  }, [onNodeClick, data]);

  return <svg ref={svgRef}></svg>;
});

export default ForceGraphDAG;
