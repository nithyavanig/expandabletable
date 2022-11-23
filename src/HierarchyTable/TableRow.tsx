import React, { useState } from "react";
import { ICol, IColFormatter, TRowData } from "./hierarchytable";
import { getLeftPadding } from "./HierarchyTableHelpers";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { VscTriangleRight, VscTriangleDown } from "react-icons/vsc";

interface ITableRowProps {
  rowData: TRowData;
  columns: ICol[];
  rowKey: string;
  handleExpand: (rowKey: string, action: "showChildren" | "hideChildren") => void;
}

interface IRowLabelProps {
  rowLabel: string;
  style: React.CSSProperties;
  column?: ICol;
  rowExpand: boolean;
  setRowExpand: (param: boolean) => void;
}

const RowLabel = (props: IRowLabelProps) => {
  const { rowLabel, column, rowExpand, setRowExpand } = props;
  const [showExpandIcon, setShowExpandIcon] = useState(false);
  const rowClassName = rowExpand ? "bmd-row-word-wrap" : "bmd-row-wrap";

  const handleRowExpandToggle = () => setRowExpand(!rowExpand);

  const labelTextStyle = {
    display: rowExpand ? "block" : "inline",
  };

  return (
    <div className="row-item" onMouseOver={() => setShowExpandIcon(true)} onMouseLeave={() => setShowExpandIcon(false)}>
      <p className={rowClassName}>
        <span style={labelTextStyle}>{rowLabel}</span>
      </p>
      {showExpandIcon && rowLabel !== "" && column?.wordWrap && (
        <span className="row-icon-expand" onClick={handleRowExpandToggle}>
          {!rowExpand ? <MdExpandMore size={"14"} /> : <MdExpandLess size={"14"} />}
        </span>
      )}
    </div>
  );
};

const RowFormatter = ({
  style,
  row,
  rowFormat,
}: {
  style: React.CSSProperties;
  row: any;
  rowFormat: IColFormatter;
}) => {
  return (
    <div className="row-item" style={style}>
      {rowFormat(undefined, row)}
    </div>
  );
};

const TableRow = (props: ITableRowProps) => {
  const { rowData, rowKey, handleExpand, columns } = props;
  const [rowExpand, setRowExpand] = useState(false);

  const isChild = !rowData.children || rowData?.children.length === 0;
  const isExpanded = rowData.expanded;
  const shouldShow = rowData.show === undefined || rowData.show ? "show" : "hide";

  return (
    <React.Fragment key={`row-${rowData.id}`}>
      {columns.map((col) => {
        const colStyle = {
          minWidth: col.width ? col.width + "px" : "100%",
        };
        const label = rowData[col.id] ?? "";
        if (col.showExpand) {
          const labelStyle = {
            paddingLeft: `${getLeftPadding(rowData)}px`,
            paddingRight: "5px",
          };

          return (
            <div className={`row-item ${shouldShow}`} style={labelStyle}>
              <div>
                <span className="exp-col-icon">
                  {!isChild && !isExpanded ? (
                    <VscTriangleRight size={15} onClick={() => handleExpand(rowKey, "showChildren")} />
                  ) : (
                    !isChild && <VscTriangleDown size={15} onClick={() => handleExpand(rowKey, "hideChildren")} />
                  )}
                </span>
              </div>
              <RowLabel
                rowLabel={label}
                style={colStyle}
                column={col}
                rowExpand={rowExpand}
                setRowExpand={setRowExpand}
              />
            </div>
          );
        } else {
          return col.formatter ? (
            <RowFormatter row={rowData} style={colStyle} rowFormat={col.formatter} />
          ) : (
            col.visible && (
              <RowLabel
                rowLabel={label}
                style={colStyle}
                column={col}
                rowExpand={rowExpand}
                setRowExpand={setRowExpand}
              />
            )
          );
        }
      })}
    </React.Fragment>
  );
};

export default TableRow;
