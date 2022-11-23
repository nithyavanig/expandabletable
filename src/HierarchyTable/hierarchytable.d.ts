import React from "react";

export type TSortType = "asc" | "desc" | "reset" | "none";

export interface ISortProps {
  sortType: TSortType;
  sortKey: string;
}

export type TPrimitive = string | number;

export type TRowData = any;

export interface IRowData {
  id?: string;
  name?: string;
  level?: number;
  expanded?: boolean;
  description?: string;
  children?: IRowData[];
  show?: boolean;
  data: any;
}

export interface ICol {
  name: string;
  id: string;
  visible?: boolean;
  width?: TPrimitive;
  sort?: boolean;
  wordWrap?: boolean;
  showExpand?: boolean;
  formatter?: IColFormatter;
}

export type IColFormatter = (
  cell: any,
  row: any,
  rowIndex?: number
) => React.ReactNode | JSX.Element;
