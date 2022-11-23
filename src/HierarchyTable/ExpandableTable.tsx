import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import Header from "./Header";
import { TRowData, ICol, TSortType } from "./hierarchytable";
import { flattenRows, getSortedRowMap } from "./HierarchyTableHelpers";
import TableRow from "./TableRow";
import "./hierarchytable.less";

interface IExpTableProps {
  rows: TRowData[];
  columns: ICol[];
  defaultPageSize?: number;
}

const getPaginatedRows = (currentShowingRows: string[], currentPage: number, pageSize: number) => {
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = firstPageIndex + pageSize;
  return currentShowingRows.slice(firstPageIndex, lastPageIndex);
};

const ExpandableTable = (props: IExpTableProps) => {
  const { rows, columns, defaultPageSize } = props;
  const defaultrowMap = flattenRows(rows);
  const [sortKey, updateSortKey] = useState("");
  const [sortType, updateSortType] = useState<TSortType>("none");
  const [pageSize, setPageSize] = useState((defaultPageSize as number) || 7);

  const [rowMap, setRowMap] = useState(defaultrowMap);
  const rowKeys = Array.from(rowMap.keys());
  const [currentPage, setCurrentPage] = useState(1);
  const defaultColumnWidth = `repeat( ${columns.length}, minmax(50px,1fr))`;

  const defaultColumnStyle = {
    gridTemplateColumns: defaultColumnWidth,
  };

  const [columnStyle, setColumnStyle] = useState<React.CSSProperties>(defaultColumnStyle);

  const handleColumnStyle = (colStyle: React.CSSProperties) => setColumnStyle(colStyle);

  const currentShowingRows = rowKeys.filter((d) => rowMap.get(d)?.show);
  const paginatedRows = getPaginatedRows(currentShowingRows, currentPage, pageSize);
  const totalCount = currentShowingRows.length;

  useEffect(() => {
    setRowMap(defaultrowMap);
  }, [rows]);

  useEffect(() => {
    const sortedRowMap = getSortedRowMap(sortKey, sortType, rows);
    setRowMap(sortedRowMap);
  }, [sortKey, sortType]);

  const updateExpandonRows = (rowKey: string, expanded: boolean, action: string) => {
    const consolidatedMap = structuredClone(rowMap);
    let rowInfo = consolidatedMap.get(rowKey) as TRowData;
    rowInfo.expanded = expanded;
    updateChildren(consolidatedMap, rowInfo.children as TRowData[], expanded, action, true);
    setRowMap(consolidatedMap);
  };

  const updateChildren = (
    consolidatedMap: Map<string, TRowData>,
    rowInfoArray: TRowData[],
    expanded: boolean,
    action: string,
    isFirstChild: boolean
  ) => {
    rowInfoArray.forEach((rowInfo) => {
      const eachRow = structuredClone(rowInfo);
      eachRow.expanded = action === "hideChildren" ? false : !expanded;
      if (action === "showChildren") {
        eachRow.show = isFirstChild ? true : false;
      } else eachRow.show = false;

      consolidatedMap.set(rowInfo.id, eachRow);
      if (rowInfo.children && rowInfo.children.length > 0) {
        updateChildren(consolidatedMap, eachRow.children as TRowData[], expanded, action, false);
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  return (
    <div className="exp-table-wrapper">
      <div className="table-feat-container">
        <span>Page Size</span>
        <input
          type="number"
          className="page-size-input"
          value={pageSize}
          min={5}
          max={100}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        ></input>
      </div>
      <div className="bmd-grid-container" style={columnStyle}>
        <Header
          columns={columns}
          sortType={sortType}
          updateSortKey={updateSortKey}
          updateSortType={updateSortType}
          sortKey={sortKey}
          updateColumnWidth={handleColumnStyle}
        />
        {paginatedRows.map((rowKey, _rowIndex) => {
          const rowData = rowMap.get(rowKey) as TRowData;

          const handleExpand = (rowKey: string, action: string) => {
            updateExpandonRows(rowKey, !rowData.expanded as boolean, action);
          };

          return (
            <React.Fragment key={rowKey}>
              <TableRow
                rowData={rowData}
                rowKey={rowKey}
                columns={columns}
                handleExpand={(rowKey, action) => handleExpand(rowKey, action)}
              />
            </React.Fragment>
          );
        })}
      </div>
      {totalCount === 0 && <div className="bmd-exp-no-rec-error">No records found</div>}
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
