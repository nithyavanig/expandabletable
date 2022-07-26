import React, { useState } from "react";
import { columns, getRowMap, IRowData } from "./data";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";

const TableHeader = () => {
  return (
    <div className="header-container">
      {columns.map((col) => {
        return <div className="col-wrapper">{col.name}</div>;
      })}
    </div>
  );
};

const ExpandableTable = () => {
  const defaultrowMap = getRowMap();
  const [rowMap, setRowMap] = useState(defaultrowMap);
  const rowKeys = Array.from(rowMap.keys());
  return (
    <div className="table-container">
      <div className="table-row header">
        <div className="row-item">Exp</div>
        <div className="row-item">Name</div>
        <div className="row-item">Type</div>
        <div className="row-item">BLT</div>
        <div className="row-item">MRDM</div>
        <div className="row-item">Description</div>
      </div>
      {rowKeys.map((rowKey, rowIndex) => {
        const rowData = rowMap.get(rowKey) as IRowData;
        const isChild = !rowData.children || rowData?.children.length === 0;
        const leftPadding = (rowData.level as number) * 5;
        const isExpanded = rowData.expanded;
        const [expand, toggleExpand] = useState(isExpanded);

        const handleExpand = () => {
          const hasExpanded = expand;
          toggleExpand(!hasExpanded);
        };

        const rowStyle: React.CSSProperties = {
          paddingLeft: `${leftPadding}px`,
        };

        const expanded = isExpanded ? "expanded" : "";
        const rowClassNameExpCollapse = `table-row ${expanded}`;

        return (
          <div className={rowClassNameExpCollapse}>
            <div className={`row-item`} style={rowStyle}>
              <span>
                {!isChild && !isExpanded ? (
                  <FaPlusSquare onClick={handleExpand} />
                ) : (
                  !isChild && <FaMinusSquare onClick={handleExpand} />
                )}
              </span>
            </div>
            <div className="row-item">{rowData.name}</div>
            <div className="row-item">{rowData?.type}</div>
            <div className="row-item">{rowData?.blt}</div>
            <div className="row-item">{rowData?.mrdm}</div>
            <div className="row-item">{rowData?.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpandableTable;
