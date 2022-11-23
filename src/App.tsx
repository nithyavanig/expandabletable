import React from "react";
import { columns, hierarchyData } from "./data";
import ExpandableTable from "./HierarchyTable/ExpandableTable";
// import ExpandableTable from "./ExpandableTable";

const App = () => (
  <div className="app">
    <ExpandableTable rows={hierarchyData} columns={columns} />
  </div>
);

export default App;
