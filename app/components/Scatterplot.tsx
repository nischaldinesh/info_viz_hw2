"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

type ScatterplotProps = {
  data: number[][];
  width: number;
  height: number;
  onBrush: (selected: number[][]) => void;
  highlightedIndices?: Set<number>;
};

const Scatterplot: React.FC<ScatterplotProps> = ({
  data,
  width,
  height,
  onBrush,
  highlightedIndices = new Set(),
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brushRef = useRef<d3.BrushBehavior<any> | null>(null);
  const brushSelectionRef = useRef<[[number, number], [number, number]] | null>(
    null
  );

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[0]) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    g.append("g").call(d3.axisLeft(yScale).ticks(10));

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 4)
      .attr("fill", (d, i) =>
        highlightedIndices.has(i) ? "red" : "steelblue"
      );

    if (!brushRef.current) {
      brushRef.current = d3
        .brush()
        .extent([
          [0, 0],
          [innerWidth, innerHeight],
        ])
        .on("brush", (event) => {
          if (!event.sourceEvent) return;
          if (!event.selection) return;
          const [[x0, y0], [x1, y1]] = event.selection;
          const selectedData = data.filter(
            (d) =>
              xScale(d[0]) >= x0 &&
              xScale(d[0]) <= x1 &&
              yScale(d[1]) >= y0 &&
              yScale(d[1]) <= y1
          );
          const selectedIndices = new Set(
            selectedData.map((d) => `${d[0]},${d[1]}`)
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          g.selectAll("circle").attr("fill", (d: any) =>
            selectedIndices.has(`${d[0]},${d[1]}`) ? "red" : "steelblue"
          );
        })
        .on("end", (event) => {
          if (!event.sourceEvent) return;
          if (!event.selection) return;
          const selection = event.selection as [
            [number, number],
            [number, number]
          ];
          brushSelectionRef.current = selection;

          const [[x0, y0], [x1, y1]] = selection;
          const selectedData = data.filter(
            (d) =>
              xScale(d[0]) >= x0 &&
              xScale(d[0]) <= x1 &&
              yScale(d[1]) >= y0 &&
              yScale(d[1]) <= y1
          );
          if (selectedData.length > 0) {
            onBrush(selectedData);
          }
        });
    }

    const brushGroup = g
      .append("g")
      .attr("class", "brush")
      .call(brushRef.current);
    if (brushSelectionRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      brushGroup.call(brushRef.current.move as any, brushSelectionRef.current);
    }

    brushGroup.select(".overlay").style("pointer-events", "all");
    brushGroup
      .selectAll(".selection")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "rgba(0, 0, 255, 0.3)")
      .attr("fill-opacity", 0.3)
      .style("display", "block")
      .style("cursor", "move");
  }, [data, width, height, onBrush, highlightedIndices]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default Scatterplot;
