import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
// import DataTable from './DataTable';
import "./ChartComponent2.scss";
import { IoBarChartSharp } from "react-icons/io5";
import { FaTableList } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { TbCaretUpDownFilled } from "react-icons/tb";
import DataTable from "./DataTable";

const ChartComponent = ({ data, width = 800, height = 400 }) => {
  const [selectedCategory, setSelectedCategory] = useState(data[0].label);
  const [tooltipData, setTooltipData] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [activeTab, setActiveTab] = useState("chart");
  const [showKeyDetails, setShowKeyDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const svgRef = useRef();

  const selectedData = useMemo(() => data.find(d => d.label === selectedCategory)?.products || [], [selectedCategory, data]);
  const keys = useMemo(() => (selectedData.length ? Object.keys(selectedData[0].data) : []), [selectedData]);

  const defaultColors = useMemo(() => {
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    return Object.fromEntries(keys.map((key, i) => [key, colorScale(i)]));
  }, [keys]);

  const displayedKeys = selectedKeys.length > 0 ? selectedKeys : keys;

  const stats = useMemo(() => {
    if (!selectedData.length) return { totalSum: 0, keySums: {}, percentages: {}, formattedData: [] };

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

  const drawChart = useCallback(() => {
    if (!selectedData.length || activeTab !== "chart") return;

    const { formattedData } = stats;
    const margin = { top: 30, right: 30, bottom: 80, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const xScale = d3.scaleBand()
      .domain(selectedData.map(d => d.productName))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d3.sum(displayedKeys, k => d[k]))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const stackGenerator = d3.stack().keys(displayedKeys);
    const layers = stackGenerator(formattedData);

    const bars = svg.selectAll(".layer")
      .data(layers)
      .enter()
      .append("g")
      .attr("fill", d => defaultColors[d.key]);

    bars.selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data.productName))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("mousemove", (event, d) => {
        setTooltipData({
          productName: d.data.productName,
          values: displayedKeys.map(k => ({
            key: k,
            value: d.data[k],
            color: defaultColors[k]
          })),
        });
      })
      .on("mouseleave", () => setTooltipData(null));

    const xAxis = svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    xAxis.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));
  }, [selectedCategory, stats, width, height, displayedKeys, defaultColors, activeTab]);

  useEffect(() => {
    if (activeTab === "chart") drawChart();
  }, [drawChart, activeTab]);

  useEffect(() => {
    setSelectedKeys([]);  // Reset selected keys on category change
    setSortConfig({ key: null, direction: "asc" });  // Reset sorting on category change
  }, [selectedCategory]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };


  const sortedData = useMemo(() => {
    if (!sortConfig.key) return stats.formattedData;

    const sorted = [...stats.formattedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.direction === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [sortConfig, stats.formattedData]);

  // Function to toggle key details
  const toggleKeyDetails = (key) => {
    setShowKeyDetails(showKeyDetails === key ? null : key); // Toggle visibility of key details
  };

  return (
    <div className="stacked-bar-container">
      <div className="summary-wrapper">
        <div className="summary">
          <span className="summary-title">Total {selectedCategory} Sold</span>
          <p className="summary-total">{stats.totalSum || 0}</p>
          {Object.entries(stats.keySums || {}).map(([key, value]) => (
            <div
              key={key}
              className={`key-item ${selectedKeys.includes(key) ? "selected" : ""}`}
              onClick={() => setSelectedKeys(selectedKeys.includes(key) ? selectedKeys.filter(k => k !== key) : [...selectedKeys, key])}
            >
              <div className="header">
                <span className="key-circle" style={{ backgroundColor: defaultColors[key] }}></span>
                <strong style={{ color: defaultColors[key] }}>{key}</strong>
                <button className="details-button" onClick={(e) => { e.stopPropagation(), toggleKeyDetails(key) }}>
                  <SlOptions />
                </button>
              </div>
              <div className="body">
                <span>{value} </span>
                <span>{stats.percentages[key]}%</span>
              </div>
              {showKeyDetails === key && (
                <div className="key-details" onClick={(e) => e.stopPropagation()} >
                  <button className="close-button" onClick={(e) => { e.stopPropagation(), toggleKeyDetails(key) }}>×</button>
                  <div className="key-details-header">
                    <span>{key}</span>
                    <span>
                      {stats.keySums[key]}
                    </span>
                  </div>
                  {selectedData.map(product => (
                    <div key={product.productName} className="product-details">
                      <span>{product.productName}: </span>
                      <strong>{product.data[key]}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        <div className="section-header">
          <div className="tabs">
            {data.map(({ label }) => (
              <button
                key={label}
                onClick={() => {
                  setSelectedCategory(label);
                  setSelectedKeys([]);  // Reset selected keys when changing the label
                }}
                className={`tab-button ${selectedCategory === label ? "active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="sub-tabs">
            <button className={`sub-tab   ${activeTab === "chart" ? "active" : ""}`} onClick={() => setActiveTab("chart")}>
              <IoBarChartSharp />
            </button>
            <button className={`sub-tab  ${activeTab === "table" ? "active" : ""}`} onClick={() => setActiveTab("table")}>
              <FaTableList />
            </button>
          </div>
        </div>

        {
          selectedKeys.length > 0 &&

          <button className="clear-btn" onClick={() => setSelectedKeys([])}>
            Clear All Selection
          </button>
        }
        {activeTab === "chart" ? (
          <>
            {tooltipData && (
              <div className="tooltip visible">
                <h3 className="strong">{tooltipData.productName}</h3>
                {tooltipData.values.map((item, index) => (
                  <div className="data" key={index}>
                    <div className="label">
                      <span className="key-circle" style={{ backgroundColor: item.color }}></span>
                      <span> {item.key}</span>
                    </div>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
            <svg ref={svgRef} className="chart-c" />
          </>
        ) : (
          <DataTable
            displayedKeys={displayedKeys} sortedData={sortedData} sortConfig={sortConfig} handleSort={handleSort}
          />
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
