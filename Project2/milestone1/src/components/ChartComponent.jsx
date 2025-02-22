import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import "./ChartComponent.scss"; // Import SCSS

const ChartComponent = ({ data, width = 800, height = 400, colors = d3.schemeCategory10 }) => {
  const [selectedCategory, setSelectedCategory] = useState(data[0].label);
  const [tooltipContent, setTooltipContent] = useState(null);
  const svgRef = useRef();
  const tooltipRef = useRef();

  const selectedData = useMemo(() => data.find(d => d.label === selectedCategory)?.products || [], [selectedCategory, data]);
  const keys = useMemo(() => (selectedData.length ? Object.keys(selectedData[0].data) : []), [selectedData]);

  // Compute statistics (Memoized)
  const stats = useMemo(() => {
    if (!selectedData.length) return { totalSum: 0, keySums: {}, percentages: {} };

    const formattedData = selectedData.map(d => ({ productName: d.productName, ...d.data }));

    const totalSum = formattedData.reduce((sum, d) => sum + d3.sum(keys, k => d[k]), 0);
    const keySums = keys.reduce((acc, key) => {
      acc[key] = d3.sum(formattedData, d => d[key]);
      return acc;
    }, {});

    const percentages = Object.fromEntries(
      Object.entries(keySums).map(([key, value]) => [key, ((value / totalSum) * 100).toFixed(2)])
    );

    return { totalSum, keySums, percentages, formattedData };
  }, [selectedData, keys]);

  useEffect(() => {
    if (!selectedData.length) return;

    const { formattedData } = stats;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const xScale = d3.scaleBand()
      .domain(selectedData.map(d => d.productName))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d3.sum(keys, k => d[k]))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(colors).domain(keys);
    const stackGenerator = d3.stack().keys(keys);
    const layers = stackGenerator(formattedData);

    // Append Groups for Stacked Bars
    const bars = svg.selectAll(".layer")
      .data(layers)
      .enter()
      .append("g")
      .attr("fill", d => colorScale(d.key));

    bars.selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data.productName))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("mouseover", (_, d) => {
        const values = keys.map(k => ({
          key: k,
          value: d.data[k],
          color: colorScale(k)
        }));

        setTooltipContent(
          <div>
            <h3 className="strong">{d.data.productName}</h3>
            {values.map(v => (
              <div className="data" key={v.key}>
                <div className="label">
                  <span className="key-circle" style={{ backgroundColor: v.color }}></span>
                  <span> {v.key}</span>
                </div>
                <span>{v.value}</span>
              </div>
            ))}
          </div>
        );
      })
      .on("mouseout", () => setTooltipContent(null));

    // X-Axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Y-Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));
  }, [selectedCategory, stats, width, height, colors]);

  return (
    <div className="stacked-bar-container">
      {/* SideBar */}
      <div className="summary">
        <span className="summary-title">Total {selectedCategory} Sold</span>
        <p className="summary-total">{stats.totalSum || 0}</p>
        {Object.entries(stats.keySums || {}).map(([key, value], index) => (
          <div key={key} className="key-item">
            <div className="header">
              <span className="key-circle" style={{ backgroundColor: d3.schemeCategory10[index] }}></span>
              <strong style={{ color: d3.schemeCategory10[index] }}>{key}</strong>
            </div>
            <div className="body">
              <span>{value} </span>
              <span>{stats.percentages[key]}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-wrapper">
        {/* Tabs */}
        <div className="tabs">
          {data.map(({ label }) => (
            <button
              key={label}
              onClick={() => setSelectedCategory(label)}
              className={`tab-button ${selectedCategory === label ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tooltip */}

        <div className={`tooltip ${tooltipContent ? "visible" : ""}`} ref={tooltipRef}>
          {tooltipContent}
        </div>

        {/*  Chart */}
        <svg ref={svgRef} className="chart-c" />
      </div>
    </div>
  );
};

export default ChartComponent;
