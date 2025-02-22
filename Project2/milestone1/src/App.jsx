import React from "react";
import ChartComponent from "./components/ChartComponent";
import { barData } from "../a";

function App() {
  return (
    <>
      <ChartComponent data={barData} width={850} height={400} />
    </>
  );
}

export default App;
