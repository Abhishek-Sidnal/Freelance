import React from "react";
import DTable from "./components/DTable";
import { DTableProvider } from "./context/DTableContext";

const App = () => {
  return (
    <div className="app">
      <h2>Table</h2>
      <DTableProvider>
        <DTable />
      </DTableProvider>
    </div>
  );
};

export default App;
