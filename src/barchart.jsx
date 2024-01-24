import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  // Sample data for the bar chart
  const data = [10, 20, 30, 40, 50];

  useEffect(() => {
    // Set up the SVG container dimensions
    const width = 400;
    const height = 200;

    // Create the SVG container within the chart-container div
    const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create bars based on the data
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 80) // Bar width and gap
      .attr("y", d => height - d)  // Invert the bar height for better visualization
      .attr("width", 70)
      .attr("height", d => d);

    // Add text labels to the bars
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d)
      .attr("x", (d, i) => i * 80 + 35) // Center text within the bar
      .attr("y", d => height - d + 15)  // Position text slightly above the bar
      .attr("text-anchor", "middle");   // Center text horizontally
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div>
      <h1>React D3.js Bar Chart Example</h1>
      {/* Create a container for the chart */}
      <div id="chart-container"></div>
    </div>
  );
};

export default BarChart;