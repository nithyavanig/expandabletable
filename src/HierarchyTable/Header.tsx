import { BsSortUp, BsSortDown } from "react-icons/bs";
import React, { useState } from "react";
import { FaSort } from "react-icons/fa";
import { ICol, TSortType } from "./hierarchytable";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { getAllColumnWidth } from "./HierarchyTableHelpers";

interface THeaderProps {
  columns: ICol[];
  sortType: TSortType;
  updateSortKey: (param: string) => void;
  updateSortType: (param: TSortType) => void;
  sortKey: string;
  updateColumnWidth: (param: React.CSSProperties) => void;
}

const Header = (props: THeaderProps) => {
  const { updateSortKey, updateSortType, sortKey, sortType, columns, updateColumnWidth } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>();

  const handleMouseDown = (columnIndex: number) => setActiveIndex(columnIndex);

  const toggleSortIcon = (colId: string) => {
    let mSortType: TSortType = "reset";
    if (sortType === "asc") mSortType = "desc";
    if (sortType === "desc") mSortType = "reset";
    if (sortType === "reset" || sortType === "none") mSortType = "asc";
    updateSortKey(colId);
    updateSortType(mSortType);
  };

  const sortIcon = sortType === "asc" ? <BsSortUp /> : sortType === "desc" ? <BsSortDown /> : <FaSort />;

  return (
    <>
      {columns.map((col, colIndex) => {
        const colSortIcon = sortKey === col.id ? sortIcon : <FaSort />;
        let currentColWidth;
        const [pos, setPos] = useState({ x: 0, y: 0 });

        const onDragHandler = (e: DraggableEvent, data: DraggableData) => {};

        const handleStop = (e: DraggableEvent, data: DraggableData) => {
          const eve = e as MouseEvent;
          const currentCol = document.getElementsByClassName("bmd-table-header")[colIndex];
          currentColWidth = currentCol.getBoundingClientRect().width;
          setActiveIndex(null);
          const allColWidth = getAllColumnWidth(columns.length, colIndex, currentColWidth + data.x);
          updateColumnWidth(structuredClone({ gridTemplateColumns: allColWidth }));
          setPos({ x: 0, y: 0 });
        };

        return (
          <div className="bmd-table-header" key={col.id}>
            <span className="bmd-row-header-label">{col.name}</span>
            {colIndex > 0 && col.sort && (
              <span className="bmd-row-header-sort" onClick={() => toggleSortIcon(col.id)}>
                {colSortIcon}
              </span>
            )}
            <Draggable axis="x" onDrag={onDragHandler} onStop={handleStop} position={pos}>
              <div
                draggable
                onMouseDown={() => handleMouseDown(colIndex)}
                className={`resize-handle ${activeIndex === colIndex ? "active" : "idle"}`}
              ></div>
            </Draggable>
          </div>
        );
      })}
    </>
  );
};

export default Header;
