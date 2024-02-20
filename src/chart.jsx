import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import data from './data.json';

// Code to persist node positions
function saveNodePositions(nodes) {
  // Save node positions in localStorage or in your backend
  // For example, save positions in localStorage
  localStorage.setItem('nodePositions', JSON.stringify(nodes.map(d => ({ id: d.id, x: d.x, y: d.y }))));
}

const ForceGraphDAG = React.memo(({ onNodeClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 928;
    const height = 680;

    // Clear existing elements
    d3.select(svgRef.current).selectAll('*').remove();

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    var savedPositions = JSON.parse(localStorage.getItem('nodePositions'));

    if (savedPositions) {
        // Update node positions
        nodes.forEach(node => {
            var savedNode = savedPositions.find(n => n.id === node.id);
            if (savedNode) {
                node.x = savedNode.x;
                node.y = savedNode.y;
            }
        });
    } else {
      // Define the initial position for the specific node
      var specificNodeId = "environmental impact";
      var specificNode = nodes.find(node => node.id === specificNodeId);
      specificNode.fx = width / 2; // center horizontally
      specificNode.fy = height - 50; // bottom of the graph
    }

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', zoomed))
      .append('g');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).strength(0.005))
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-600))
      // .force('collide', d3.forceCollide().radius(100)) // Adjust the radius as needed
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaDecay(0.15); // Higher decay rate means faster cooling;

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') // Added for scaling the arrow properly
      .attr('refX', 22.5) // Adjust this value to position the arrow correctly relative to the node
      .attr('refY', 0)
      .attr('markerWidth', 25)
      .attr('markerHeight', 25)
      .attr('orient', 'auto')
    .append('path')
      .attr('d', 'M0,-5L10,0L0,5') // A simple arrow shape
      .attr('fill', '#fff'); // Arrow color

    const link = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-opacity', 0.4)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => d.value/20)
      .attr('marker-end', 'url(#arrowhead)');
      // .attr('refX', d => d.value);

    // Update marker position based on link value
    // d3.select('#arrowhead')
    //   .data(links)
    //   .attr('refY', 5);
      // .attr('refX', d => d.value*2);

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
      // if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(.15);
      saveNodePositions(nodes)
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
