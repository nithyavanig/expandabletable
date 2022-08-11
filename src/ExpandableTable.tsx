import React, { useState } from "react";
import { columns, getRowMap, IRowData } from "./data";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import rfdc from "rfdc";
import Pagination from "./pagination";
import { current } from "@reduxjs/toolkit";

const TableHeader = () => {
  return (
    <div className="header-container">
      {columns.map((col) => {
        return <div className="col-wrapper">{col.name}</div>;
      })}
    </div>
  );
};

const clone = rfdc();
let pageSize = 10;

// const paginatedRows = ()
const getPaginatedRows = (
  currentShowingRows: string[],
  currentPage: number
) => {
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = firstPageIndex + pageSize;
  return currentShowingRows.slice(firstPageIndex, lastPageIndex);
};

const ExpandableTable = () => {
  const defaultrowMap = getRowMap();
  const [rowMap, setRowMap] = useState(defaultrowMap);
  const rowKeys = Array.from(rowMap.keys());
  const [currentPage, setCurrentPage] = useState(1);

  const currentShowingRows = rowKeys.filter((d) => rowMap.get(d)?.show);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const paginatedRows = getPaginatedRows(currentShowingRows, currentPage);
  const totalCount = currentShowingRows.length;

  const updateExpandonRows = (
    rowKey: string,
    expanded: boolean,
    action: string
  ) => {
    const consolidatedMap = clone(rowMap);
    let rowInfo = consolidatedMap.get(rowKey) as IRowData;
    rowInfo.expanded = expanded;
    updateChildren(
      consolidatedMap,
      rowInfo.children as IRowData[],
      expanded,
      action,
      true
    );
    setRowMap(consolidatedMap);
  };

  const updateChildren = (
    consolidatedMap: Map<string, IRowData>,
    rowInfoArray: IRowData[],
    expanded: boolean,
    action: string,
    isFirstChild: boolean
  ) => {
    rowInfoArray.forEach((rowInfo) => {
      const eachRow = clone(rowInfo);
      eachRow.expanded = action === "hideChildren" ? false : !expanded;
      if (action === "showChildren") {
        eachRow.show = isFirstChild ? true : false;
      } else eachRow.show = false;

      consolidatedMap.set(rowInfo.id, eachRow);
      if (rowInfo.children && rowInfo.children.length > 0) {
        updateChildren(
          consolidatedMap,
          eachRow.children as IRowData[],
          expanded,
          action,
          false
        );
      }
    });
  };

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
      {paginatedRows.map((rowKey, rowIndex) => {
        const rowData = rowMap.get(rowKey) as IRowData;
        const isChild = !rowData.children || rowData?.children.length === 0;
        const leftPadding =
          rowData.level === 1 ? 0 : (rowData.level as number) * 20;
        const isExpanded = rowData.expanded;
        const [expand, toggleExpand] = useState(isExpanded);

        const handleExpand = (rowKey: string, action: string) => {
          updateExpandonRows(rowKey, !rowData.expanded as boolean, action);
          // const hasExpanded = expand;
          // toggleExpand(!hasExpanded);
        };

        const rowStyle: React.CSSProperties = {
          paddingLeft: `${leftPadding}px`,
        };

        const expanded = isExpanded ? "expanded" : "";
        const shouldShow =
          rowData.show === undefined || rowData.show ? "show" : "hide";
        const rowClassNameExpCollapse = `table-row ${shouldShow}`;

        return (
          <div className={rowClassNameExpCollapse} key={`row-${rowData.id}`}>
            <div className={`row-item exp-col-icon`} style={rowStyle}>
              <span>
                {!isChild && !isExpanded ? (
                  <FaPlusSquare
                    onClick={() => handleExpand(rowKey, "showChildren")}
                  />
                ) : (
                  !isChild && (
                    <FaMinusSquare
                      onClick={() => handleExpand(rowKey, "hideChildren")}
                    />
                  )
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
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page: number) => handlePageChange(page)}
      />
    </div>
  );
};

export default ExpandableTable;
