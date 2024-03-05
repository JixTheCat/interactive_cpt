import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import getJSONData from './export_data.js';

// Code to persist node positions
function saveNodePositions(nodes) {
  // Save node positions in localStorage or in your backend
  // For example, save positions in localStorage
  localStorage.setItem('nodePositions', JSON.stringify(nodes.map(d => ({ id: d.id, x: d.x, y: d.y }))));
}

const ForceGraphDAG = React.memo(({ onNodeClick }) => {
  const svgRef = useRef();
  const [data, setData] = useState(null); // State to hold your JSON data
  let initialDataPromise = getJSONData(); // Start fetching immediately

  initialDataPromise.then(data => {
    setData(data);
  }).catch(error => {
    console.error("Failed to fetch initial data:", error);
  });

  useEffect(() => {
    // Ensure data is available before proceeding
    console.log('in app');
    console.log(data);

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
    }
    // Define the initial position for the specific node
    var specificNodeId = "environmental impact";
    var specificNode = nodes.find(node => node.id === specificNodeId);
    specificNode.fx = width / 2; // center horizontally
    specificNode.fy = height - 50; // bottom of the graph
    // specificNode.fill = color(5);
    

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', zoomed))
      .append('g');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('collide', d3.forceCollide().radius(50)) // Adjust the radius as needed
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaDecay(0.20); // Higher decay rate means faster cooling;

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') // Added for scaling the arrow properly
      // .attr('refX', 0) // Adjust this value to position the arrow correctly relative to the node
      // .attr('refY', 0)
      // .attr('markerWidth', 2)
      // .attr('markerHeight', 2)
      .attr('orient', 'auto')
    .append('path')
      .attr('d', 'M0,-5L10,0L0,5') // A simple arrow shape
      .attr('fill', '#fff'); // Arrow color

    const link = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => d.value*.6)
      .attr('marker-end', 'url(#arrowhead)');

    // Update marker position based on link value
    d3.select('#arrowhead')
      .data(links)
      .attr('markerWidth', d => d.value*.6)
      .attr('markerHeight', d => d.value*.6);

    const nodeRadius = 10

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => {
        // Check if the current node's id matches the target node's id
        if (d.id === specificNodeId) {
          return "#fff"; // Return the specific color for the target node
        } else {
          return color(d.colour); // Return the default color for other nodes
        }
      })
      .on('click', (event, d) => {
        onNodeClick(event, d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    specificNode.fill = color(7);
    // Append text to each node
    const text = svg.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 25)
      .text(d => d.id)
      .attr('fill', d => {
        // Check if the current node's id matches the target node's id
        if (d.id === specificNodeId) {
          return "#fff"; // Return the specific color for the target node
        } else {
          return color(d.colour); // Return the default color for other nodes
        }
      });

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => adjustLinkEndpoint(d.target, d.source, 2*nodeRadius).x)
        .attr('y2', d => adjustLinkEndpoint(d.target, d.source, 2*nodeRadius).y);
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
      if (!event.active) simulation.alphaTarget(.005);
      saveNodePositions(nodes)
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
  }, [onNodeClick]);

  return <svg ref={svgRef}></svg>;
});

export default ForceGraphDAG;
