import { TRowData, TSortType } from "./hierarchytable";

export const getSortedRowMap = (sortKey: string, sortType: TSortType, defaultData: TRowData[]) => {
  let sortedRows;
  let data = structuredClone(defaultData);
  if (sortType === "reset") {
    sortedRows = data;
  } else {
    sortedRows = data.sort((a: TRowData, b: TRowData) => {
      let sortVal = 0;
      let row1Value = (a[sortKey as keyof TRowData] as string) ?? "";
      let row2Value = (b[sortKey as keyof TRowData] as string) ?? "";

      if (sortType === "asc") {
        sortVal = row1Value.toLowerCase().localeCompare(row2Value.toLowerCase());
      }
      if (sortType === "desc") {
        sortVal = row2Value.toLowerCase().localeCompare(row1Value.toLowerCase());
      }
      return sortVal;
    });
  }

  const flatSortedRows = flattenRows(sortedRows);
  return flatSortedRows;
};

let rowMap: Map<string, TRowData> = new Map();

export const flattenRows = (treeData: any, isInitial: boolean = true) => {
  if (isInitial) rowMap = new Map();
  treeData.forEach((rowData: TRowData) => {
    let rowKey = rowData.id;
    rowMap.set(rowKey, rowData);
    if (rowData?.children && rowData.children.length > 0) {
      flattenRows(rowData.children, false);
    }
  });
  return rowMap;
};

export const getLeftPadding = (rowData: any) => {
  let leftPadding = 0;
  const isChild = !rowData.children || rowData.children.length === 0;

  if (rowData.level === 1) {
    leftPadding = 0;
  } else if (rowData.level > 1) {
    leftPadding = (rowData.level as number) * 15;
  }
  return leftPadding;
};

export const getAllColumnWidth = (colSize: number, colIndex: number, currentColWidth: number) => {
  let columnWidth: string[] = [];
  for (let i = 0; i < colSize; i++) {
    const eachCol = document.getElementsByClassName("bmd-table-header")[i];
    const colWidth = i === colIndex ? currentColWidth : eachCol.getBoundingClientRect().width;
    columnWidth[i] = `${colWidth}px`;
  }
  return columnWidth.join(" ");
};
