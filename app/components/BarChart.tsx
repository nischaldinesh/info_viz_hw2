"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

type BarChartProps = {
  data: number[][];
};

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const meanX = d3.mean(data, (d) => d[0])!;
    const meanY = d3.mean(data, (d) => d[1])!;

    const chartData = [
      { label: "X", value: meanX },
      { label: "Y", value: meanY },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400,
      height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value)! * 1.1])
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    g.append("g").call(d3.axisLeft(yScale));

    g.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label)!)
      .attr("y", (d) => yScale(d.value)!)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value)!)
      .attr("fill", (d) => (d.label === "X" ? "lightgreen" : "lightblue"));

    const lineExtensionAbove = 40;
    const lineExtensionInside = 40;

    g.selectAll(".bar-line")
      .data(chartData)
      .enter()
      .append("line")
      .attr("class", "bar-line")
      .attr("x1", (d) => xScale(d.label)! + xScale.bandwidth() / 2)
      .attr("x2", (d) => xScale(d.label)! + xScale.bandwidth() / 2)
      .attr("y1", (d) => yScale(d.value) - lineExtensionAbove)
      .attr("y2", (d) => yScale(d.value) + lineExtensionInside)
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }, [data]);

  return <svg ref={svgRef} width={400} height={300}></svg>;
};

export default BarChart;
