import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import data from './data.json';

const ForceGraphDAG = React.memo(({ onNodeClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 928;
    const height = 680;

    // Clear existing elements
    d3.select(svgRef.current).selectAll('*').remove();

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', zoomed))
      .append('g');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-480))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => d.value);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', d => color(d.colour))
      .on('click', (event, d) => {
        onNodeClick(event, d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Append text to each node
    const text = svg.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle') // Center the text horizontally
      .attr('dy', 25)
      .text(d => d.id)
      .attr('fill', d => color(d.colour)) // Change 'blue' to the desired color; // Assuming you have an 'id' property in your node data;

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // Update text positions along with nodes
      text.attr('x', d => d.x + 12)
          .attr('y', d => d.y);
    });

    function zoomed(event) {
      svg.attr('transform', event.transform);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [onNodeClick]);

  return <svg ref={svgRef}></svg>;
});

export default ForceGraphDAG;
