export interface IRowData {
  id: string;
  type?: string;
  name?: string;
  level?: number;
  expanded?: boolean;
  blt?: string;
  mrdm?: string;
  description?: string;
  children?: IRowData[];
}

export const columns = [
  {
    name: "exp",
    id: "col-exp",
  },
  {
    name: "type",
    id: "col-type",
  },
  {
    name: "blt",
    id: "col-blt",
  },
  {
    name: "mrdm",
    id: "col-mrdm",
  },
  {
    name: "description",
    id: "col-description",
  },
];

export const hierarchyData = [
  {
    id: "Lev1#1",
    type: "Use Case Section",
    level: 1,
    name: "Test_1 Section",
    blt: "blt1",
    mrdm: "SDF:23#",
    description: "long desc",
    children: [
      {
        id: "Lev1#1-Lev2#1",
        type: "Use Case Line Item",
        level: 2,
        name: "Test_1 Line Item",
        blt: "",
        description: "long desc",
        children: [
          {
            id: "Lev1#1-Lev2#1-Lv3#1",
            type: "Use Case Data Element",
            level: 3,
            mrdm: "FGRT@34",
            name: "Test_1 Data Element 1",
            blt: "",
            description: "long desc",
          },
          {
            id: "Lev1#1-Lev2#1-Lv3#2",
            type: "Use Case Data Element",
            level: 3,
            mrdm: "PLKJ$%",
            name: "Test_1 Data Element 2",
            blt: "",
            description: "long desc",
          },
        ],
      },
    ],
  },
  {
    id: "Lev1#2",
    type: "Use Case Section",
    level: 1,
    name: "Test_1 Section",
    blt: "blt1",
    description: "long desc",
    children: [
      {
        id: "Lev1#2-Lev2#1",
        type: "Use Case Line Item",
        level: 2,
        name: "Test_1 Line Item",
        blt: "",
        description: "long desc",
        children: [
          {
            id: "Lev1#2-Lev2#1-Lev3#1",
            type: "Use Case Data Element",
            level: 3,
            mrdm: "FRG#56",
            name: "Test_1 Data Element 1",
            blt: "",
            description: "long desc",
          },
          {
            id: "Lev1#2-Lev2#1-Lev3#2",
            type: "Use Case Data Element",
            level: 3,
            mrdm: "KLUP&34",
            name: "Test_1 Data Element 2",
            blt: "",
            description: "long desc",
          },
        ],
      },
      {
        id: "Lev1#2-Lev2#2",
        type: "Use Case Line Item",
        level: 2,
        mrdm: "RTYJUK",
        name: "Test_2 Line Item",
        blt: "",
        description: "long desc",
        children: [
          {
            id: "Lev1#2-Lev2#2-Lev3#1",
            type: "Use Case Data Element",
            level: 3,
            mrdm: "SDE$67",
            name: "Test_2 Data Element 1",
            blt: "",
            description: "long desc",
          },
          {
            id: "Lev1#2-Lev2#2-Lev3#2",
            type: "Use Case Data Element",
            level: 3,
            mrdm: "EFGT%67",
            name: "Test_2 Data Element 2",
            blt: "",
            description: "long desc",
          },
        ],
      },
    ],
  },
];

export const getRowMap = (): Map<string, IRowData> => {
  const rowMap = flattenRows(hierarchyData);
  return rowMap;
};

const rowMap: Map<string, IRowData> = new Map();

const flattenRows = (treeData: any) => {
  treeData.forEach((rowData: IRowData) => {
    rowMap.set(rowData.id, rowData);
    if (rowData?.children && rowData.children.length > 0) {
      flattenRows(rowData.children);
    }
  });
  return rowMap;
};
