import React from "react";
import { useMediaQuery } from "react-responsive";
import { barData } from '../data'
import ChartComponent from "./components/ChartComponent";
const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  const width = isMobile ? 300 : isTablet ? 600 : 850;
  const height = isMobile ? 250 : isTablet ? 400 : 450;

  return (
    <div className="chart-container">
      <ChartComponent data={barData} width={width} height={height} />
    </div>
  );
};

export default App;
