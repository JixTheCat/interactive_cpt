import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import data from './data.json';

const ForceGraphDAG = () => {
  const svgRef = useRef();
  const links = data.links.map(d => ({ ...d }));
  const nodes = data.nodes.map(d => ({ ...d }));
  
  useEffect(() => {  
    const width = 928;
    const height = 680;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // // Sample data for the DAG
    // const nodes = [
    //   { id: 'A' },
    //   { id: 'B' },
    //   { id: 'C' },
    //   { id: 'D' },
    // ];

    // const links = [
    //   { source: 'A', target: 'B' },
    //   { source: 'B', target: 'C' },
    //   { source: 'C', target: 'D' },
    // ];

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', zoomed))
      .append('g');
    // const svg = d3.create("svg")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("viewBox", [-width / 2, -height / 2, width, height])
    //   .attr("style", "max-width: 100%; height: auto;");

    // Create a force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).strength(2))
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // // Create links
    // const link = svg.selectAll('.link')
    //   .data(links)
    //   .enter().append('line')
    //   .attr('class', 'link');
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    // // Create nodes
    // const node = svg.selectAll('.node')
    //   .attr("stroke", "#fff")
    //   .attr("stroke-width", 1.5)
    //   .data(nodes)
    //   .enter().append('circle')
    //     .attr('class', 'node')
    //     .attr('r', 5)
    //     .attr("fill", d => color(d.group))
    //   .call(d3.drag()
    //     .on('start', dragstarted)
    //     .on('drag', dragged)
    //     .on('end', dragended));
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", d => color(d.group));

    // // Add labels to nodes
    // const label = svg.selectAll('.label')
    //   .data(nodes)
    //   .enter().append('text')
    //   .attr('class', 'label')
    //   .attr('dy', 3)
    //   .attr('text-anchor', 'middle')
    //   .text(d => d.id);

    // Update positions of nodes, links, and labels during each tick of the simulation
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      //   label
        //     .attr('x', d => d.x)
        //     .attr('y', d => d.y);

    // Add a drag behavior.
    node.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));
  });

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

    function zoomed(event) {
      svg.attr('transform', event.transform);
    }
  
    return () => {
      simulation.stop(); // Stop the simulation when the component unmounts
    };
  }, [links, nodes]); // Empty dependency array ensures useEffect runs only once

  return (
    <svg ref={svgRef}></svg>
  );
};

export default ForceGraphDAG;
